import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MatchResult, Message } from '../types';
import { MOCK_USERS } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    // In a real app we might throw or handle this gracefully.
    // For now, we assume it's there as per instructions.
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const findMatchesWithGemini = async (currentUser: UserProfile): Promise<MatchResult[]> => {
  const ai = getClient();
  
  const candidatesJSON = JSON.stringify(MOCK_USERS.map(u => ({
    id: u.id,
    name: u.name,
    offers: u.skillsOffered.map(s => s.name),
    wants: u.skillsWanted
  })));

  const currentUserJSON = JSON.stringify({
    offers: currentUser.skillsOffered.map(s => s.name),
    wants: currentUser.skillsWanted
  });

  const prompt = `
    I have a user with this profile: ${currentUserJSON}.
    I have a list of candidate users: ${candidatesJSON}.
    
    Identify the top 3 best matches for a skill swap. 
    A good match is when the candidate offers what the user wants, AND/OR the user offers what the candidate wants.
    Two-way matches (both needs met) are the best.
    
    Return a JSON array of objects.
  `;

  // Define schema for structured output
  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        userId: { type: Type.STRING },
        matchScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating match quality" },
        matchReason: { type: Type.STRING, description: "A concise explanation of why this is a good match (e.g. 'You both want what the other has')" }
      },
      required: ["userId", "matchScore", "matchReason"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2 // Low temperature for consistent logic
      }
    });

    const rawMatches = JSON.parse(response.text || '[]');
    
    // Hydrate with full user objects
    const hydratedMatches: MatchResult[] = rawMatches.map((m: any) => {
      const user = MOCK_USERS.find(u => u.id === m.userId);
      if (!user) return null;
      return {
        user,
        matchScore: m.matchScore,
        matchReason: m.matchReason
      };
    }).filter((m: any) => m !== null);

    return hydratedMatches;

  } catch (error) {
    console.error("Matchmaking error:", error);
    return [];
  }
};

export const generateChatReply = async (
  currentUser: UserProfile,
  matchUser: UserProfile,
  chatHistory: Message[]
): Promise<string> => {
  const ai = getClient();

  // Format history for context
  const historyText = chatHistory.map(m => 
    `${m.senderId === currentUser.id ? 'Alex (Me)' : matchUser.name}: ${m.text}`
  ).join('\n');

  const systemInstruction = `
    You are roleplaying as ${matchUser.name}. 
    Your Bio: ${matchUser.bio}.
    Skills you have: ${matchUser.skillsOffered.map(s => s.name).join(', ')}.
    Skills you want: ${matchUser.skillsWanted.join(', ')}.
    
    You are chatting with ${currentUser.name} on the SkillSwap platform.
    Goal: Discuss how you can exchange skills. Be friendly, helpful, and concise (max 2-3 sentences).
    Do not use hashtags or emojis excessively.
  `;

  const prompt = `
    Here is the conversation so far:
    ${historyText}
    
    ${currentUser.name} just sent the last message. Respond as ${matchUser.name}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 150
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Chat generation error:", error);
    return "Sorry, I'm having trouble connecting right now.";
  }
};
