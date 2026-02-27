const fs = require('fs');

let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

c = c.replace(
    /\} else if \(target === \"text\"\) \{[\s\S]*?return;\n    \}/g,
    `} else if (target === "text" && index !== undefined) {
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
        return;
      }`
);

// fix formData append logic
c = c.replace(
    /formData\.append\(\"placementCoords\", JSON\.stringify\(editorData\.placementCoords\)\);\n[\s\S]*?formData\.append\(\"textSettings\", JSON\.stringify\(editorData\.textSettings\)\);/,
    `formData.append("hasImageArea", JSON.stringify(editorData.hasImageArea));
      formData.append("placementCoords", editorData.placementCoords ? JSON.stringify(editorData.placementCoords) : JSON.stringify(null));
      formData.append("textSettings", JSON.stringify(editorData.textSettings));`
);

// Replace UI content block
const oldUI = `{activeTab === "text" && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Layout size={14} /> Text Area Position
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {(["x", "y", "width", "height"] as const).map((prop) => (
                                  <div key={prop}>
                                    <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">{prop.charAt(0).toUpperCase() + prop.slice(1)}</label>
                                    <input
                                      type="number"
                                      value={Math.round(editorData.textSettings[prop])}
                                      onChange={(e) => {
                                        const value = Math.max(0, parseInt(e.target.value) || 0);
                                        setEditorData((prev) => ({ ...prev, textSettings: { ...prev.textSettings, [prop]: value } }));
                                      }}
                                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Type size={14} /> Text Styling
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Font Family</label>
                                  <select
                                    value={editorData.textSettings.font}
                                    onChange={(e) => setEditorData((prev) => ({ ...prev, textSettings: { ...prev.textSettings, font: e.target.value } }))}
                                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                    {["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana"].map((font) => (
                                      <option key={font} value={font}>
                                        {font}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Font Size</label>
                                  <input
                                    type="number"
                                    value={editorData.textSettings.size}
                                    min="0"
                                    max="72"
                                    onChange={(e) => {
                                      const value = Math.max(0, Math.min(72, parseInt(e.target.value) || 0));
                                      setEditorData((prev) => ({ ...prev, textSettings: { ...prev.textSettings, size: value } }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Font Color</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={editorData.textSettings.color}
                                      onChange={(e) => setEditorData((prev) => ({ ...prev, textSettings: { ...prev.textSettings, color: e.target.value } }))}
                                      className="h-8 w-10 p-0 bg-transparent border-0 rounded overflow-hidden cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={editorData.textSettings.color}
                                      onChange={(e) => setEditorData((prev) => ({ ...prev, textSettings: { ...prev.textSettings, color: e.target.value } }))}
                                      className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}`;


const newUI = `{activeTab === "text" && (
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
                                      onClick={(e) => { e.preventDefault(); setActiveTextIndex(idx); }}
                                      className={\`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap \${activeTextIndex === idx ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-white border border-gray-300 text-gray-600'}\`}
                                    >
                                      Text {idx + 1}
                                    </button>
                                  ))}
                                  {editorData.textSettings.length > 1 && (
                                     <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
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
                                          value={Math.round(editorData.textSettings[activeTextIndex]?.[prop] || 0)}
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
                                        value={editorData.textSettings[activeTextIndex]?.font || 'Arial'}
                                        onChange={(e) => {
                                          setEditorData((prev) => {
                                            const newTsArray = [...prev.textSettings];
                                            newTsArray[activeTextIndex] = { ...newTsArray[activeTextIndex], font: e.target.value };
                                            return { ...prev, textSettings: newTsArray };
                                          });
                                        }}
                                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      >
                                        {(["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana"]).map((font) => (
                                          <option key={font} value={font}>{font}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Font Size</label>
                                      <input
                                        type="number"
                                        value={editorData.textSettings[activeTextIndex]?.size || 16}
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
                                          value={editorData.textSettings[activeTextIndex]?.color || '#ffffff'}
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
                                          value={editorData.textSettings[activeTextIndex]?.color || '#ffffff'}
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
                        )}`;

c = c.replace(oldUI, newUI);
fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);

let pageC = fs.readFileSync('src/app/page.tsx', 'utf8');
pageC = pageC.replace(
    /\{selectedFrame\.textSettings && selectedFrame\.textSettings\.map\(\(ts, index\) => \(/g,
    '{selectedFrame.textSettings && selectedFrame.textSettings.map((_, index) => ('
);
fs.writeFileSync('src/app/page.tsx', pageC);
