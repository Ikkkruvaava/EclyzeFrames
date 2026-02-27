const fs = require('fs');

function fixTypes(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace Frame
    content = content.replace(
        /interface Frame\s*\{[\s\S]*?textSettings:\s*TextSettings;\s*\}/g,
        `interface Frame {
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
}`
    );

    // Replace EditorData
    content = content.replace(
        /interface EditorData\s*\{[\s\S]*?textSettings:\s*TextSettings;\s*\}/g,
        `interface EditorData {
  dimensions: {
    width: number;
    height: number;
  };
  hasImageArea: boolean;
  placementCoords: PlacementCoords | null;
  textSettings: TextSettings[];
}`
    );

    fs.writeFileSync(file, content, 'utf8');
}

fixTypes('src/app/admin/(admin)/photoframing/edit/page.tsx');
fixTypes('src/app/admin/(admin)/photoframing/delete/page.tsx');
