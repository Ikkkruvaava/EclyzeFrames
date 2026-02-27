const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(admin)/photoframing/create/page.tsx', 'utf8');

// Mouse handlers
content = content.replace(
    /const handleCanvasMouseDown = \(e: React\.MouseEvent<HTMLCanvasElement>\) => \{[\s\S]*?y <= editorData\.textSettings\.y \+ editorData\.textSettings\.height\n    \) \{[\s\S]*?return;\n    \}\n  \};/g,
    `const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || previewMode) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = calculateScaleFactor(canvas, editorData.dimensions);
    const x = (e.clientX - rect.left) * scale.x;
    const y = (e.clientY - rect.top) * scale.y;

    const handleSize = 10;

    if (activeTab === "image" && editorData.hasImageArea && editorData.placementCoords) {
      if (Math.abs(x - editorData.placementCoords.x) <= handleSize && Math.abs(y - editorData.placementCoords.y) <= handleSize) {
        setResizeHandle({ target: "image", handle: "topLeft" }); return;
      }
      if (Math.abs(x - (editorData.placementCoords.x + editorData.placementCoords.width)) <= handleSize && Math.abs(y - editorData.placementCoords.y) <= handleSize) {
        setResizeHandle({ target: "image", handle: "topRight" }); return;
      }
      if (Math.abs(x - editorData.placementCoords.x) <= handleSize && Math.abs(y - (editorData.placementCoords.y + editorData.placementCoords.height)) <= handleSize) {
        setResizeHandle({ target: "image", handle: "bottomLeft" }); return;
      }
      if (Math.abs(x - (editorData.placementCoords.x + editorData.placementCoords.width)) <= handleSize && Math.abs(y - (editorData.placementCoords.y + editorData.placementCoords.height)) <= handleSize) {
        setResizeHandle({ target: "image", handle: "bottomRight" }); return;
      }

      if (x >= editorData.placementCoords.x && x <= editorData.placementCoords.x + editorData.placementCoords.width && y >= editorData.placementCoords.y && y <= editorData.placementCoords.y + editorData.placementCoords.height) {
        setIsDraggingImage(true);
        setDragStartPos({ x: x - editorData.placementCoords.x, y: y - editorData.placementCoords.y });
        return;
      }
    }

    if (activeTab === "text" && editorData.textSettings) {
      for (let i = 0; i < editorData.textSettings.length; i++) {
        const ts = editorData.textSettings[i];
        if (Math.abs(x - ts.x) <= handleSize && Math.abs(y - ts.y) <= handleSize) {
          setResizeHandle({ target: "text", handle: "topLeft", index: i });
          setActiveTextIndex(i); return;
        }
        if (Math.abs(x - (ts.x + ts.width)) <= handleSize && Math.abs(y - ts.y) <= handleSize) {
          setResizeHandle({ target: "text", handle: "topRight", index: i });
          setActiveTextIndex(i); return;
        }
        if (Math.abs(x - ts.x) <= handleSize && Math.abs(y - (ts.y + ts.height)) <= handleSize) {
          setResizeHandle({ target: "text", handle: "bottomLeft", index: i });
          setActiveTextIndex(i); return;
        }
        if (Math.abs(x - (ts.x + ts.width)) <= handleSize && Math.abs(y - (ts.y + ts.height)) <= handleSize) {
          setResizeHandle({ target: "text", handle: "bottomRight", index: i });
          setActiveTextIndex(i); return;
        }

        if (x >= ts.x && x <= ts.x + ts.width && y >= ts.y && y <= ts.y + ts.height) {
            setIsDraggingText(true);
            setActiveTextIndex(i);
            setDragStartPos({ x: x - ts.x, y: y - ts.y });
            return;
        }
      }
    }
  };`
);

