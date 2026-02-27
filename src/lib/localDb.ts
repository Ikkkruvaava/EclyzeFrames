import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

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

export async function initDb() {
    try {
        const dir = path.dirname(DB_FILE);
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }

        try {
            await fs.access(DB_FILE);
        } catch {
            await fs.writeFile(DB_FILE, JSON.stringify({ frames: [] }, null, 2));
        }
    } catch (error) {
        console.error('Error initializing DB:', error);
    }
}

export async function getDb(): Promise<{ frames: FrameData[] }> {
    await initDb();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

export async function saveDb(data: any): Promise<void> {
    await initDb();
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
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

    // if usage count is a special object like { $inc: { usageCount: 1 } }, we need to handle it.
    // Actually, we'll handle $inc logic in the route.ts directly.

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
