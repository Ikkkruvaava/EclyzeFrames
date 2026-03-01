"use client";

import React from "react";
import NextImage from "next/image";
import { Link as LinkIcon, Heart, CheckCircle2 } from "lucide-react";
import { Frame } from "@/types";

interface FrameCardProps {
    frame: Frame;
    onSelect: (f: Frame) => void;
    onCopyLink: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    onToggleFavorite: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    isFavorite: boolean;
    copySuccess: boolean;
}

const FrameCard = React.memo(({
    frame,
    onSelect,
    onCopyLink,
    onToggleFavorite,
    isFavorite,
    copySuccess
}: FrameCardProps) => {
    return (
        <div
            className="group relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-transparent hover:border-emerald-100 card-clip p-3 pb-6 flex flex-col"
            onClick={() => onSelect(frame)}
        >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50">
                <NextImage
                    src={frame.imageUrl}
                    alt={frame.name}
                    width={400} // Optimization: Use smaller width for thumbnails
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white px-6 py-2.5 rounded-full shadow-xl border border-gray-50">
                        <span className="text-gray-900 font-bold text-sm">Create Now</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => onCopyLink(frame._id, e)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Copy share link"
                        title="Copy share link"
                    >
                        {copySuccess ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                            <LinkIcon className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                    <button
                        onClick={(e) => onToggleFavorite(frame._id, e)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${isFavorite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-600 hover:text-red-500"
                                }`}
                        />
                    </button>
                </div>

                {/* Favorite indicator */}
                {isFavorite && (
                    <div className="absolute top-3 left-3">
                        <div className="p-1.5 rounded-full bg-red-500 shadow-md">
                            <Heart className="h-3 w-3 text-white fill-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Card content */}
            <div className="mt-4 px-3 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
                    {frame.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                    <p className="text-sm font-medium text-gray-400">
                        {frame.dimensions.width}x{frame.dimensions.height}
                    </p>
                    {frame.usageCount && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-emerald-50 px-2 py-0.5 rounded-md">
                            {frame.usageCount} shared
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

FrameCard.displayName = "FrameCard";

export default FrameCard;