content = content.replace(
    /const handleCanvasMouseMove = \(e: React\.MouseEvent<HTMLCanvasElement>\) => \{[\s\S]*?y: newY,\n        \},\n      \}\)\);\n    \}\n  \};/g,
    `const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    if (!isDraggingImage && !isDraggingText && !resizeHandle) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = calculateScaleFactor(canvas, editorData.dimensions);
    const x = (e.clientX - rect.left) * scale.x;
    const y = (e.clientY - rect.top) * scale.y;

    if (resizeHandle) {
      const { target, handle, index } = resizeHandle;

      if (target === "image" && editorData.placementCoords) {
        const coords = { ...editorData.placementCoords };
        switch (handle) {
          case "topLeft":
            const newWidthTL = coords.width + (coords.x - x);
            const newHeightTL = coords.height + (coords.y - y);
            if (newWidthTL >= 20 && newHeightTL >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: { x: Math.max(0, x), y: Math.max(0, y), width: newWidthTL, height: newHeightTL },
              }));
            }
            break;
          case "topRight":
            const newWidthTR = x - coords.x;
            const newHeightTR = coords.height + (coords.y - y);
            if (newWidthTR >= 20 && newHeightTR >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: { ...coords, y: Math.max(0, y), width: Math.min(newWidthTR, editorData.dimensions.width - coords.x), height: newHeightTR },
              }));
            }
            break;
          case "bottomLeft":
            const newWidthBL = coords.width + (coords.x - x);
            const newHeightBL = y - coords.y;
            if (newWidthBL >= 20 && newHeightBL >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: { x: Math.max(0, x), y: coords.y, width: newWidthBL, height: Math.min(newHeightBL, editorData.dimensions.height - coords.y) },
              }));
            }
            break;
          case "bottomRight":
            const newWidthBR = x - coords.x;
            const newHeightBR = y - coords.y;
            if (newWidthBR >= 20 && newHeightBR >= 20) {
              setEditorData((prev) => ({
                ...prev,
                placementCoords: { ...coords, width: Math.min(newWidthBR, editorData.dimensions.width - coords.x), height: Math.min(newHeightBR, editorData.dimensions.height - coords.y) },
              }));
            }
            break;
        }
      } else if (target === "text" && index !== undefined) {
        setEditorData((prev) => {
            const newTsArray = [...prev.textSettings];
            const coords = { ...newTsArray[index] };
            switch (handle) {
              case "topLeft":
                const newWidthTL = coords.width + (coords.x - x);
                const newHeightTL = coords.height + (coords.y - y);
                if (newWidthTL >= 20 && newHeightTL >= 20) {
                  newTsArray[index] = { ...coords, x: Math.max(0, x), y: Math.max(0, y), width: newWidthTL, height: newHeightTL };
                }
                break;
              case "topRight":
                const newWidthTR = x - coords.x;
                const newHeightTR = coords.height + (coords.y - y);
                if (newWidthTR >= 20 && newHeightTR >= 20) {
                  newTsArray[index] = { ...coords, y: Math.max(0, y), width: Math.min(newWidthTR, editorData.dimensions.width - coords.x), height: newHeightTR };
                }
                break;
              case "bottomLeft":
                const newWidthBL = coords.width + (coords.x - x);
                const newHeightBL = y - coords.y;
                if (newWidthBL >= 20 && newHeightBL >= 20) {
                  newTsArray[index] = { ...coords, x: Math.max(0, x), width: newWidthBL, height: Math.min(newHeightBL, editorData.dimensions.height - coords.y) };
                }
                break;
              case "bottomRight":
                const newWidthBR = x - coords.x;
                const newHeightBR = y - coords.y;
                if (newWidthBR >= 20 && newHeightBR >= 20) {
                  newTsArray[index] = { ...coords, width: Math.min(newWidthBR, editorData.dimensions.width - coords.x), height: Math.min(newHeightBR, editorData.dimensions.height - coords.y) };
                }
                break;
            }
            return { ...prev, textSettings: newTsArray };
        });
      }
      return;
    }

    if (isDraggingImage && editorData.placementCoords) {
      const newX = Math.max(0, Math.min(editorData.dimensions.width - editorData.placementCoords.width, x - dragStartPos.x));
      const newY = Math.max(0, Math.min(editorData.dimensions.height - editorData.placementCoords.height, y - dragStartPos.y));
      setEditorData((prev) => ({
        ...prev,
        placementCoords: { ...prev.placementCoords, x: newX, y: newY },
      }));
    }

    if (isDraggingText) {
      setEditorData((prev) => {
        const newTsArray = [...prev.textSettings];
        const ts = newTsArray[activeTextIndex];
        const newX = Math.max(0, Math.min(editorData.dimensions.width - ts.width, x - dragStartPos.x));
        const newY = Math.max(0, Math.min(editorData.dimensions.height - ts.height, y - dragStartPos.y));
        newTsArray[activeTextIndex] = { ...ts, x: newX, y: newY };
        return { ...prev, textSettings: newTsArray };
      });
    }
  };`
);

