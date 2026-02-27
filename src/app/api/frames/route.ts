import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { getFrames, createFrame } from '@/lib/localDb';

// Helper to ensure directory exists
async function ensureDir(dirPath: string) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

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
            const fileExt = frameImage.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'frames');

            await ensureDir(uploadDir);

            const filePath = path.join(uploadDir, fileName);
            const arrayBuffer = await frameImage.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await fs.writeFile(filePath, buffer);

            // Public URL
            imageUrl = `/uploads/frames/${fileName}`;
        } catch (uploadError) {
            console.error('Error saving file locally:', uploadError);
            return NextResponse.json({
                success: false,
                message: 'Failed to upload image',
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