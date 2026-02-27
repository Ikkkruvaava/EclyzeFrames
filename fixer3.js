const fs = require('fs');

let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

// Fix placementCoords null checks
c = c.replace(
    /value=\{Math\.round\(editorData\.placementCoords\[prop\]\)\}/g,
    `value={editorData.placementCoords ? Math.round(editorData.placementCoords[prop]) : 0}`
);

c = c.replace(
    /setEditorData\(\(prev\) => \(\{ \.\.\.prev, placementCoords: \{ \.\.\.prev\.placementCoords, \[prop\]: value \} \}\)\);/g,
    `setEditorData((prev) => ({ ...prev, placementCoords: prev.placementCoords ? { ...prev.placementCoords, [prop]: value } : null }));`
);

// Fix textSettings array accesses
c = c.replace(
    /value=\{Math\.round\(editorData\.textSettings\[prop\]\)\}/g,
    `value={editorData.textSettings[activeTextIndex] ? Math.round((editorData.textSettings[activeTextIndex] as any)[prop]) : 0}`
);

c = c.replace(
    /setEditorData\(\(prev\) => \(\{ \.\.\.prev, textSettings: \{ \.\.\.prev\.textSettings, \[prop\]: value \} \}\)\);/g,
    `setEditorData((prev) => {
                                      const newTs = [...prev.textSettings];
                                      if (newTs[activeTextIndex]) {
                                        newTs[activeTextIndex] = { ...newTs[activeTextIndex], [prop]: value };
                                      }
                                      return { ...prev, textSettings: newTs };
                                    });`
);

c = c.replace(
    /value=\{editorData\.textSettings\.font\}/g,
    `value={editorData.textSettings[activeTextIndex]?.font || "Arial"}`
);

c = c.replace(
    /setEditorData\(\(prev\) => \(\{ \.\.\.prev, textSettings: \{ \.\.\.prev\.textSettings, font: e\.target\.value \} \}\)\)/g,
    `setEditorData((prev) => {
                                    const newTs = [...prev.textSettings];
                                    if (newTs[activeTextIndex]) newTs[activeTextIndex] = { ...newTs[activeTextIndex], font: e.target.value };
                                    return { ...prev, textSettings: newTs };
                                  })`
);

c = c.replace(
    /value=\{editorData\.textSettings\.size\}/g,
    `value={editorData.textSettings[activeTextIndex]?.size || 16}`
);

c = c.replace(
    /setEditorData\(\(prev\) => \(\{ \.\.\.prev, textSettings: \{ \.\.\.prev\.textSettings, size: value \} \}\)\);/g,
    `setEditorData((prev) => {
                                      const newTs = [...prev.textSettings];
                                      if (newTs[activeTextIndex]) newTs[activeTextIndex] = { ...newTs[activeTextIndex], size: value };
                                      return { ...prev, textSettings: newTs };
                                    });`
);

c = c.replace(
    /value=\{editorData\.textSettings\.color\}/g,
    `value={editorData.textSettings[activeTextIndex]?.color || "#ffffff"}`
);

c = c.replace(
    /setEditorData\(\(prev\) => \(\{ \.\.\.prev, textSettings: \{ \.\.\.prev\.textSettings, color: e\.target\.value \} \}\)\)/g,
    `setEditorData((prev) => {
                                        const newTs = [...prev.textSettings];
                                        if (newTs[activeTextIndex]) newTs[activeTextIndex] = { ...newTs[activeTextIndex], color: e.target.value };
                                        return { ...prev, textSettings: newTs };
                                      })`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);

let d = fs.readFileSync('src/app/admin/(admin)/photoframing/delete/page.tsx', 'utf8');

d = d.replace(/import \{ .*Dimensions.* \} from "@/g, (match) => match.replace("Dimensions", ""));

d = d.replace(
    /<dd className="mt-1 text-sm text-gray-800 dark:text-white">\s*\{frame\.placementCoords\.width\} × \{frame\.placementCoords\.height\}\s*<\/dd>/gs,
    `<dd className="mt-1 text-sm text-gray-800 dark:text-white">
                                                {frame.placementCoords ? \`\${frame.placementCoords.width} × \${frame.placementCoords.height}\` : 'N/A'}
                                            </dd>`
);

d = d.replace(
    /<dd className="mt-1 text-sm text-gray-800 dark:text-white">\s*\{frame\.textSettings\.font\}, \{frame\.textSettings\.size\}px\s*<\/dd>/gs,
    `<dd className="mt-1 text-sm text-gray-800 dark:text-white">
                                                {Array.isArray(frame.textSettings) && frame.textSettings.length > 0 ? \`\${frame.textSettings[0].font}, \${frame.textSettings[0].size}px\` : 'N/A'}
                                            </dd>`
);

fs.writeFileSync('src/app/admin/(admin)/photoframing/delete/page.tsx', d);

console.log('Fixes applied');
