import { CallToAction } from "@/components/ui/cta-3";
import ClientHeader from "@/components/ClientHeader";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#FDFCF9] flex flex-col">
            <ClientHeader />
            <div className="flex-1 flex items-center justify-center py-20 px-4">
                <CallToAction />
            </div>
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm italic font-medium">
                        © {new Date().getFullYear()} ECLYZE Frames. All rights reserved. Professional Branding Solutions.
                    </p>
                </div>
            </footer>
        </main>
    );
}
