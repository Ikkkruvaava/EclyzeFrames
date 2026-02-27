// src/app/api/frames/stats/route.ts
import { NextResponse } from 'next/server';
import { getFrames } from '@/lib/localDb';

export async function GET() {
  try {
    const frames = await getFrames();

    // Get total frames count
    const totalFrames = frames.length;

    // Get active frames count
    const activeFrames = frames.filter(f => f.isActive).length;

    // Get the total number of usages across all frames
    const totalUsage = frames.reduce((sum, f) => sum + (f.usageCount || 0), 0);

    // Get top 5 most used frames
    const topFrames = [...frames]
      .sort((a, b) => {
        if ((b.usageCount || 0) !== (a.usageCount || 0)) {
          return (b.usageCount || 0) - (a.usageCount || 0);
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5)
      .map(f => ({ _id: f._id, name: f.name, usageCount: f.usageCount || 0 }));

    return NextResponse.json({
      success: true,
      data: {
        totalFrames,
        activeFrames,
        totalUsage,
        topFrames
      }
    });
  } catch (error) {
    console.error("Error fetching frame statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch frame statistics",
        error: error instanceof Error ? error.message : "An unknown error occurred"
      },
      { status: 500 }
    );
  }
}