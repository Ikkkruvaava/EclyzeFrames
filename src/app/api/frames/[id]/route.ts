import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { getFrameById, updateFrame, deleteFrame } from '@/lib/localDb';

const getFilenameFromUrl = (url: string): string | null => {
    try {
        const parts = url.split('/');
        return parts[parts.length - 1];
    } catch {
        return null;
    }
};

async function ensureDir(dirPath: string) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// GET handler
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } | undefined }
) {
    try {
        const resolvedParams = context?.params
            ? 'params' in context && context.params instanceof Promise
                ? await context.params
                : context.params
            : null;

        if (!resolvedParams || !('id' in resolvedParams)) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const id = resolvedParams.id;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const frame = await getFrameById(id);

        if (!frame) {
            return NextResponse.json({
                success: false,
                message: 'Frame not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: frame,
            message: 'Frame fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching frame:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch frame',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}

// PUT handler
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } | undefined }
) {
    try {
        const resolvedParams = context?.params
            ? 'params' in context && context.params instanceof Promise
                ? await context.params
                : context.params
            : null;

        if (!resolvedParams || !('id' in resolvedParams)) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const id = resolvedParams.id;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const existingFrame = await getFrameById(id);

        if (!existingFrame) {
            return NextResponse.json({
                success: false,
                message: 'Frame not found'
            }, { status: 400 });
        }

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const frameImage = formData.get('frameImage') as File | null;
            const name = formData.get('name') as string;
            const dimensions = JSON.parse(formData.get('dimensions') as string);
            const hasImageArea = formData.get('hasImageArea') !== 'false';
            const placementCoords = hasImageArea ? JSON.parse(formData.get('placementCoords') as string) : null;
            const textSettings = JSON.parse(formData.get('textSettings') as string);
            const currentImageUrl = formData.get('currentImageUrl') as string;
            const isActive = formData.get('isActive') === 'true';
            const incrementUsage = formData.get('incrementUsage') === 'true';

            if (!name) {
                return NextResponse.json({
                    success: false,
                    message: 'Frame name is required'
                }, { status: 400 });
            }

            let imageUrl = currentImageUrl;

            if (frameImage) {
                try {
                    const fileExt = frameImage.name.split('.').pop();
                    const fileName = `${crypto.randomUUID()}.${fileExt}`;
                    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'frames');

                    await ensureDir(uploadDir);

                    const filePath = path.join(uploadDir, fileName);
                    const arrayBuffer = await frameImage.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    await fs.writeFile(filePath, buffer);
                    imageUrl = `/uploads/frames/${fileName}`;

                    // Delete old file
                    if (currentImageUrl) {
                        try {
                            const oldFileName = getFilenameFromUrl(currentImageUrl);
                            if (oldFileName) {
                                const oldFilePath = path.join(uploadDir, oldFileName);
                                await fs.unlink(oldFilePath);
                            }
                        } catch (err) {
                            console.error('Error deleting old file:', err);
                        }
                    }
                } catch (uploadError) {
                    console.error('Error updating file:', uploadError);
                    return NextResponse.json({
                        success: false,
                        message: 'Failed to update image',
                        error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                    }, { status: 500 });
                }
            }

            const updateData: Partial<any> = {
                name,
                imageUrl,
                dimensions,
                hasImageArea,
                placementCoords,
                textSettings,
                isActive: isActive !== undefined ? isActive : existingFrame.isActive
            };

            if (incrementUsage) {
                updateData.usageCount = (existingFrame.usageCount || 0) + 1;
            }

            const updatedFrame = await updateFrame(id, updateData);

            return NextResponse.json({
                success: true,
                data: updatedFrame,
                message: 'Frame updated successfully'
            });
        } else {
            // JSON request for usage increment
            const body = await request.json();
            const { incrementUsage } = body;

            if (incrementUsage) {
                const updatedFrame = await updateFrame(id, {
                    usageCount: (existingFrame.usageCount || 0) + 1
                });

                return NextResponse.json({
                    success: true,
                    data: updatedFrame,
                    message: 'Frame usage incremented successfully'
                });
            }

            return NextResponse.json({
                success: false,
                message: 'No valid update operation specified'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating frame:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update frame',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}

// DELETE handler
export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } | undefined }
) {
    try {
        const resolvedParams = context?.params
            ? 'params' in context && context.params instanceof Promise
                ? await context.params
                : context.params
            : null;

        if (!resolvedParams || !('id' in resolvedParams)) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const id = resolvedParams.id;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Frame ID is required'
            }, { status: 400 });
        }

        const existingFrame = await getFrameById(id);

        if (!existingFrame) {
            return NextResponse.json({
                success: false,
                message: 'Frame not found'
            }, { status: 404 });
        }

        if (existingFrame.imageUrl) {
            try {
                const fileName = getFilenameFromUrl(existingFrame.imageUrl);
                if (fileName) {
                    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'frames');
                    const filePath = path.join(uploadDir, fileName);
                    await fs.unlink(filePath);
                }
            } catch (deleteError) {
                console.error('Error processing file deletion:', deleteError);
            }
        }

        await deleteFrame(id);

        return NextResponse.json({
            success: true,
            message: 'Frame deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting frame:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete frame',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}