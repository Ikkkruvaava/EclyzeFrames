import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { put } from '@vercel/blob';
import { getFrames, createFrame } from '@/lib/localDb';

// GET all frames with optional active filter
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const query = activeOnly ? { isActive: true } : {};
        const frames = await getFrames(query);

        return NextResponse.json({
            success: true,
            data: frames,
            message: 'Frames fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching frames:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch frames',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}

// POST create a new frame
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const frameImage = formData.get('frameImage') as File;
        const name = formData.get('name') as string;
        const dimensions = JSON.parse(formData.get('dimensions') as string);
        const hasImageArea = formData.get('hasImageArea') !== 'false';
        const placementCoords = hasImageArea ? JSON.parse(formData.get('placementCoords') as string) : null;
        const textSettings = JSON.parse(formData.get('textSettings') as string);
        const isActive = formData.get('isActive') !== 'false';

        if (!frameImage || !name) {
            return NextResponse.json({
                success: false,
                message: 'Frame image and name are required'
            }, { status: 400 });
        }

        let imageUrl = '';
        try {
            const fileName = `${crypto.randomUUID()}-${frameImage.name}`;

            // Upload to Vercel Blob
            const blob = await put(`frames/${fileName}`, frameImage, {
                access: 'public',
            });

            imageUrl = blob.url;
        } catch (uploadError) {
            console.error('Error uploading to Vercel Blob:', uploadError);
            return NextResponse.json({
                success: false,
                message: 'Failed to upload image to Blob storage',
                error: uploadError instanceof Error ? uploadError.message : 'An unknown error occurred'
            }, { status: 500 });
        }

        const newFrame = await createFrame({
            name,
            imageUrl,
            dimensions,
            hasImageArea,
            placementCoords,
            textSettings,
            isActive
        });

        return NextResponse.json({
            success: true,
            data: newFrame,
            message: 'Frame created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating frame:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create frame',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}