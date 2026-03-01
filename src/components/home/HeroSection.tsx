"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

const HeroSection = () => {
    return (
        <div className="text-center max-[1200px]:max-w-4xl max-w-5xl mx-auto mb-12 md:mb-20 relative pt-8 md:pt-12">
            <Link
                href="/pricing"
                className="mb-8 inline-flex items-center px-1.5 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium text-gray-700 hover:shadow-md transition-shadow cursor-pointer mx-auto"
            >
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[11px] font-bold mr-3 tracking-wider uppercase">New</span>
                <span className="mr-2">Custom Frames</span>
                <ChevronRight className="h-4 w-4 text-gray-400 mr-1" />
            </Link>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-gray-900 mb-6 md:mb-8 leading-[1.15] md:leading-[1.08] tracking-tight px-2">
                A perfect framing system <br className="hidden md:block" />
                working like an <span className="text-brand-green bg-emerald-50/80 px-3 md:px-4 pt-1 pb-1.5 md:pb-2 rounded-full inline-block mt-2 align-middle border border-emerald-100/50 shadow-sm break-words max-w-full">Organiser</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium px-0 sm:px-4">
                Great communities deserve a system that does it all, from making custom frames and smooth rendering to helping you market and track engagements.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14 md:mb-24">
                <button
                    onClick={() => {
                        const el = document.getElementById('available-frames');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-base hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center group"
                >
                    <Star className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform text-white fill-white" />
                    Start Framing
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
