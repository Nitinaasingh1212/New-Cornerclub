import { Button } from "@/app/components/ui/Button";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-2 pb-2 lg:pt-6 lg:pb-8">
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
                    Discover events, <span className="block text-[#f98109]">build community.</span>
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    Book your tickets and instantly join exclusive chat rooms to connect with other attendees before the event even starts.
                </p>

            </div>
        </section>
    );
}
