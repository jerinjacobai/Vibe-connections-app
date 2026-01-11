import React, { useRef } from 'react';
import { Settings, Edit2, Activity, Star, Plus, Trash2, Camera, LogOut, Zap, MapPin } from 'lucide-react';
import { NeonButton } from '../components/NeonButton';
import { GlassCard } from '../components/GlassCard';
import { MyProfileData } from '../types';

interface ProfileScreenProps {
    onEditPreferences?: () => void;
    profile: MyProfileData;
    onUpdateProfile: (data: Partial<MyProfileData>) => void;
    onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onEditPreferences, profile, onUpdateProfile, onLogout }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState(profile.name);
    const [editBio, setEditBio] = React.useState(profile.bio);
    const [editAge, setEditAge] = React.useState(profile.age?.toString() || '');

    const handleSaveProfile = () => {
        onUpdateProfile({
            name: editName,
            bio: editBio,
            age: parseInt(editAge) || profile.age
        });
        setIsEditing(false);
    };

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
        <div className="h-full flex flex-col items-center p-6 overflow-y-auto bg-void hide-scrollbar font-outfit relative">
            {/* Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <GlassCard className="w-full max-w-sm p-6" variant="neon">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Edit2 size={20} className="text-neon-cyan" /> Edit Profile
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Name</label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-cyan/50 focus:bg-white/10 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Age</label>
                                <input
                                    value={editAge}
                                    onChange={(e) => setEditAge(e.target.value)}
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-cyan/50 focus:bg-white/10 outline-none transition-all"
                                    placeholder="24"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon-cyan/50 focus:bg-white/10 outline-none transition-all h-24 resize-none"
                                    placeholder="Tell us about your vibe..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <NeonButton
                                onClick={handleSaveProfile}
                                className="flex-1"
                                variant="primary"
                            >
                                Save Changes
                            </NeonButton>
                        </div>
                    </GlassCard>
                </div>
            )}

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

            <div className="relative mb-6 mt-4 group z-10">
                <div className="absolute inset-0 bg-neon-cyan/30 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-neon-cyan via-blue-500 to-neon-purple relative">
                    <div className="w-full h-full rounded-full border-4 border-black overflow-hidden relative bg-gray-900">
                        <img src={profile.mainImage} alt="My Profile" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                            <Camera size={32} className="text-white drop-shadow-lg" />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditName(profile.name);
                        setEditBio(profile.bio);
                        setEditAge(profile.age.toString());
                        setIsEditing(true);
                    }}
                    className="absolute bottom-1 right-1 bg-black p-3 rounded-full border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] z-20"
                >
                    <Edit2 size={16} />
                </button>
            </div>

            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-lg text-center">
                {profile.name}, <span className="text-gray-400 font-light">{profile.age}</span>
            </h2>

            <div className="flex items-center gap-3 mb-8">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-2">
                    <Activity size={12} className="text-neon-pink" />
                    Chill Vibe
                </div>
                <button
                    onClick={() => {
                        setEditName(profile.name);
                        setEditBio(profile.bio);
                        setEditAge(profile.age.toString());
                        setIsEditing(true);
                    }}
                    className="px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/50 text-neon-purple text-xs font-bold uppercase tracking-wider hover:bg-neon-purple/30 transition-colors"
                >
                    Edit Info
                </button>
            </div>

            <p className="text-gray-400 text-sm text-center max-w-xs leading-relaxed mb-8 italic">
                "{profile.bio}"
            </p>

            {/* Stats Row */}
            <div className="flex gap-4 mb-10 w-full max-w-sm">
                <GlassCard className="flex-1 p-4 flex flex-col items-center justify-center group" variant="dark">
                    <div className="w-12 h-12 rounded-full bg-neon-cyan/10 text-neon-cyan flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-neon-cyan/20">
                        <Activity size={24} />
                    </div>
                    <span className="font-black text-2xl text-white">42</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold group-hover:text-neon-cyan transition-colors">Vibes</span>
                </GlassCard>

                <GlassCard className="flex-1 p-4 flex flex-col items-center justify-center group" variant="dark">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-yellow-500/20">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <span className="font-black text-2xl text-white">9.4</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold group-hover:text-yellow-400 transition-colors">Rating</span>
                </GlassCard>
            </div>

            {/* Gallery Section */}
            <div className="w-full max-w-sm mb-8 z-10">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Camera size={14} /> My Photos
                    </h3>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-400">{profile.gallery.length} / 6</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {profile.gallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 shadow-lg">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <button
                                    onClick={() => removeGalleryImage(idx)}
                                    className="p-2 bg-red-500/20 rounded-full text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Photo Button */}
                    {profile.gallery.length < 6 && (
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-cyan group-hover:text-black transition-colors text-gray-500">
                                <Plus size={20} />
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full max-w-sm space-y-4 pb-24 z-10">
                <GlassCard
                    className="w-full p-4 flex items-center cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
                    variant="light"
                >
                    <div onClick={onEditPreferences} className="flex items-center w-full">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-4 text-gray-400">
                            <Settings size={20} />
                        </div>
                        <span className="flex-1 font-bold text-gray-200">Vibe Preferences</span>
                        <LogOut size={16} className="text-gray-600" />
                    </div>
                </GlassCard>

                <div className="relative overflow-hidden p-6 rounded-3xl border border-neon-blue/30 text-center group cursor-pointer shadow-[0_0_30px_rgba(45,0,247,0.15)] transition-all hover:shadow-[0_0_50px_rgba(45,0,247,0.3)] hover:border-neon-blue/60">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-black"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap size={24} className="text-neon-cyan fill-neon-cyan" />
                            <h3 className="font-black text-white text-2xl italic tracking-tighter">VIBE <span className="text-neon-blue">BLUE</span></h3>
                        </div>
                        <p className="text-xs text-blue-200 mb-6 max-w-[200px] mx-auto leading-relaxed opacity-80">
                            Unlimited swipes, see who likes you, and advanced vibe filters.
                        </p>
                        <NeonButton variant="primary" className="h-10 text-sm w-full shadow-neon-blue/50">
                            UPGRADE ACCESS
                        </NeonButton>
                    </div>
                </div>

                <div className="pt-4 text-center">
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center gap-2 mx-auto text-xs text-red-500/70 hover:text-red-500 transition-colors uppercase font-bold tracking-widest px-4 py-2 hover:bg-red-500/10 rounded-full"
                    >
                        <LogOut size={14} />
                        Log Out
                    </button>
                    <p className="text-[10px] text-gray-700 mt-4 font-mono">v1.2.0-beta</p>
                </div>
            </div>
        </div>
    );
};