import { ArrowRightIcon, PlusIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
    return (
        <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-8 border-y bg-[radial-gradient(35%_80%_at_25%_0%,rgba(16,185,129,0.05),transparent)] px-6 py-16 md:py-24">
            <PlusIcon
                className="absolute top-[-12px] left-[-12px] z-10 size-6 text-emerald-600/30"
                strokeWidth={1}
            />
            <PlusIcon
                className="absolute top-[-12px] right-[-12px] z-10 size-6 text-emerald-600/30"
                strokeWidth={1}
            />
            <PlusIcon
                className="absolute bottom-[-12px] left-[-12px] z-10 size-6 text-emerald-600/30"
                strokeWidth={1}
            />
            <PlusIcon
                className="absolute right-[-12px] bottom-[-12px] z-10 size-6 text-emerald-600/30"
                strokeWidth={1}
            />

            <div className="-inset-y-8 pointer-events-none absolute left-0 w-px border-l border-gray-100" />
            <div className="-inset-y-8 pointer-events-none absolute right-0 w-px border-r border-gray-100" />

            <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-emerald-100" />


            <div className="space-y-4 relative z-10 text-center">
                <h2 className="font-extrabold text-3xl md:text-6xl tracking-tighter text-gray-900 leading-[1.1]">
                    Stop Framing Photos.<br />
                    <span className="text-emerald-600">Start Framing Your Legacy.</span>
                </h2>
                <p className="text-gray-500 font-medium text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Generic templates kill conversion. Join 5,000+ elite creators using our
                    strategic framing system to dominate their niche. Request your
                    custom growth roadmap and professional guide today.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10 pt-6">
                <Button
                    variant="outline"
                    className="h-16 px-10 border-gray-200 text-gray-600 font-bold rounded-2xl w-full sm:w-auto hover:bg-gray-50 transition-all text-base flex items-center gap-2"
                    asChild
                >
                    <Link href="/">
                        <HomeIcon className="size-4" /> Go Back Home
                    </Link>
                </Button>
                <Button
                    className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl w-full sm:w-auto shadow-2xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 text-base"
                    asChild
                >
                    <a href="https://wa.me/916238661924?text=I'm ready to scale my legacy. Please send me the custom growth roadmap and pricing guide.">
                        Unlock My Guide <ArrowRightIcon className="size-5 ml-2" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
