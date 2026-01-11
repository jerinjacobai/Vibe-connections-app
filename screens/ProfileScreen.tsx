import React, { useRef } from 'react';
import { Settings, Edit2, Activity, Star, Plus, Trash2, Camera } from 'lucide-react';
import { Button } from '../components/Button';
import { MyProfileData } from '../types';

interface ProfileScreenProps {
    onEditPreferences?: () => void;
    profile: MyProfileData;
    onUpdateProfile: (data: Partial<MyProfileData>) => void;
    onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onEditPreferences, profile, onUpdateProfile, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateProfile({ mainImage: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateProfile({ gallery: [...profile.gallery, reader.result as string] });
          };
          reader.readAsDataURL(file);
      }
  };

  const removeGalleryImage = (index: number) => {
      const newGallery = [...profile.gallery];
      newGallery.splice(index, 1);
      onUpdateProfile({ gallery: newGallery });
  };

  return (
    <div className="h-full flex flex-col items-center p-6 overflow-y-auto bg-black hide-scrollbar">
        {/* Hidden File Inputs */}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleMainImageUpload}
        />
        <input 
            type="file" 
            ref={galleryInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleGalleryUpload}
        />

        <div className="relative mb-6 mt-8 group">
            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600">
                <div className="w-full h-full rounded-full border-4 border-black overflow-hidden relative">
                    <img src={profile.mainImage} alt="My Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={24} className="text-white" />
                    </div>
                </div>
            </div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-gray-900 p-2.5 rounded-full border border-gray-700 text-white hover:bg-gray-800 transition-colors shadow-lg"
            >
                <Edit2 size={14} />
            </button>
        </div>

        <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{profile.name}, {profile.age}</h2>
        <div className="flex items-center gap-2 mb-8">
             <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                 Chill Vibe
             </div>
             <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
             <p className="text-gray-400 text-sm">{profile.bio}</p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 mb-8 w-full max-w-sm">
            <div className="flex-1 bg-gray-900/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Activity size={20} />
                </div>
                <span className="font-bold text-xl text-white">42</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Vibes</span>
            </div>
            <div className="flex-1 bg-gray-900/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(250,204,21,0.2)] z-10">
                    <Star size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-xl text-white z-10">9.4</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold z-10">Rating</span>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full max-w-sm mb-8">
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">My Photos</h3>
                 <span className="text-[10px] text-gray-600">{profile.gallery.length} / 6</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {profile.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => removeGalleryImage(idx)}
                                className="p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Add Photo Button */}
                {profile.gallery.length < 6 && (
                    <button 
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center gap-2 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                            <Plus size={16} className="text-gray-400 group-hover:text-cyan-400" />
                        </div>
                    </button>
                )}
            </div>
        </div>

        <div className="w-full max-w-sm space-y-4 pb-24">
             <Button 
                fullWidth 
                variant="glass" 
                className="justify-start px-6 bg-gray-900/50 border-white/5 h-14"
                onClick={onEditPreferences}
             >
                <Settings className="mr-3 text-gray-400" size={20} />
                <span className="text-gray-200">Vibe Preferences</span>
             </Button>
             
             <div className="relative overflow-hidden p-6 rounded-3xl border border-blue-500/30 text-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="relative z-10">
                    <h3 className="font-black text-white text-lg mb-1 italic tracking-wider">VIBE <span className="text-blue-400">BLUE</span></h3>
                    <p className="text-xs text-blue-200 mb-4 max-w-[200px] mx-auto leading-relaxed">See who vibed with you, unlimited swipes, and advanced filters.</p>
                    <button className="bg-white text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        Upgrade
                    </button>
                </div>
             </div>
             
             <div className="pt-4 text-center">
                <button 
                    onClick={onLogout}
                    className="text-xs text-gray-600 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                    Log Out
                </button>
             </div>
        </div>
    </div>
  );
};