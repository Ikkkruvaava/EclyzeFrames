const fs = require('fs');
let c = fs.readFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', 'utf8');

const regex = /const img = new Image\(\);\s*img\.src = previewImage;\s*img\.onload = \(\) => \{\s*\};\s*\};\s*/s;

const replacement = `const img = new Image();
    img.src = previewImage;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (editorData.hasImageArea && editorData.placementCoords) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.fillRect(editorData.placementCoords.x, editorData.placementCoords.y, editorData.placementCoords.width, editorData.placementCoords.height);
        ctx.strokeStyle = "rgba(37, 99, 235, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(editorData.placementCoords.x, editorData.placementCoords.y, editorData.placementCoords.width, editorData.placementCoords.height);
        
        const imageHandleColor = "rgba(37, 99, 235, 1)";
        drawHandle(ctx, editorData.placementCoords.x, editorData.placementCoords.y, imageHandleColor);
        drawHandle(ctx, editorData.placementCoords.x + editorData.placementCoords.width, editorData.placementCoords.y, imageHandleColor);
        drawHandle(ctx, editorData.placementCoords.x, editorData.placementCoords.y + editorData.placementCoords.height, imageHandleColor);
        drawHandle(ctx, editorData.placementCoords.x + editorData.placementCoords.width, editorData.placementCoords.y + editorData.placementCoords.height, imageHandleColor);
        
        ctx.fillStyle = "rgba(37, 99, 235, 0.9)";
        ctx.fillRect(editorData.placementCoords.x, editorData.placementCoords.y, 80, 20);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Inter', system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("Image Area", editorData.placementCoords.x + 6, editorData.placementCoords.y + 14);
      }

      const textHandleColor = "rgba(5, 150, 105, 1)";
      editorData.textSettings.forEach((ts, index) => {
        ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
        ctx.fillRect(ts.x, ts.y, ts.width, ts.height);
        
        ctx.strokeStyle = activeTextIndex === index ? "rgba(239, 68, 68, 0.8)" : "rgba(5, 150, 105, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(ts.x, ts.y, ts.width, ts.height);

        ctx.font = \`\${ts.size}px \${ts.font}\`;
        ctx.fillStyle = ts.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textX = ts.x + ts.width / 2;
        const textY = ts.y + ts.height / 2;
        ctx.fillText(sampleText, textX, textY);

        drawHandle(ctx, ts.x, ts.y, textHandleColor);
        drawHandle(ctx, ts.x + ts.width, ts.y, textHandleColor);
        drawHandle(ctx, ts.x, ts.y + ts.height, textHandleColor);
        drawHandle(ctx, ts.x + ts.width, ts.y + ts.height, textHandleColor);

        ctx.font = "12px 'Inter', system-ui, sans-serif";
        ctx.fillStyle = "rgba(5, 150, 105, 0.9)";
        ctx.fillRect(ts.x, ts.y, 70, 20);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(\`Text Area \${index + 1}\`, ts.x + 6, ts.y + 14);
      });

      if (showGrid) {
        ctx.strokeStyle = "rgba(156, 163, 175, 0.2)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(156, 163, 175, 0.4)";
        for (let x = 0; x < canvas.width; x += 100) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 100) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    };
  }, [previewImage, editorData, showGrid, sampleText]);

  useEffect(() => {
    if (!previewCanvasRef.current || !previewImage) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = editorData.dimensions.width;
    canvas.height = editorData.dimensions.height;

    const renderPreview = () => {
      setIsLoading(true);
      const frameImg = new Image();
      frameImg.src = previewImage;
      const userImg = new Image();
      userImg.src = "/api/placeholder/400/400";

      frameImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

        userImg.onload = () => {
          if (editorData.hasImageArea && editorData.placementCoords) {
            ctx.drawImage(userImg, editorData.placementCoords.x, editorData.placementCoords.y, editorData.placementCoords.width, editorData.placementCoords.height);
          }
          editorData.textSettings.forEach(ts => {
            ctx.font = \`\${ts.size}px \${ts.font}\`;
            ctx.fillStyle = ts.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const textX = ts.x + ts.width / 2;
            const textY = ts.y + ts.height / 2;
            ctx.fillText(sampleText, textX, textY);
          });
          setIsLoading(false);
        };

        userImg.onerror = () => {
          if (editorData.hasImageArea && editorData.placementCoords) {
            ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
            ctx.fillRect(editorData.placementCoords.x, editorData.placementCoords.y, editorData.placementCoords.width, editorData.placementCoords.height);
            ctx.fillStyle = "#ffffff";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Sample User Image", editorData.placementCoords.x + editorData.placementCoords.width / 2, editorData.placementCoords.y + editorData.placementCoords.height / 2);
          }
          setIsLoading(false);
        };
      };

      frameImg.onerror = () => {
        setIsLoading(false);
        console.error("Failed to load frame image");
      };
    };

    renderPreview();
  }, [previewImage, editorData, sampleText]);
`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/app/admin/(admin)/photoframing/edit/page.tsx', c);
