const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(admin)/photoframing/create/page.tsx', 'utf8');

// 1. EditorData Interface
content = content.replace(
    /interface EditorData \{[\s\S]*?textSettings: TextSettings;\n\}/g,
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

// 2. State & defaultSizes
content = content.replace(
    /const \[editorData, setEditorData\] = useState<EditorData>\(\{[\s\S]*?dimensions: \{ width: 600, height: 600 \},[\s\S]*?placementCoords: \{ x: 200, y: 200, width: 200, height: 200 \},[\s\S]*?textSettings: \{[\s\S]*?color: "#ffffff",\n    \},\n  \}\);/g,
    `const [editorData, setEditorData] = useState<EditorData>({
    dimensions: { width: 600, height: 600 },
    hasImageArea: true,
    placementCoords: { x: 200, y: 200, width: 200, height: 200 },
    textSettings: [{
      x: 200,
      y: 450,
      width: 200,
      height: 50,
      font: "Arial",
      size: 16,
      color: "#ffffff",
    }],
  });
  const [activeTextIndex, setActiveTextIndex] = useState<number>(0);`
);

// 3. ResizeHandle
content = content.replace(
    /interface ResizeHandle \{\n  target: "image" \| "text";\n  handle: "topLeft" \| "topRight" \| "bottomLeft" \| "bottomRight";\n\}/g,
    `interface ResizeHandle {
  target: "image" | "text";
  handle: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  index?: number;
}`
);

// 4. Drawing Logic (useEffect)
content = content.replace(
    /\/\/ Draw image placement area[\s\S]*?\/\/ Draw Text area/g,
    `// Draw image placement area
      if (editorData.hasImageArea && editorData.placementCoords) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(
          editorData.placementCoords.x,
          editorData.placementCoords.y,
          editorData.placementCoords.width,
          editorData.placementCoords.height
        );
        ctx.strokeStyle = activeTab === "image" ? "#3b82f6" : "#ffffff";
        ctx.lineWidth = activeTab === "image" ? 2 : 1;
        ctx.strokeRect(
          editorData.placementCoords.x,
          editorData.placementCoords.y,
          editorData.placementCoords.width,
          editorData.placementCoords.height
        );

        if (activeTab === "image") {
          const handleColor = "#3b82f6";
          drawHandle(ctx, editorData.placementCoords.x, editorData.placementCoords.y, handleColor);
          drawHandle(ctx, editorData.placementCoords.x + editorData.placementCoords.width, editorData.placementCoords.y, handleColor);
          drawHandle(ctx, editorData.placementCoords.x, editorData.placementCoords.y + editorData.placementCoords.height, handleColor);
          drawHandle(ctx, editorData.placementCoords.x + editorData.placementCoords.width, editorData.placementCoords.y + editorData.placementCoords.height, handleColor);
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(editorData.placementCoords.x, editorData.placementCoords.y, 80, 20);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px sans-serif";
        ctx.fillText("User Image", editorData.placementCoords.x + 8, editorData.placementCoords.y + 14);
      }
      
      // Draw Text area`
);

content = content.replace(
    /\/\/ Draw Text area[\s\S]*?\/\/ In preview mode,/g,
    `// Draw Text area
      if (editorData.textSettings && editorData.textSettings.length) {
          editorData.textSettings.forEach((ts, index) => {
            const isActiveText = activeTab === "text" && activeTextIndex === index;
            
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(ts.x, ts.y, ts.width, ts.height);
            
            ctx.strokeStyle = isActiveText ? "#8b5cf6" : "#ffffff";
            ctx.lineWidth = isActiveText ? 2 : 1;
            ctx.strokeRect(ts.x, ts.y, ts.width, ts.height);

            ctx.font = \`\${ts.size}px \${ts.font}\`;
            ctx.fillStyle = ts.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            const textX = ts.x + ts.width / 2;
            const textY = ts.y + ts.height / 2;
            ctx.fillText(sampleText || "Sample Text", textX, textY);

            if (isActiveText) {
              const textHandleColor = "#8b5cf6";
              drawHandle(ctx, ts.x, ts.y, textHandleColor);
              drawHandle(ctx, ts.x + ts.width, ts.y, textHandleColor);
              drawHandle(ctx, ts.x, ts.y + ts.height, textHandleColor);
              drawHandle(ctx, ts.x + ts.width, ts.y + ts.height, textHandleColor);
            }

            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(ts.x, ts.y, 70, 20);
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Text " + (index+1), ts.x + 6, ts.y + 14);
          });
      }

      // In preview mode,`
);

content = content.replace(
    /if \(previewMode\) \{[\s\S]*?ctx\.font = \`[\s\S]*?ctx\.fillText\(sampleText, textX, textY\);\n    \}/g,
    `if (previewMode) {
      if (editorData.hasImageArea && editorData.placementCoords) {
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(
          editorData.placementCoords.x,
          editorData.placementCoords.y,
          editorData.placementCoords.width,
          editorData.placementCoords.height
        );
        ctx.font = "16px Arial";
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "User Photo",
          editorData.placementCoords.x + editorData.placementCoords.width / 2,
          editorData.placementCoords.y + editorData.placementCoords.height / 2
        );
      }

      if (editorData.textSettings) {
          editorData.textSettings.forEach(ts => {
            ctx.font = \`\${ts.size}px \${ts.font}\`;
            ctx.fillStyle = ts.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const textX = ts.x + ts.width / 2;
            const textY = ts.y + ts.height / 2;
            ctx.fillText(sampleText || "Sample Text", textX, textY);
          });
      }
    }`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/create/page.tsx', content);
