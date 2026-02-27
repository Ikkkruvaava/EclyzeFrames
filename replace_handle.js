const fs = require('fs');

const file = 'src/app/admin/(admin)/photoframing/edit/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of handleCanvasMouseMove
const methodStart = "const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {";
const startIndex = content.indexOf(methodStart);

if (startIndex === -1) {
    console.log("Could not find start");
    process.exit(1);
}

// Find the start of handleCanvasMouseUp
const methodEnd = "const handleCanvasMouseUp = () => {";
const endIndex = content.indexOf(methodEnd);

if (endIndex === -1) {
    console.log("Could not find end");
    process.exit(1);
}

const newMethod = `const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || (!isDraggingImage && !isDraggingText && !resizeHandle)) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = calculateScaleFactor(canvas, editorData.dimensions);
    const x = (e.clientX - rect.left) * scale.x;
    const y = (e.clientY - rect.top) * scale.y;

    if (resizeHandle) {
      const { target, handle, index } = resizeHandle;
      if (target === "image") {
        const coords = { ...editorData.placementCoords };
        if (!coords) return;

        switch (handle) {
          case "topLeft":
            const newWidthTL = coords.width + (coords.x - x);
            const newHeightTL = coords.height + (coords.y - y);
            if (newWidthTL >= 20 && newHeightTL >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: {
                  x: Math.max(0, x),
                  y: Math.max(0, y),
                  width: newWidthTL,
                  height: newHeightTL,
                },
              }));
            }
            break;
          case "topRight":
            const newWidthTR = x - coords.x;
            const newHeightTR = coords.height + (coords.y - y);
            if (newWidthTR >= 20 && newHeightTR >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: {
                  ...coords,
                  y: Math.max(0, y),
                  width: Math.min(newWidthTR, editorData.dimensions.width - coords.x),
                  height: newHeightTR,
                },
              }));
            }
            break;
          case "bottomLeft":
            const newWidthBL = coords.width + (coords.x - x);
            const newHeightBL = y - coords.y;
            if (newWidthBL >= 20 && newHeightBL >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: {
                  x: Math.max(0, x),
                  y: coords.y,
                  width: newWidthBL,
                  height: Math.min(
                    newHeightBL,
                    editorData.dimensions.height - coords.y
                  ),
                },
              }));
            }
            break;
          case "bottomRight":
            const newWidthBR = x - coords.x;
            const newHeightBR = y - coords.y;
            if (newWidthBR >= 20 && newHeightBR >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: {
                  ...coords,
                  width: Math.min(newWidthBR, editorData.dimensions.width - coords.x),
                  height: Math.min(
                    newHeightBR,
                    editorData.dimensions.height - coords.y
                  ),
                },
              }));
            }
            break;
        }
      } else if (target === "text" && index !== undefined) {
        const tsArray = [...editorData.textSettings];
        const coords = { ...tsArray[index] };
        if (!coords) return;

        switch (handle) {
          case "topLeft":
            const newWidthTL = coords.width + (coords.x - x);
            const newHeightTL = coords.height + (coords.y - y);
            if (newWidthTL >= 20 && newHeightTL >= 20) {
              tsArray[index] = {
                ...coords,
                x: Math.max(0, x),
                y: Math.max(0, y),
                width: newWidthTL,
                height: newHeightTL,
              };
              setEditorData((prev) => ({ ...prev, textSettings: tsArray }));
            }
            break;
          case "topRight":
            const newWidthTR = x - coords.x;
            const newHeightTR = coords.height + (coords.y - y);
            if (newWidthTR >= 20 && newHeightTR >= 20) {
              tsArray[index] = {
                ...coords,
                y: Math.max(0, y),
                width: Math.min(newWidthTR, editorData.dimensions.width - coords.x),
                height: newHeightTR,
              };
              setEditorData((prev) => ({ ...prev, textSettings: tsArray }));
            }
            break;
          case "bottomLeft":
            const newWidthBL = coords.width + (coords.x - x);
            const newHeightBL = y - coords.y;
            if (newWidthBL >= 20 && newHeightBL >= 20) {
              tsArray[index] = {
                ...coords,
                x: Math.max(0, x),
                width: newWidthBL,
                height: Math.min(
                  newHeightBL,
                  editorData.dimensions.height - coords.y
                ),
              };
              setEditorData((prev) => ({ ...prev, textSettings: tsArray }));
            }
            break;
          case "bottomRight":
            const newWidthBR = x - coords.x;
            const newHeightBR = y - coords.y;
            if (newWidthBR >= 20 && newHeightBR >= 20) {
              tsArray[index] = {
                ...coords,
                width: Math.min(newWidthBR, editorData.dimensions.width - coords.x),
                height: Math.min(
                  newHeightBR,
                  editorData.dimensions.height - coords.y
                ),
              };
              setEditorData((prev) => ({ ...prev, textSettings: tsArray }));
            }
            break;
        }
      }
    } else if (isDraggingImage && editorData.placementCoords) {
      setEditorData((prev) => ({
        ...prev,
        placementCoords: {
          ...prev.placementCoords as any,
          x: x - dragStartPos.x,
          y: y - dragStartPos.y,
        },
      }));
    } else if (isDraggingText && activeTextIndex !== undefined) {
      setEditorData((prev) => {
        const newTsArray = [...prev.textSettings];
        if (newTsArray[activeTextIndex]) {
          newTsArray[activeTextIndex] = {
            ...newTsArray[activeTextIndex],
            x: x - dragStartPos.x,
            y: y - dragStartPos.y,
          };
        }
        return { ...prev, textSettings: newTsArray };
      });
    }
  };

  `;

const newContent = content.substring(0, startIndex) + newMethod + content.substring(endIndex);
fs.writeFileSync(file, newContent);
console.log("Done overwriting method");
