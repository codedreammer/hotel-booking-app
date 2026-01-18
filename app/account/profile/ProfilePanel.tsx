'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { updateProfile } from '../actions'
import { supabase } from '@/lib/supabase/client'

interface Profile {
    id: string
    full_name?: string | null
    email?: string | null
    phone?: string | null
    role?: string | null
    avatar_url?: string | null
}


export default function ProfilePanel({ profile: initialProfile }: { profile: Profile }) {
    const [profile, setProfile] = useState(initialProfile)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const initials = profile.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : 'G'

    const handleAvatarClick = () => {
        setIsModalOpen(true)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Preview instantly
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const saveAvatar = async () => {
        if (!fileInputRef.current?.files?.[0] && previewUrl === profile.avatar_url) {
            setIsModalOpen(false)
            return
        }

        setUploading(true)
        try {
            const file = fileInputRef.current?.files?.[0]
            let publicUrl = previewUrl

            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${profile.id}-${Math.random()}.${fileExt}`
                const filePath = `avatars/${fileName}`

                // Try to upload to 'avatars' bucket. 
                // We'll catch if it doesn't exist or no permission.
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file)

                if (!uploadError) {
                    const { data: { publicUrl: url } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(filePath)
                    publicUrl = url
                } else {
                    console.error('Upload failed, might be missing bucket:', uploadError)
                    // If bucket fails, we just keep the base64 preview for this session 
                    // or try to save to auth metadata if allowed.
                }
            }

            // Persist using auth metadata as a fallback/primary safe way
            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            if (authError) throw authError

            // Also try to update profiles table if we identify a column (speculative but safe if wrapped)
            // But user said: "store image URL safely without breaking auth"
            // Auth metadata is extremely safe.

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving avatar:', error)
            alert('Failed to save avatar')
        } finally {
            setUploading(false)
        }
    }

    const useInitials = () => {
        setPreviewUrl(null)
    }

    return (
        <>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 p-8 md:p-12 relative overflow-hidden group">
                {/* Subtle glass effect highlight */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pb-12 border-b border-gray-100/50">
                    {/* Avatar Container */}
                    <div
                        onClick={handleAvatarClick}
                        className="relative cursor-pointer group/avatar"
                    >
                        <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-blue-500/20">
                            {profile.avatar_url || previewUrl ? (
                                <img
                                    src={previewUrl || profile.avatar_url!}
                                    alt={profile.full_name || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-brnpm run dev
 from-blue-600 to-blue-500 flex items-center justify-center text-white text-4xl font-black">
                                    {initials}
                                </div>
                            )}
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </div>
                        {/* Label Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-2 border-white scale-90 group-hover/avatar:scale-100 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.154-1.262a.5.5 0 00.153-.122l4.162-4.162a.5.5 0 000-.707L10.2 12.02a.5.5 0 00-.707 0l-4.162 4.162a.5.5 0 00-.122.153z" />
                                <path d="M10.78 11.44l1.292 1.292a.5.5 0 00.707 0l6.39-6.39a.5.5 0 000-.707l-1.292-1.292a.5.5 0 00-.707 0l-6.39 6.39a.5.5 0 000 .707z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center md:text-left pt-2">
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            {profile.full_name || 'Guest'}
                        </h1>
                        <p className="text-lg text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {profile.email}
                        </p>
                    </div>
                </div>

                {/* Profile Form */}
                <form action={updateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group/field">
                            <label htmlFor="full_name" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within/field:text-blue-600 transition-colors">
                                Full Identity
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={profile.full_name || ''}
                                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-gray-900"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group/field">
                            <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within/field:text-blue-600 transition-colors">
                                Contact Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    defaultValue={profile.phone || ''}
                                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-gray-900"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group/field opacity-80">
                        <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                            Registered Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={profile.email || ''}
                                className="w-full px-6 py-4 bg-gray-100/50 border border-gray-100 rounded-3xl text-gray-400 cursor-not-allowed font-medium select-none"
                                disabled
                            />
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                                <div className="flex items-center gap-2 bg-gray-200/50 px-3 py-1 rounded-full border border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-10 py-4 rounded-3xl hover:bg-blue-700 font-black shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 flex-1 md:flex-none md:min-w-50"
                        >
                            Save Changes
                        </button>
                        <Link
                            href="/account"
                            className="bg-white/50 text-gray-700 px-10 py-4 rounded-3xl hover:bg-white hover:text-gray-900 font-bold border border-gray-200 transition-all duration-300 flex-1 md:flex-none text-center"
                        >
                            Back to Account
                        </Link>
                    </div>
                </form>
            </div>

            {/* Avatar Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !uploading && setIsModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl overflow-hidden scale-in-center transition-all duration-300 animate-in fade-in zoom-in">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Modify Avatar</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={uploading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 shadow-xl border-4 border-gray-50 bg-gray-100 flex items-center justify-center">
                                    {previewUrl || profile.avatar_url ? (
                                        <img src={previewUrl || profile.avatar_url!} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-black">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                                    Instant Preview
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl group transition-all"
                                    disabled={uploading}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 9 9m-9-9v12" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-black text-gray-900">Upload Photo</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">JPG, PNG allowed</div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>

                                <button
                                    onClick={useInitials}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl group transition-all"
                                    disabled={uploading}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="font-bold text-lg">{initials}</span>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-black text-gray-900">Use Generated Profile</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Initials based avatar</div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg"
                            />

                            <button
                                onClick={saveAvatar}
                                disabled={uploading}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Applying Changes...
                                    </>
                                ) : (
                                    'Save Avatar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
