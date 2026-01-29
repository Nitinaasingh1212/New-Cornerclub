"use client";

export default function TermsPage() {
    return (
        <div className="py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                        Terms & <span className="text-[#f98109]">Policy</span>
                    </h1>
                    <p className="mt-2 text-zinc-500">Last updated: January 2026</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Terms of Service */}
                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-4 text-xl font-bold text-[#f98109]">Terms of Service</h2>
                        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <li>• <strong>Agreement:</strong> By using CornerClub, you agree to these rules.</li>
                            <li>• <strong>Accounts:</strong> You are responsible for keeping your account secure.</li>
                            <li>• <strong>Events:</strong> Organizers must own their event rights. No illegal content allowed.</li>
                            <li>• <strong>Refunds:</strong> Ticket refunds are handled by organizers. logic settings.</li>
                            <li>• <strong>Liability:</strong> CornerClub is not liable for damages or losses from event attendance.</li>
                        </ul>
                    </section>

                    {/* Privacy Policy */}
                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="mb-4 text-xl font-bold text-[#f98109]">Privacy Policy</h2>
                        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <li>• <strong>Data Collection:</strong> We collect your Name, Email, and Phone for bookings.</li>
                            <li>• <strong>Usage:</strong> Your data is used only for tickets and essential communication.</li>
                            <li>• <strong>Security:</strong> We use industry-standard security to protect your info.</li>
                            <li>• <strong>Cookies:</strong> We use cookies to keep you logged in and improve experience.</li>
                            <li>• <strong>Contact:</strong> Questions? Email us at <a href="mailto:support@cornerclub.in" className="text-[#f98109]">support@cornerclub.in</a></li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
