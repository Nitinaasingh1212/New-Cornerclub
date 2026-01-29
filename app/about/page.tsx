import { Button } from "@/app/components/ui/Button";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                        We are <span className="text-[#f98109]">CornerClub.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Building the future of social event discovery. We believe in connecting people through shared experiences and meaningful conversations.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
                            <Image
                                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000"
                                alt="Community gathering"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Our Mission</h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                CornerClub was born from a simple idea: meaningful connections happen when people come together over shared interests. In a digital-first world, we are bringing the focus back to real-world interactions.
                            </p>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Our platform isn&apos;t just about booking tickets. It&apos;s about bridging the gap between &quot;going&quot; and &quot;belonging&quot;. With features like pre-event community chats, we ensure you never walk into a room of strangers.
                            </p>
                            <Button size="lg">Join our Community</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section (Placeholder) */}
            {/* Values Section */}
            <section className="py-20 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">What Drives Us</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="mb-4 rounded-full bg-orange-100 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f98109" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Community First</h3>
                            <p className="text-zinc-500">Every feature we build is designed to foster genuine belonging and inclusivity.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="mb-4 rounded-full bg-orange-100 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f98109" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Safety & Trust</h3>
                            <p className="text-zinc-500">Verified profiles and secure booking ensure you can focus on having fun.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="mb-4 rounded-full bg-orange-100 p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f98109" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Real Connections</h3>
                            <p className="text-zinc-500">We prioritize face-to-face interactions over digital engagement metrics.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
