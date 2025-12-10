import React, { useState } from 'react';
import { UserProfile, Skill } from '../types';
import { Plus, X, Award, Search } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (u: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [newOffer, setNewOffer] = useState('');
  const [newWant, setNewWant] = useState('');

  const addOffer = () => {
    if (!newOffer.trim()) return;
    const skill: Skill = {
      id: Date.now().toString(),
      name: newOffer,
      level: 'Intermediate' // Default
    };
    onUpdate({
      ...user,
      skillsOffered: [...user.skillsOffered, skill]
    });
    setNewOffer('');
  };

  const removeOffer = (id: string) => {
    onUpdate({
      ...user,
      skillsOffered: user.skillsOffered.filter(s => s.id !== id)
    });
  };

  const addWant = () => {
    if (!newWant.trim()) return;
    if (user.skillsWanted.includes(newWant)) return;
    onUpdate({
      ...user,
      skillsWanted: [...user.skillsWanted, newWant]
    });
    setNewWant('');
  };

  const removeWant = (name: string) => {
    onUpdate({
      ...user,
      skillsWanted: user.skillsWanted.filter(s => s !== name)
    });
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage what you teach and what you want to learn.</p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative group">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-brand-50" />
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white text-xs">Edit</div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <textarea 
            className="w-full text-sm text-gray-600 bg-white border-gray-200 rounded-lg focus:ring-brand-500 focus:border-brand-500"
            rows={2}
            value={user.bio}
            onChange={(e) => onUpdate({...user, bio: e.target.value})}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-brand-600">
             <Award className="w-5 h-5" />
             <h3 className="font-semibold text-lg">Skills I Can Teach</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skillsOffered.map(skill => (
              <span key={skill.id} className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm">
                {skill.name} <span className="opacity-50 text-xs">({skill.level})</span>
                <button onClick={() => removeOffer(skill.id)} className="hover:text-brand-900"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {user.skillsOffered.length === 0 && <span className="text-gray-400 text-sm italic">No skills added yet.</span>}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add a skill (e.g. Photoshop)" 
              className="flex-1 rounded-lg border-gray-200 text-sm focus:ring-brand-500 focus:border-brand-500"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOffer()}
            />
            <button onClick={addOffer} className="bg-white border border-gray-200 text-gray-900 p-2 rounded-lg hover:bg-gray-50"><Plus className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
             <Search className="w-5 h-5" />
             <h3 className="font-semibold text-lg">Skills I Want to Learn</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {user.skillsWanted.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">
                {skill}
                <button onClick={() => removeWant(skill)} className="hover:text-emerald-900"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {user.skillsWanted.length === 0 && <span className="text-gray-400 text-sm italic">No interests added yet.</span>}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add interest (e.g. Spanish)" 
              className="flex-1 rounded-lg border-gray-200 text-sm focus:ring-brand-500 focus:border-brand-500"
              value={newWant}
              onChange={(e) => setNewWant(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addWant()}
            />
            <button onClick={addWant} className="bg-white border border-gray-200 text-gray-900 p-2 rounded-lg hover:bg-gray-50"><Plus className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};