// Form data submit append
content = content.replace(
    /formData\.append\("dimensions", JSON\.stringify\(editorData\.dimensions\)\);\n      formData\.append\("placementCoords", JSON\.stringify\(editorData\.placementCoords\)\);/g,
    `formData.append("dimensions", JSON.stringify(editorData.dimensions));
      formData.append("hasImageArea", JSON.stringify(editorData.hasImageArea));
      formData.append("placementCoords", editorData.placementCoords ? JSON.stringify(editorData.placementCoords) : JSON.stringify(null));`
);

// UI controls
content = content.replace(
    /\{activeTab === "image" && \(\n[\s\S]*?\{activeTab === "text" && \(/g,
    `{activeTab === "image" && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Layers size={14} /> Image Placement
                            </h4>
                            <div className="flex items-center gap-2 mb-4">
                              <input type="checkbox" id="hasImageArea" checked={editorData.hasImageArea} onChange={(e) => {
                                setEditorData(prev => ({
                                  ...prev,
                                  hasImageArea: e.target.checked,
                                  placementCoords: e.target.checked ? { x: 200, y: 200, width: 200, height: 200 } : null
                                }));
                              }} />
                              <label htmlFor="hasImageArea" className="text-sm text-gray-600 dark:text-gray-300">Enable Image Area</label>
                            </div>

                            {editorData.hasImageArea && editorData.placementCoords && (
                              <div className="grid grid-cols-2 gap-3">
                                {(["x", "y", "width", "height"] as const).map((prop) => (
                                  <div key={prop}>
                                    <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                                      {prop.charAt(0).toUpperCase() + prop.slice(1)}
                                    </label>
                                    <input
                                      type="number"
                                      value={Math.round(editorData.placementCoords[prop])}
                                      onChange={(e) => {
                                        const value = Math.max(0, parseInt(e.target.value) || 0);
                                        setEditorData((prev) => ({
                                          ...prev,
                                          placementCoords: {
                                            ...prev.placementCoords,
                                            [prop]: value,
                                          },
                                        }));
                                      }}
                                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {activeTab === "text" && (`
);

content = content.replace(
    /\{activeTab === "text" && \(\n                          <div className="space-y-4">\n                            <div>\n                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">\n                                <Layout size=\{14\} \/> Text Area Position\n                              <\/h4>\n                              <div className="grid grid-cols-2 gap-3">\n                                \{\(\["x", "y", "width", "height"\] as const\)\.map\(\(prop\) => \([\s\S]*?<\/div>\n                              <\/div>\n                            <\/div>\n\n                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">\n                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">\n                                <Type size=\{14\} \/> Text Styling\n                              <\/h4>[\s\S]*?<\/div>\n                          <\/div>\n                        \)\}/g,
    `{activeTab === "text" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-4">
                               <h4 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <Type size={14} /> Text Areas ({editorData.textSettings.length})
                               </h4>
                               <button 
                                type="button" 
                                onClick={() => {
                                  setEditorData(prev => ({
                                    ...prev,
                                    textSettings: [...prev.textSettings, { x: 200, y: 200, width: 200, height: 50, font: "Arial", size: 16, color: "#ffffff" }]
                                  }));
                                  setActiveTextIndex(editorData.textSettings.length);
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
                               >
                                 + Add Text
                               </button>
                            </div>

                            {editorData.textSettings.length > 0 && (
                              <>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {editorData.textSettings.map((_, idx) => (
                                    <button 
                                      key={idx} 
                                      type="button"
                                      onClick={() => setActiveTextIndex(idx)}
                                      className={\`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap \${activeTextIndex === idx ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-white border border-gray-300 text-gray-600'}\`}
                                    >
                                      Text {idx + 1}
                                    </button>
                                  ))}
                                  {editorData.textSettings.length > 1 && (
                                     <button
                                        type="button"
                                        onClick={() => {
                                          setEditorData(prev => ({ ...prev, textSettings: prev.textSettings.filter((_, i) => i !== activeTextIndex) }));
                                          setActiveTextIndex(Math.max(0, activeTextIndex - 1));
                                        }}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-md whitespace-nowrap"
                                     >
                                        Remove active
                                     </button>
                                  )}
                                </div>

                                <div className="mt-4">
                                  <h4 className="text-xs font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <Layout size={12} /> Position (Text {activeTextIndex + 1})
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    {(["x", "y", "width", "height"] as const).map((prop) => (
                                      <div key={prop}>
                                        <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                                          {prop.charAt(0).toUpperCase() + prop.slice(1)}
                                        </label>
                                        <input
                                          type="number"
                                          value={Math.round(editorData.textSettings[activeTextIndex][prop])}
                                          onChange={(e) => {
                                            const value = Math.max(0, parseInt(e.target.value) || 0);
                                            setEditorData((prev) => {
                                              const newTsArray = [...prev.textSettings];
                                              newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], [prop]: value };
                                              return { ...prev, textSettings: newTsArray };
                                            });
                                          }}
                                          className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                  <h4 className="text-xs font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <Type size={12} /> Styling (Text {activeTextIndex + 1})
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                                        Font Family
                                      </label>
                                      <select
                                        value={editorData.textSettings[activeTextIndex].font}
                                        onChange={(e) => {
                                          setEditorData((prev) => {
                                            const newTsArray = [...prev.textSettings];
                                            newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], font: e.target.value };
                                            return { ...prev, textSettings: newTsArray };
                                          });
                                        }}
                                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      >
                                        {["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana"].map((font) => (
                                          <option key={font} value={font}>{font}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Font Size</label>
                                      <input
                                        type="number"
                                        value={editorData.textSettings[activeTextIndex].size}
                                        min="0" max="150"
                                        onChange={(e) => {
                                          const value = Math.max(0, Math.min(150, parseInt(e.target.value) || 0));
                                          setEditorData((prev) => {
                                            const newTsArray = [...prev.textSettings];
                                            newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], size: value };
                                            return { ...prev, textSettings: newTsArray };
                                          });
                                        }}
                                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Color</label>
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="color"
                                          value={editorData.textSettings[activeTextIndex].color}
                                          onChange={(e) => {
                                            setEditorData((prev) => {
                                              const newTsArray = [...prev.textSettings];
                                              newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], color: e.target.value };
                                              return { ...prev, textSettings: newTsArray };
                                            });
                                          }}
                                          className="h-8 w-12 rounded cursor-pointer border-0 p-0"
                                        />
                                        <input
                                          type="text"
                                          value={editorData.textSettings[activeTextIndex].color}
                                          onChange={(e) => {
                                            setEditorData((prev) => {
                                              const newTsArray = [...prev.textSettings];
                                              newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], color: e.target.value };
                                              return { ...prev, textSettings: newTsArray };
                                            });
                                          }}
                                          className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 focus:border-blue-500 text-sm uppercase"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/create/page.tsx', content);
