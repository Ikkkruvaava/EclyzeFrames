import React from "react";
import { CheckCircle2 } from "lucide-react";

const FeaturesGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-20 p-2 sm:p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col text-left transform md:-rotate-3">
                <div className="bg-emerald-50 w-full rounded-2xl p-6 mb-6 flex items-center justify-center border border-emerald-100/50 aspect-[4/3]">
                    <div className="bg-brand-green text-white px-6 py-2.5 rounded-full font-bold shadow-[0_8px_20px_rgb(16,185,129,0.3)]">
                        Create Event
                    </div>
                </div>
                <p className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-2">Step 1</p>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">Set up your frames in minutes: name it, style it, done.</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col text-left">
                <div className="bg-gray-50 w-full rounded-2xl p-6 mb-6 flex items-center justify-center border border-gray-100 aspect-[4/3] relative">
                    <div className="absolute top-8 left-4 right-8 bg-white shadow-md rounded-2xl p-3 flex items-center gap-3 border border-gray-50">
                        <div className="w-6 h-6 rounded-full bg-blue-100 font-bold flex items-center justify-center text-[10px]">E</div>
                        <div><div className="h-1.5 w-16 bg-gray-200 rounded"></div><div className="h-1.5 w-10 bg-gray-100 rounded mt-2"></div></div>
                    </div>
                    <div className="absolute bottom-6 left-8 right-4 bg-white shadow-md rounded-2xl p-3 flex items-center gap-3 border border-gray-50 z-10 justify-between">
                        <div><div className="h-1.5 w-20 bg-gray-200 rounded"></div><div className="h-1.5 w-12 bg-emerald-100 rounded mt-2"></div></div>
                        <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    </div>
                </div>
                <p className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-2">Step 2</p>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">Add pictures, texts, and download options like a pro.</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col text-left transform md:rotate-3">
                <div className="bg-emerald-50 w-full rounded-2xl p-6 mb-6 flex items-end justify-center border border-emerald-100/50 gap-3 aspect-[4/3] pb-8 pt-12 relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-emerald-200"></div>
                    <div className="w-10 bg-gray-200/50 rounded-lg h-1/3 relative z-10"></div>
                    <div className="w-10 bg-gray-200/50 rounded-lg h-1/2 relative z-10"></div>
                    <div className="w-10 bg-brand-green rounded-lg h-full shadow-[0_0_20px_rgb(16,185,129,0.3)] relative z-10"></div>
                    <div className="w-10 bg-gray-200/50 rounded-lg h-1/4 relative z-10"></div>
                </div>
                <p className="text-gray-400 text-sm font-bold tracking-wider uppercase mb-2">Step 3</p>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">Share your community link and watch engagement fly in.</h3>
            </div>
        </div>
    );
};

export default FeaturesGrid;
