import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProfile, Message } from '../types';
import { MOCK_USERS } from '../constants';
import { generateChatReply } from '../services/geminiService';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatProps {
  currentUser: UserProfile;
}

export const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const matchUser = MOCK_USERS.find(u => u.id === userId);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTyping]);

  useEffect(() => {
    // Reset history when entering a new chat for demo purposes
    // In a real app, we would load from store/DB
    if (matchUser) {
        setHistory([{
            id: 'init',
            senderId: matchUser.id,
            text: `Hi ${currentUser.name}! I noticed we matched. I'd love to help you with ${currentUser.skillsWanted[0] || 'your goals'}!`,
            timestamp: Date.now()
        }]);
    }
  }, [userId, matchUser, currentUser]);

  const handleSend = async () => {
    if (!messageText.trim() || !matchUser) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: messageText,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, newMsg]);
    setMessageText('');
    setIsTyping(true);

    // AI Response
    const replyText = await generateChatReply(currentUser, matchUser, [...history, newMsg]);
    
    setIsTyping(false);
    
    const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: matchUser.id,
        text: replyText,
        timestamp: Date.now()
    };

    setHistory(prev => [...prev, replyMsg]);
  };

  if (!matchUser) {
      return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-gray-500">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
                <img src={matchUser.avatar} alt={matchUser.name} className="w-10 h-10 rounded-full object-cover" />
                {matchUser.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
            <div>
                <h2 className="font-bold text-gray-900 text-sm md:text-base">{matchUser.name}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    {matchUser.skillsOffered[0]?.name} • {matchUser.skillsWanted[0]}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-full"><Phone className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full"><Video className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 no-scrollbar">
        {history.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMe 
                        ? 'bg-brand-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-200' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            );
        })}
        {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
             </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
            <input 
                type="text" 
                className="flex-1 border-gray-200 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={!messageText.trim() || isTyping}
                className={`p-3 rounded-full text-white transition-all ${
                    !messageText.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'
                }`}
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};