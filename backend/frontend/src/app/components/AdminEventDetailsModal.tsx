"use client";

import { X, MapPin, Calendar, Clock, Users, Phone, Mail, Globe, Instagram, Facebook, Youtube, ImageIcon } from "lucide-react";
import { Button } from "./ui/Button";

interface AdminEventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: any;
}

export function AdminEventDetailsModal({ isOpen, onClose, event }: AdminEventDetailsModalProps) {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Event Details</h2>
                        <p className="text-sm text-zinc-500">ID: {event.id}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Basic Info */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative aspect-video w-full md:w-1/3 rounded-lg overflow-hidden bg-zinc-100">
                            <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{event.title}</h1>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <Calendar className="h-4 w-4 text-[#f98109]" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <Clock className="h-4 w-4 text-[#f98109]" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <MapPin className="h-4 w-4 text-[#f98109]" />
                                    <span>{event.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <Users className="h-4 w-4 text-[#f98109]" />
                                    <span>Capacity: {event.capacity || "N/A"}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-md text-sm font-medium ${event.price === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {event.price === 0 ? "Free Event" : `Price: ₹${event.price}`}
                                </span>
                                <span className="px-2 py-1 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                                    {event.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Description</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed  bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                            {event.description}
                        </p>
                    </div>

                    {/* Organizer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" /> Organizer Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={event.organizer?.avatar || event.creator?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown"}
                                        className="w-10 h-10 rounded-full bg-zinc-100"
                                    />
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-white">{event.organizer?.name || event.organizerName || "Unknown"}</p>
                                        <p className="text-xs text-zinc-500">Organizer ID: {event.creatorId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <Mail className="h-4 w-4" />
                                    {event.organizer?.email || event.organizerEmail || "N/A"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <Phone className="h-4 w-4" />
                                    {event.organizer?.phone || event.phone || event.organizerPhone || "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Location & Socials */}
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-purple-500" /> Location & Socials
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{event.address || event.location} <br /> <a href={`https://maps.google.com/?q=${encodeURIComponent(event.address || event.location)}`} target="_blank" className="text-blue-500 hover:underline">View on Map</a></span>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    {(event.social?.instagram || event.socialInstagram) && (
                                        <a href={event.social?.instagram || event.socialInstagram} target="_blank" className="text-pink-600 hover:opacity-80"><Instagram className="h-5 w-5" /></a>
                                    )}
                                    {(event.social?.facebook || event.socialFacebook) && (
                                        <a href={event.social?.facebook || event.socialFacebook} target="_blank" className="text-blue-600 hover:opacity-80"><Facebook className="h-5 w-5" /></a>
                                    )}
                                    {(event.social?.youtube || event.socialYoutube) && (
                                        <a href={event.social?.youtube || event.socialYoutube} target="_blank" className="text-red-600 hover:opacity-80"><Youtube className="h-5 w-5" /></a>
                                    )}
                                    {!event.social && !event.socialInstagram && <span className="text-sm text-zinc-400 italic">No social links provided</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Past Event Gallery */}
                    {(event.gallery?.length > 0) && (
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-purple-500" />
                                Past Event Photos
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {event.gallery.map((img: string, idx: number) => (
                                    <div key={idx} className="aspect-square relative rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                                        <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}
