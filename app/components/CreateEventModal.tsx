/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/firestore";
import { type Event } from "@/types";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const { addEvent } = useEvents();
    const { user } = useAuth(); // Get logged in user
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // ... imports
    const [formData, setFormData] = useState({
        title: "",
        city: "Lucknow",
        category: "Music",
        date: "",
        time: "",
        location: "", // Venue Name
        address: "", // Specific Address
        description: "",
        capacity: "",
        price: "",
        organizerName: user?.displayName || "",
        organizerPhone: "",
        socialInstagram: "",
        socialFacebook: "",
        socialYoutube: ""
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]); // State for past event photos
    const formRef = useRef<HTMLFormElement>(null);

    // Update organizerName if user loads late
    // useEffect(() => {
    //     if (user?.displayName && !formData.organizerName) {
    //         setFormData(prev => ({ ...prev, organizerName: user.displayName! }));
    //     }
    // }, [user]);

    // Load user profile to pre-fill phone
    useEffect(() => {
        if (user && isOpen) {
            getUserProfile(user.uid).then(profile => {
                if (!profile || !profile.name || !profile.email || !profile.phone) {
                    alert("You must complete your profile (Name, Email, Phone) before hosting an event.");
                    onClose();
                    router.push("/profile");
                } else if (profile.phone) {
                    setFormData(prev => ({ ...prev, organizerPhone: profile.phone }));
                }
            });
        }
    }, [user, isOpen]);

    // Helper to compress image
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800; // Resize to max 800px width
                    const scaleSize = MAX_WIDTH / img.width;
                    const newWidth = (scaleSize < 1) ? MAX_WIDTH : img.width;
                    const newHeight = (scaleSize < 1) ? img.height * scaleSize : img.height;

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, newWidth, newHeight);

                    // Compress to JPEG at 0.7 quality
                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                    resolve(compressedBase64);
                };
            };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Client-side compression
            try {
                const compressed = await compressImage(file);
                // Check approximate size (Base64 length * 0.75 = bytes)
                if (compressed.length > 1000000) { // ~1MB limit string length (safe margin)
                    alert("Image is still too large after compression. Please choose a smaller image.");
                    return;
                }
                setPreviewImage(compressed);
            } catch (err) {
                console.error("Compression error:", err);
                alert("Failed to process image.");
            }
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPhotos: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const compressed = await compressImage(file);
                    if (compressed.length < 1000000) {
                        newPhotos.push(compressed);
                    } else {
                        console.warn(`Skipped ${file.name} - too large`);
                    }
                } catch (err) {
                    console.error("Gallery upload error:", err);
                }
            }
            setGallery(prev => [...prev, ...newPhotos]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Final validation for phone
        if (!formData.organizerPhone) {
            alert("Phone number is required to host an event.");
            return;
        }

        // Validate at least one social media link
        if (!formData.socialInstagram && !formData.socialFacebook && !formData.socialYoutube) {
            alert("Please provide at least one social media link (Instagram, Facebook, or YouTube) so attendees can check your work.");
            return;
        }

        setLoading(true);
        console.log("Submitting form with data:", formData);

        const newEvent = {
            id: crypto.randomUUID(), // Changed to crypto.randomUUID()
            title: formData.title,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            city: formData.city,
            price: Number(formData.price) || 0,
            image: previewImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000", // Changed default image
            category: formData.category as any,
            description: formData.description,
            organizer: formData.organizerName || user.displayName || "Anonymous", // Changed to 'organizer'
            attendees: 0,
            isSaved: false, // Default
            creator: {
                name: user.displayName || "Anonymous",
                avatar: user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", // Changed default avatar seed
            },
            creatorId: user.uid,
            createdAt: new Date().toISOString(), // Added createdAt
            status: 'pending', // Added status
            phone: formData.organizerPhone, // Store phone in event too
            address: formData.address, // Ensure address is top level for map
            capacity: Number(formData.capacity) || 0, // Added capacity
            currency: "INR", // Added currency
            social: { // Added social links
                instagram: formData.socialInstagram,
                facebook: formData.socialFacebook,
                youtube: formData.socialYoutube
            },
            gallery: gallery // Add gallery to event object
        };

        try {
            await addEvent(newEvent);
            onClose();
            // Reset form
            setFormData({
                title: "",
                city: "Lucknow",
                category: "Music",
                date: "",
                time: "",
                location: "",
                address: "",
                description: "",
                capacity: "",
                price: "",
                organizerName: user?.displayName || "",
                organizerPhone: "",
                socialInstagram: "",
                socialFacebook: "",
                socialYoutube: ""
            });
            setPreviewImage(null);
            setGallery([]); // Reset gallery
            alert("Event submitted for approval!"); // Changed alert message
        } catch (error: any) {
            console.error("Error creating event:", error);
            alert(`Database Error:\n${error.message}\n\nPlease take a screenshot of this message.`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New Event</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>

                        {/* Image Upload Area */}
                        <div className="relative flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white transition-colors dark:border-zinc-700 dark:bg-zinc-800/50 overflow-hidden">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-zinc-500">
                                    <div className="rounded-full bg-white p-3 shadow-sm dark:bg-zinc-800">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-medium">Click to upload cover image</span>
                                    <span className="text-xs">Max 5MB</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Saturday Night Jam"
                                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">City</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    >
                                        <option>Lucknow</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    >
                                        <option>Music</option>
                                        <option>Food</option>
                                        <option>Comedy</option>
                                        <option>Fitness</option>
                                        <option>Tech</option>
                                        <option>Art</option>
                                        <option>Social</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Location Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Venue Name</label>
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Phoenix Palassio"
                                            className="h-10 w-full rounded-lg border border-zinc-300 pl-9 pr-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Map Link or Full Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Paste Google Maps link or type address"
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Organizer Details */}
                            <div className="space-y-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Organizer Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organizer Name</label>
                                    <input
                                        type="text"
                                        value={formData.organizerName}
                                        onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number (Required)</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.organizerPhone}
                                        onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                                        placeholder="+91..."
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="col-span-1 sm:col-span-3">
                                        <p className="text-xs text-orange-600 font-medium">Please provide at least one social media handle *</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500">Instagram Handle</label>
                                        <input
                                            type="text"
                                            value={formData.socialInstagram}
                                            onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                                            placeholder="@username"
                                            className="mt-1 h-8 w-full rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500">Facebook URL</label>
                                        <input
                                            type="text"
                                            value={formData.socialFacebook}
                                            onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                                            placeholder="facebook.com/..."
                                            className="mt-1 h-8 w-full rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500">YouTube Channel</label>
                                        <input
                                            type="text"
                                            value={formData.socialYoutube}
                                            onChange={(e) => setFormData({ ...formData, socialYoutube: e.target.value })}
                                            placeholder="youtube.com/..."
                                            className="mt-1 h-8 w-full rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Past Event Photos Section */}
                            <div className="space-y-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">Past Work Portfolio</h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {/* Upload Button */}
                                    <div className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700/50">
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <Upload className="h-6 w-6" />
                                            <span className="text-xs text-center px-2">Add Photos</span>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleGalleryUpload}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                    </div>

                                    {/* Gallery Previews */}
                                    {gallery.map((img, index) => (
                                        <div key={index} className="relative aspect-square overflow-hidden rounded-xl group">
                                            <img src={img} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-zinc-500">Upload photos from previous events to build trust (Max 5MB each).</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Tell us about the event..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        placeholder="50"
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0"
                                        className="mt-1 h-10 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-[#f98109] focus:outline-none focus:ring-1 focus:ring-[#f98109] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Hidden submit button to allow form submit on enter if needed, or just rely on external button with form attribute */}
                        <button type="submit" className="hidden" />
                    </form>
                </div >

                {/* Footer */}
                < div className="border-t border-zinc-100 p-4 dark:border-zinc-800 flex justify-end gap-3 bg-white dark:bg-zinc-900/50" >
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={() => formRef.current?.requestSubmit()}>Create Event</Button>
                </div >
            </div >
        </div >
    );
}
