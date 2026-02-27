import { Schema, model, models } from 'mongoose';
import dbConnect from './mongodb';

export interface FrameData {
    _id: string;
    name: string;
    imageUrl: string;
    dimensions: {
        width: number;
        height: number;
    };
    hasImageArea?: boolean;
    placementCoords: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    textSettings: Array<{
        x: number;
        y: number;
        fontSize: number;
        color: string;
        align: string;
        placeholder?: string;
    }>;
    isActive: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

const FrameSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dimensions: {
        width: Number,
        height: Number
    },
    hasImageArea: { type: Boolean, default: true },
    placementCoords: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
    },
    textSettings: [{
        x: Number,
        y: Number,
        fontSize: Number,
        color: String,
        align: String,
        placeholder: String
    }],
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: {
        transform: (_, ret: any) => {
            ret._id = ret._id.toString();
            return ret;
        }
    }
});

const Frame = models.Frame || model('Frame', FrameSchema);

export async function initDb() {
    await dbConnect();
}

export async function getDb(): Promise<{ frames: FrameData[] }> {
    await dbConnect();
    const frames = await Frame.find({}).sort({ createdAt: -1 });
    return { frames: JSON.parse(JSON.stringify(frames)) };
}

export async function saveDb(_data: { frames: FrameData[] }): Promise<void> {
    // MongoDB handles persistence automatically per operation.
}

export async function getFrames(query: any = {}): Promise<FrameData[]> {
    await dbConnect();
    const mongoQuery: any = {};
    if (query.isActive !== undefined) {
        mongoQuery.isActive = query.isActive;
    }
    const frames = await Frame.find(mongoQuery).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(frames));
}

export async function getFrameById(id: string): Promise<FrameData | undefined> {
    await dbConnect();
    try {
        const frame = await Frame.findById(id);
        return frame ? JSON.parse(JSON.stringify(frame)) : undefined;
    } catch (e) {
        return undefined;
    }
}

export async function createFrame(frame: Omit<FrameData, '_id' | 'createdAt' | 'updatedAt' | 'usageCount'> & { usageCount?: number }): Promise<FrameData> {
    await dbConnect();
    const newFrame = await Frame.create(frame);
    return JSON.parse(JSON.stringify(newFrame));
}

export async function updateFrame(id: string, updates: Partial<FrameData>): Promise<FrameData | null> {
    await dbConnect();
    try {
        const updatedFrame = await Frame.findByIdAndUpdate(id, updates, { new: true });
        return updatedFrame ? JSON.parse(JSON.stringify(updatedFrame)) : null;
    } catch (e) {
        return null;
    }
}

export async function deleteFrame(id: string): Promise<boolean> {
    await dbConnect();
    try {
        const result = await Frame.findByIdAndDelete(id);
        return !!result;
    } catch (e) {
        return false;
    }
}
