const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Interface
content = content.replace(
    /interface Frame \{[\s\S]*?usageCount\?: number;\n\}/g,
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
  usageCount?: number;
}`
);

// 2. State
content = content.replace(
    /const \[userName, setUserName\] = useState<string>\(\"\"\);/g,
    `const [userTexts, setUserTexts] = useState<string[]>([]);`
);

// 3. handleSelectFrame
content = content.replace(
    /const handleSelectFrame = \(frame: Frame\) => \{[\s\S]*?setCurrentStep\(\"upload\"\);[\s\S]*?const aspectRatio = frame\.placementCoords\.width \/ frame\.placementCoords\.height;\n    setAspect\(aspectRatio\);/g,
    `const handleSelectFrame = (frame: Frame) => {
    setSelectedFrame(frame);
    const initialTexts = Array(frame.textSettings?.length || 0).fill("");
    setUserTexts(initialTexts);

    if (frame.hasImageArea === false) {
      setCurrentStep("preview");
    } else {
      setCurrentStep("upload");
      
      if (frame.placementCoords) {
        const aspectRatio = frame.placementCoords.width / frame.placementCoords.height;
        setAspect(aspectRatio);
      }
    }
`
);

// 4. handleReset
content = content.replace(
    /setUserName\(\"\"\);/g,
    `setUserTexts([]);`
);

// 5. useEffect dependencies
content = content.replace(
    /\[currentStep, croppedImage, selectedFrame, userName\]/g,
    `[currentStep, croppedImage, selectedFrame, userTexts]`
);

// 6. Draw logic
content = content.replace(
    /      if \(userName\) \{[\s\S]*?const textSettings = selectedFrame\.textSettings;[\s\S]*?ctx\.fillText\(userName, textX, textY\);\n        \}/g,
    `      if (selectedFrame.textSettings && Array.isArray(selectedFrame.textSettings)) {
          selectedFrame.textSettings.forEach((textSettings, index) => {
            const textToDraw = userTexts[index] || "";
            if (textToDraw) {
              ctx.font = \`\${textSettings.size}px \${textSettings.font || 'Arial'}\`;
              ctx.fillStyle = textSettings.color || '#000000';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              const textX = textSettings.x + (textSettings.width / 2);
              const textY = textSettings.y + (textSettings.height / 2);

              ctx.fillText(textToDraw, textX, textY);
            }
          });
        }`
);

// Draw Image condition
content = content.replace(
    /const placement = selectedFrame\.placementCoords;\n\n        \/\/ Draw the user image at exact placement coordinates\n        ctx\.drawImage\([\s\S]*?\);/g,
    `if (selectedFrame.hasImageArea !== false && selectedFrame.placementCoords && typeof userImg !== 'undefined') {
          const placement = selectedFrame.placementCoords;
          ctx.drawImage(
            userImg,
            0, 0, userImg.width, userImg.height,
            placement.x, placement.y, placement.width, placement.height
          );
        }`
);

content = content.replace(
    /if \(!croppedImage\) \{\n              \/\/ When in preview step but no cropped image, resolve with original frame\n              ctx\.drawImage\(\n                frameImg,\n                0, 0,\n                canvas\.width \/ pixelRatio,\n                canvas\.height \/ pixelRatio\n              \);[\s\S]*?return;\n            \}/g,
    `if (!croppedImage && selectedFrame.hasImageArea !== false) {
              // When in preview step but no cropped image (and needs one), resolve with original frame
              ctx.drawImage(
                frameImg,
                0, 0,
                canvas.width / pixelRatio,
                canvas.height / pixelRatio
              );
              // also draw text
              if (selectedFrame.textSettings && Array.isArray(selectedFrame.textSettings)) {
                selectedFrame.textSettings.forEach((textSettings, index) => {
                  const textToDraw = userTexts[index] || "";
                  if (textToDraw) {
                    ctx.font = \`\${textSettings.size}px \${textSettings.font || 'Arial'}\`;
                    ctx.fillStyle = textSettings.color || '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const textX = textSettings.x + (textSettings.width / 2);
                    const textY = textSettings.y + (textSettings.height / 2);
                    ctx.fillText(textToDraw, textX, textY);
                  }
                });
              }
              setIsLoading(false);
              resolve();
              return;
            }`
);

// 7. Inputs UI
content = content.replace(
    /<div className="my-4">\n                  <label className="block text-sm font-medium text-gray-700 mb-2">\n                    Personalize Your Frame\n                  <\/label>\n                  <input\n                    type="text"\n                    value=\{userName\}\n                    onChange=\{\(e\) => \{\n                      setUserName\(e\.target\.value\);\n                    \}\}\n                    placeholder="Enter your name \(optional\)"\n                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"\n                  \/>\n                  \{userName && \([\s\S]*?Your name will appear on the frame\n                    <\/p>\n                  \)\}\n                <\/div>/g,
    `<div className="my-4 space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personalize Your Frame
                  </label>
                  {selectedFrame.textSettings && selectedFrame.textSettings.map((ts, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={userTexts[index] || ''}
                        onChange={(e) => {
                          const newTexts = [...userTexts];
                          newTexts[index] = e.target.value;
                          setUserTexts(newTexts);
                        }}
                        placeholder={"Enter text " + (index + 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                  {userTexts.some(t => t) && (
                    <p className="mt-2 text-xs text-green-600 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Text will appear on the frame
                    </p>
                  )}
                </div>`
);

// Fix createCroppedImage access
content = content.replace(
    /const targetWidth = selectedFrame\.placementCoords\.width;\n    const targetHeight = selectedFrame\.placementCoords\.height;/g,
    `const targetWidth = selectedFrame.placementCoords?.width || 0;
    const targetHeight = selectedFrame.placementCoords?.height || 0;
    if (!targetWidth || !targetHeight) return;`
);

// One more update: the user `userName` inside the error/processing text dependencies
content = content.replace(
    /&& userName\)/g,
    `&& userTexts)`
);

fs.writeFileSync('src/app/page.tsx', content);
