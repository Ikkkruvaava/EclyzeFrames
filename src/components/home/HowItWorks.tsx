import React from "react";
import { Camera, Upload, Share2 } from "lucide-react";

const HowItWorks = () => {
    return (
        <section className="bg-white border-t border-gray-50 py-12 md:py-24 mt-10 md:mt-24 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-50/30 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Simple Process</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">HOW IT WORKS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[3rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-emerald-200 to-transparent z-0 blur-[1px]"></div>
                    <div className="hidden md:block absolute top-[3rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-emerald-50 via-brand-green to-emerald-50 z-0 opacity-50"></div>

                    {/* Step 1 */}
                    <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center relative z-10 bg-[#FDFCF9] md:bg-transparent p-5 md:p-0 rounded-3xl md:rounded-none border border-gray-100 md:border-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow group">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mr-5 md:mr-0 md:mb-8 shadow-md border border-emerald-50 md:group-hover:-translate-y-2 transition-transform duration-300">
                            <Camera className="h-7 w-7 md:h-10 md:w-10 text-brand-green" />
                            <div className="absolute -right-2 -top-2 md:-right-3 md:-top-3 bg-gray-900 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold text-xs md:text-sm shadow-md ring-4 ring-white">
                                1
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-3 group-hover:text-brand-green transition-colors">Pick Collection</h3>
                            <p className="text-gray-500 font-medium text-sm md:text-base md:px-4 leading-relaxed">
                                Browse through our premium curated library of community frames.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center relative z-10 bg-[#FDFCF9] md:bg-transparent p-5 md:p-0 rounded-3xl md:rounded-none border border-gray-100 md:border-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow group">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mr-5 md:mr-0 md:mb-8 shadow-md border border-emerald-50 md:group-hover:-translate-y-2 transition-transform duration-300 md:delay-75">
                            <Upload className="h-7 w-7 md:h-10 md:w-10 text-brand-green" />
                            <div className="absolute -right-2 -top-2 md:-right-3 md:-top-3 bg-gray-900 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold text-xs md:text-sm shadow-md ring-4 ring-white">
                                2
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-3 group-hover:text-brand-green transition-colors">Upload Photo</h3>
                            <p className="text-gray-500 font-medium text-sm md:text-base md:px-4 leading-relaxed">
                                Add your favorite photo and adjust it to fit the frame perfectly.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center relative z-10 bg-[#FDFCF9] md:bg-transparent p-5 md:p-0 rounded-3xl md:rounded-none border border-gray-100 md:border-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow group">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mr-5 md:mr-0 md:mb-8 shadow-md border border-emerald-50 md:group-hover:-translate-y-2 transition-transform duration-300 md:delay-150">
                            <Share2 className="h-7 w-7 md:h-10 md:w-10 text-brand-green" />
                            <div className="absolute -right-2 -top-2 md:-right-3 md:-top-3 bg-gray-900 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold text-xs md:text-sm shadow-md ring-4 ring-white">
                                3
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-3 group-hover:text-brand-green transition-colors">Share Away</h3>
                            <p className="text-gray-500 font-medium text-sm md:text-base md:px-4 leading-relaxed">
                                Download high-res results instantly and share with your community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
