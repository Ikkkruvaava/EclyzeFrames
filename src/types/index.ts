export interface PlacementCoords {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TextSettings {
    x: number;
    y: number;
    width: number;
    height: number;
    font: string;
    size: number;
    color: string;
    align?: "left" | "center" | "right";
}

export interface Frame {
    _id: string;
    name: string;
    imageUrl: string;
    dimensions: {
        width: number;
        height: number;
    };
    hasImageArea?: boolean;
    placementCoords?: PlacementCoords | null;
    textSettings: TextSettings[];
    usageCount?: number;
}
