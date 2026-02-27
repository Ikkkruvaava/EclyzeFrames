const fs = require('fs');

let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

c = c.replace(
    /const \[editorData, setEditorData\] = useState/,
    `const [activeTextIndex, setActiveTextIndex] = useState<number>(0);\n  const [editorData, setEditorData] = useState`
);

c = c.replace(
    /if \(target === "image"\) \{/,
    `if (target === "image" && editorData.placementCoords) {`
);

c = c.replace(
    /const coords = \{ \.\.\.editorData\.placementCoords \};/g,
    `const coords = editorData.placementCoords;`
);

// We need to fix coords.* possibly undefined because TS thinks coords is {} or PlacementCoords | null
// Wait, editorData.placementCoords is object. If we do coords = editorData.placementCoords, then coords.x is typed as number.
c = c.replace(
    /const coords = editorData.placementCoords;/g,
    `const coords = editorData.placementCoords as PlacementCoords;`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);
console.log('Script completed.');
