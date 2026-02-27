import { kv } from '@vercel/kv';
import crypto from 'crypto';

export interface FrameData {
    _id: string;
    name: string;
    imageUrl: string;
    dimensions: any;
    hasImageArea?: boolean;
    placementCoords: any;
    textSettings: any;
    isActive: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

const DB_KEY = 'frames_db';

export async function initDb() {
    try {
        const exists = await kv.exists(DB_KEY);
        if (!exists) {
            await kv.set(DB_KEY, { frames: [] });
        }
    } catch (error) {
        console.error('Error initializing KV DB:', error);
    }
}

export async function getDb(): Promise<{ frames: FrameData[] }> {
    try {
        const data = await kv.get<{ frames: FrameData[] }>(DB_KEY);
        return data || { frames: [] };
    } catch (error) {
        console.error('Error getting KV DB:', error);
        return { frames: [] };
    }
}

export async function saveDb(data: { frames: FrameData[] }): Promise<void> {
    try {
        await kv.set(DB_KEY, data);
    } catch (error) {
        console.error('Error saving to KV DB:', error);
    }
}

export async function getFrames(query: any = {}): Promise<FrameData[]> {
    const db = await getDb();
    let frames = db.frames;
    if (query.isActive !== undefined) {
        frames = frames.filter(f => f.isActive === query.isActive);
    }
    return frames.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getFrameById(id: string): Promise<FrameData | undefined> {
    const db = await getDb();
    return db.frames.find(f => f._id === id);
}

export async function createFrame(frame: Omit<FrameData, '_id' | 'createdAt' | 'updatedAt' | 'usageCount'> & { usageCount?: number }): Promise<FrameData> {
    const db = await getDb();
    const newFrame: FrameData = {
        ...frame,
        usageCount: frame.usageCount || 0,
        _id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    db.frames.push(newFrame);
    await saveDb(db);
    return newFrame;
}

export async function updateFrame(id: string, updates: Partial<FrameData>): Promise<FrameData | null> {
    const db = await getDb();
    const index = db.frames.findIndex(f => f._id === id);
    if (index === -1) return null;

    db.frames[index] = {
        ...db.frames[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    await saveDb(db);
    return db.frames[index];
}

export async function deleteFrame(id: string): Promise<boolean> {
    const db = await getDb();
    const initialLength = db.frames.length;
    db.frames = db.frames.filter(f => f._id !== id);
    await saveDb(db);
    return db.frames.length < initialLength;
}
