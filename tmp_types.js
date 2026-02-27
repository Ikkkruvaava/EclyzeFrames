const fs = require('fs');

function replaceFrame(fileName) {
    if (!fs.existsSync(fileName)) return;
    let fileData = fs.readFileSync(fileName, 'utf8');
    fileData = fileData.replace(
        /interface Frame \{[\s\S]*?textSettings: TextSettings;\n\}/,
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
    fs.writeFileSync(fileName, fileData);
}

replaceFrame('src/app/admin/(admin)/photoframing/edit/page.tsx');
replaceFrame('src/app/admin/(admin)/photoframing/delete/page.tsx');
replaceFrame('src/app/admin/(admin)/photoframing/all/page.tsx');

let sidebar = fs.readFileSync('src/layout/AppSidebar.tsx', 'utf8');
sidebar = sidebar.replace(/GridIcon.*?,\n/, '');
sidebar = sidebar.replace(/GridIcon.*?,\r\n/, '');
fs.writeFileSync('src/layout/AppSidebar.tsx', sidebar);

