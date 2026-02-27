const fs = require('fs');
let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

const regex = /  \}, \[previewImage, editorData, sampleText\]\);\s*setActiveTab\("image"\);/s;

const replacement = `  }, [previewImage, editorData, sampleText]);

  const initializeFormWithFrame = (frame: Frame) => {
    setName(frame.name);
    if (!currentImageUrl) {
      setCurrentImageUrl(frame.imageUrl);
    }
    setPreviewImage(frame.imageUrl);
    setActiveTab("image");`;

c = c.replace(regex, replacement);

// Next fix resetToDefaults which spreads textSettings incorrectly
const resetRegex = /textSettings: \{\s*\.\.\.prev\.textSettings,\s*x: Math\.round\(frameWidth \* defaultSizes\.text\.xPercent\),\s*y: Math\.round\(frameHeight \* defaultSizes\.text\.yPercent\),\s*width: Math\.round\(frameWidth \* defaultSizes\.text\.widthPercent\),\s*height: Math\.round\(frameHeight \* defaultSizes\.text\.heightPercent\),\s*\}/s;
const resetReplacement = `textSettings: prev.textSettings.map(ts => ({
      ...ts,
      x: Math.round(frameWidth * defaultSizes.text.xPercent),
      y: Math.round(frameHeight * defaultSizes.text.yPercent),
      width: Math.round(frameWidth * defaultSizes.text.widthPercent),
      height: Math.round(frameHeight * defaultSizes.text.heightPercent),
    }))`;
c = c.replace(resetRegex, resetReplacement);

// Fix handleImageUpload textSettings spread inside setEditorData
const uploadRegex = /textSettings: \{\s*\.\.\.prev\.textSettings,\s*x: Math\.floor\(dimensions\.width \* defaultSizes\.text\.xPercent\),\s*y: Math\.floor\(dimensions\.height \* defaultSizes\.text\.yPercent\),\s*width: Math\.floor\(dimensions\.width \* defaultSizes\.text\.widthPercent\),\s*height: Math\.floor\(dimensions\.height \* defaultSizes\.text\.heightPercent\),\s*\}/s;
const uploadReplacement = `textSettings: prev.textSettings.map(ts => ({
        ...ts,
        x: Math.floor(dimensions.width * defaultSizes.text.xPercent),
        y: Math.floor(dimensions.height * defaultSizes.text.yPercent),
        width: Math.floor(dimensions.width * defaultSizes.text.widthPercent),
        height: Math.floor(dimensions.height * defaultSizes.text.heightPercent),
      }))`;
c = c.replace(uploadRegex, uploadReplacement);

fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);
console.log('Done script 2');
