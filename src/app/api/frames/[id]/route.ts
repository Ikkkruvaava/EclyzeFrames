import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { put, del } from '@vercel/blob';
import { getFrameById, updateFrame, deleteFrame } from '@/lib/localDb';

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
            const hasImageAreaRaw = formData.get('hasImageArea');
            const hasImageArea = hasImageAreaRaw !== null ? hasImageAreaRaw !== 'false' : existingFrame.hasImageArea;
            
            const placementCoordsRaw = formData.get('placementCoords');
            // If hasImageArea is explicitly FALSE, we nullify the placementCoords.
            // Otherwise, we take it from the form or fallback to the existing one.
            const placementCoords = hasImageArea === false
                ? null 
                : (placementCoordsRaw !== null ? JSON.parse(placementCoordsRaw as string) : existingFrame.placementCoords);
            
            const textSettingsRaw = formData.get('textSettings');
            const textSettings = textSettingsRaw !== null ? JSON.parse(textSettingsRaw as string) : existingFrame.textSettings;
            
            const currentImageUrl = formData.get('currentImageUrl') as string || existingFrame.imageUrl;
            
            const isActiveRaw = formData.get('isActive');
            const isActive = isActiveRaw !== null ? isActiveRaw === 'true' : existingFrame.isActive;
            
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
                    const fileName = `${crypto.randomUUID()}-${frameImage.name}`;

                    // Upload new blob
                    const blob = await put(`frames/${fileName}`, frameImage, {
                        access: 'public',
                    });

                    imageUrl = blob.url;

                    // Delete old blob if it exists and is a Vercel Blob URL
                    if (currentImageUrl && currentImageUrl.includes('public.blob.vercel-storage.com')) {
                        try {
                            await del(currentImageUrl);
                        } catch (err) {
                            console.error('Error deleting old blob:', err);
                        }
                    }
                } catch (uploadError) {
                    console.error('Error updating file to Vercel Blob:', uploadError);
                    return NextResponse.json({
                        success: false,
                        message: 'Failed to update image in Blob storage',
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

        if (existingFrame.imageUrl && existingFrame.imageUrl.includes('public.blob.vercel-storage.com')) {
            try {
                await del(existingFrame.imageUrl);
            } catch (deleteError) {
                console.error('Error processing blob deletion:', deleteError);
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