import React, { useEffect, useState } from 'react';
import { UserProfile, MatchResult } from '../types';
import { findMatchesWithGemini } from '../services/geminiService';
import { Sparkles, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchesProps {
  user: UserProfile;
}

export const Matches: React.FC<MatchesProps> = ({ user }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const results = await findMatchesWithGemini(user);
      setMatches(results);
      setLoading(false);
    };

    if (user.skillsWanted.length > 0 || user.skillsOffered.length > 0) {
        fetchMatches();
    }
  }, [user]);

  return (
    <div className="space-y-6">
       <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-yellow-500 fill-yellow-500" />
            Smart Matches
            </h1>
            <p className="text-gray-500">AI-powered suggestions based on your skills.</p>
        </div>
        {loading && <div className="flex items-center gap-2 text-brand-600 animate-pulse text-sm font-medium"><Loader2 className="animate-spin w-4 h-4"/> Analyzing skills...</div>}
      </header>

      {!loading && matches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No matches found. Try adding more skills to your profile!</p>
          </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
            <div key={match.user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={match.user.avatar} alt={match.user.name} className="w-12 h-12 rounded-full object-cover" />
                                {match.user.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{match.user.name}</h3>
                                <div className="flex items-center gap-1">
                                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{width: `${match.matchScore}%`}}></div>
                                    </div>
                                    <span className="text-xs text-green-600 font-bold">{match.matchScore}% Match</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-600 bg-brand-50/50 p-3 rounded-xl border border-brand-100">
                        <span className="font-semibold text-brand-700">Why?</span> {match.matchReason}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Teaches</p>
                            <div className="flex flex-wrap gap-1">
                                {match.user.skillsOffered.slice(0, 3).map(s => (
                                    <span key={s.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">{s.name}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Wants</p>
                            <div className="flex flex-wrap gap-1">
                                {match.user.skillsWanted.slice(0, 3).map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                    <button 
                        onClick={() => navigate(`/chat/${match.user.id}`)}
                        className="w-full bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4" /> Start Conversation
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};