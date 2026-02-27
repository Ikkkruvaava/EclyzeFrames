const fs = require('fs');
let c = fs.readFileSync('src/app/admin/(admin)/photoframing/delete/page.tsx', 'utf8');

const regex = /interface PlacementCoords \{\s*"use client".*?interface Frame \{/s;
c = c.replace(regex, `interface PlacementCoords {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

interface Frame {`);

fs.writeFileSync('src/app/admin/(admin)/photoframing/delete/page.tsx', c);
