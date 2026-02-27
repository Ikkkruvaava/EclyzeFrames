const fs = require('fs');

let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

c = c.replace(
    /if \(isDraggingImage\) \{[\s\S]*?y: newY \} \}\)\);\n    \}/g,
    `if (isDraggingImage && editorData.placementCoords) {
      const newX = Math.max(0, Math.min(editorData.dimensions.width - editorData.placementCoords.width, x - dragStartPos.x));
      const newY = Math.max(0, Math.min(editorData.dimensions.height - editorData.placementCoords.height, y - dragStartPos.y));
      setEditorData((prev) => ({ ...prev, placementCoords: { ...(prev.placementCoords as PlacementCoords), x: newX, y: newY } }));
    }
    if (isDraggingText) {
      setEditorData((prev) => {
        const newTsArray = [...prev.textSettings];
        if (activeTextIndex < newTsArray.length) {
          const ts = newTsArray[activeTextIndex];
          const newX = Math.max(0, Math.min(editorData.dimensions.width - ts.width, x - dragStartPos.x));
          const newY = Math.max(0, Math.min(editorData.dimensions.height - ts.height, y - dragStartPos.y));
          newTsArray[activeTextIndex] = { ...ts, x: newX, y: newY };
        }
        return { ...prev, textSettings: newTsArray };
      });
    }`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);
