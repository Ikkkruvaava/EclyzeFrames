"use client";

import React, { useState, useEffect, useRef, MouseEvent } from "react";
import {
  Upload,
  Save,
  X,
  ArrowRight,
  RefreshCw,
  Check,
  Camera,
  CropIcon,
  Info,
  Share2,
  Heart,
  CheckCircle2,
  Search,
  ChevronLeft,
  Eye,
  Share,
  Link as LinkIcon,
  Maximize2
} from "lucide-react";
import NextImage from "next/image"; // Import Next.js Image as NextImage
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface PlacementCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TextSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
  size: number;
  color: string;
  align?: "left" | "center" | "right";
}

interface Frame {
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
}

// Memoized Frame Card Component to prevent unnecessary re-renders in the main gallery
const FrameCard = React.memo(({
  frame,
  onSelect,
  onCopyLink,
  onToggleFavorite,
  isFavorite,
  copySuccess
}: {
  frame: Frame;
  onSelect: (f: Frame) => void;
  onCopyLink: (id: string, e: any) => void;
  onToggleFavorite: (id: string, e: any) => void;
  isFavorite: boolean;
  copySuccess: boolean;
}) => {
  return (
    <div
      className="group relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-transparent hover:border-emerald-100 card-clip p-3 pb-6 flex flex-col"
      onClick={() => onSelect(frame)}
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50">
        <NextImage
          src={frame.imageUrl}
          alt={frame.name}
          width={400} // Optimization: Use smaller width for thumbnails
          height={400}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white px-6 py-2.5 rounded-full shadow-xl border border-gray-50">
            <span className="text-gray-900 font-bold text-sm">Create Now</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => onCopyLink(frame._id, e)}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
            aria-label="Copy share link"
            title="Copy share link"
          >
            {copySuccess ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <LinkIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={(e) => onToggleFavorite(frame._id, e)}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
                }`}
            />
          </button>
        </div>

        {/* Favorite indicator */}
        {isFavorite && (
          <div className="absolute top-3 left-3">
            <div className="p-1.5 rounded-full bg-red-500 shadow-md">
              <Heart className="h-3 w-3 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="mt-4 px-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
          {frame.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-sm font-medium text-gray-400">
            {frame.dimensions.width}x{frame.dimensions.height}
          </p>
          {frame.usageCount && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-emerald-50 px-2 py-0.5 rounded-md">
              {frame.usageCount} shared
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

FrameCard.displayName = "FrameCard";


const UserPhotoFraming: React.FC = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userTexts, setUserTexts] = useState<string[]>([]);
  const [debouncedTexts, setDebouncedTexts] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"select" | "upload" | "crop" | "preview" | "complete">("select");
  const [favoriteFrames, setFavoriteFrames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memoized search filtering for speed
  const filteredFrames = React.useMemo(() => {
    if (!searchQuery.trim()) return frames;
    const lowerQuery = searchQuery.toLowerCase();
    return frames.filter((frame) =>
      frame.name.toLowerCase().includes(lowerQuery)
    );
  }, [frames, searchQuery]);

  // Memoized favorites
  const favoriteFramesList = React.useMemo(() => {
    return frames.filter(frame => favoriteFrames.includes(frame._id));
  }, [frames, favoriteFrames]);
  const [frameCopySuccess, setFrameCopySuccess] = useState<{ [key: string]: boolean }>({});
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userImgRef = useRef<HTMLImageElement>(null);
  const urlProcessedRef = useRef<boolean>(false);


  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check if the user is on a mobile device
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768);
      setIsMobileDevice(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/frames?activeOnly=true",
          {
            headers: {
              'x-api-key': '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d',
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setFrames(data.data);

          // Check if current selectedFrame is still valid
          if (selectedFrame && !data.data.some((f: { _id: string; }) => f._id === selectedFrame._id)) {
            setSelectedFrame(null);
          }
        } else {
          setError(data.message || "Failed to fetch frames");
        }
      } catch (err) {
        setError("An error occurred while fetching frames");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrames();

    const savedFavorites = localStorage.getItem('favoriteFrames');
    if (savedFavorites) {
      setFavoriteFrames(JSON.parse(savedFavorites));
    }
  }, []); // Empty dependency array - only run once on mount

  // Debounce text updates for smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTexts(userTexts);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [userTexts]);

  // Separate useEffect to handle URL parameter changes
  useEffect(() => {
    if (frames.length > 0 && !urlProcessedRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const frameId = urlParams.get('frame');

      if (frameId) {
        const frameFromUrl = frames.find((f) => f._id === frameId);
        if (frameFromUrl) {
          setSelectedFrame(frameFromUrl);
          if (frameFromUrl.hasImageArea === false) {
            setCurrentStep("preview");
          } else {
            setCurrentStep("upload");
            if (frameFromUrl.placementCoords) {
              const aspectRatio = frameFromUrl.placementCoords.width / frameFromUrl.placementCoords.height;
              setAspect(aspectRatio);
            }
          }
        }
      }
      urlProcessedRef.current = true;
    }
  }, [frames]); // Only depend on frames

  useEffect(() => {
    localStorage.setItem('favoriteFrames', JSON.stringify(favoriteFrames));
  }, [favoriteFrames]);

  const toggleFavorite = (frameId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFavoriteFrames(prev => {
      if (prev.includes(frameId)) {
        return prev.filter(id => id !== frameId);
      } else {
        return [...prev, frameId];
      }
    });
  };

  const handleSelectFrame = (frame: Frame) => {
    setSelectedFrame(frame);
    if (frame.hasImageArea === false) {
      setCurrentStep("preview");
    } else {
      setCurrentStep("upload");
    }

    // Calculate the correct aspect ratio from the frame's placement coordinates
    if (frame.placementCoords) {
      const aspectRatio = frame.placementCoords.width / frame.placementCoords.height;
      setAspect(aspectRatio);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('frame', frame._id);
    window.history.pushState({}, '', url);
  };

  const handleCopyFrameLink = (frameId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const shareLink = `${window.location.origin}${window.location.pathname}?frame=${frameId}`;

    navigator.clipboard.writeText(shareLink).then(
      () => {
        setFrameCopySuccess({ ...frameCopySuccess, [frameId]: true });
        setTimeout(() => {
          setFrameCopySuccess({ ...frameCopySuccess, [frameId]: false });
        }, 2000);
      },
      (err) => {
        console.error('Could not copy link: ', err);
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    console.log('File selected:', file.name, file.type, file.size);

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, JPEG, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setError(null);

    try {
      const objectUrl = URL.createObjectURL(file);
      console.log('Object URL created:', objectUrl);
      setUserImage(objectUrl);
      setCroppedImage(null);
      setCurrentStep("crop");
    } catch (error) {
      console.error('Error creating object URL:', error);
      setError("Failed to process the image. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('File dropped:', file.name, file.type, file.size);

      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (PNG, JPG, JPEG, GIF)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setError(null);

      try {
        const objectUrl = URL.createObjectURL(file);
        console.log('Object URL created from drop:', objectUrl);
        setUserImage(objectUrl);
        setCroppedImage(null);
        setCurrentStep("crop");
      } catch (error) {
        console.error('Error creating object URL from drop:', error);
        setError("Failed to process the image. Please try again.");
      }
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!aspect || !selectedFrame) return;

    const { width, height } = e.currentTarget;

    // For mobile devices, ensure we're creating an appropriate initial crop
    // that matches the frame aspect ratio and is properly centered
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90, // Use percentage to be device-independent
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const handleAutoFit = () => {
    if (!userImgRef.current || !selectedFrame || !aspect) return;

    const image = userImgRef.current;
    const { width, height } = image;

    // Create an optimal crop that fits the entire image while maintaining the frame's aspect ratio
    const optimalCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(optimalCrop);
    setCompletedCrop(optimalCrop as unknown as PixelCrop);
  };

  const createCroppedImage = () => {
    if (!userImgRef.current || !completedCrop || !selectedFrame) return;

    const image = userImgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Calculate the scaling factors between the displayed image and its natural size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set the canvas to the exact dimensions needed for the frame placement
    // This ensures the image will fit perfectly in the frame regardless of device
    const targetWidth = selectedFrame.placementCoords ? selectedFrame.placementCoords.width : 200;
    const targetHeight = selectedFrame.placementCoords ? selectedFrame.placementCoords.height : 200;

    // Create canvas at the exact dimensions needed for the frame
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calculate the crop dimensions in the original image
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Enhanced image quality settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the image to fit the placement coordinates exactly
    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, targetWidth, targetHeight
    );

    // Use PNG for better quality
    const croppedImageUrl = canvas.toDataURL('image/png', 1.0);
    setCroppedImage(croppedImageUrl);

    return croppedImageUrl;
  };

  const handleApplyCrop = () => {
    if (!completedCrop) {
      setError("Please complete the crop first");
      return;
    }

    const croppedImageUrl = createCroppedImage();
    if (croppedImageUrl) {
      setCroppedImage(croppedImageUrl);
      setCurrentStep("preview");
    }
  };

  useEffect(() => {
    if (currentStep !== "preview" || !canvasRef.current || !selectedFrame) return;
    if (selectedFrame.hasImageArea !== false && !croppedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    setIsLoading(true);

    // Get device pixel ratio for high-DPI displays
    const pixelRatio = window.devicePixelRatio || 1;

    // Set canvas dimensions based on the frame dimensions
    canvas.width = selectedFrame.dimensions.width * pixelRatio;
    canvas.height = selectedFrame.dimensions.height * pixelRatio;

    // Set the canvas CSS dimensions for proper display
    canvas.style.width = `${selectedFrame.dimensions.width}px`;
    canvas.style.height = `${selectedFrame.dimensions.height}px`;

    // Scale the context to account for the pixel ratio
    ctx.scale(pixelRatio, pixelRatio);

    // Enable high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const frameImg = new Image();
    const userImg = new Image();

    frameImg.crossOrigin = "anonymous";
    userImg.crossOrigin = "anonymous";

    frameImg.src = selectedFrame.imageUrl;
    if (selectedFrame.hasImageArea !== false && croppedImage) {
      userImg.src = croppedImage;
    }

    const loadImages = () => {
      return new Promise<void>((resolve, reject) => {
        let loadedCount = 0;
        const totalToLoad = (selectedFrame.hasImageArea !== false && croppedImage) ? 2 : 1;

        const onLoad = () => {
          loadedCount++;
          if (loadedCount === totalToLoad) resolve();
        };

        frameImg.onload = onLoad;
        if (selectedFrame.hasImageArea !== false && croppedImage) {
          userImg.onload = onLoad;
          userImg.onerror = () => reject(new Error("Failed to load user image"));
        }

        frameImg.onerror = () => reject(new Error("Failed to load frame image"));
      });
    };

    loadImages()
      .then(() => {
        // Clear the entire canvas
        ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);

        if (selectedFrame.hasImageArea !== false && selectedFrame.placementCoords) {
          const placement = selectedFrame.placementCoords;
          // Draw the user image at exact placement coordinates
          ctx.drawImage(
            userImg,
            0, 0, userImg.width, userImg.height,
            placement.x, placement.y, placement.width, placement.height
          );
        }

        // Draw the frame overlay
        ctx.drawImage(
          frameImg,
          0, 0,
          canvas.width / pixelRatio,
          canvas.height / pixelRatio
        );

        if (selectedFrame.textSettings && Array.isArray(selectedFrame.textSettings)) {
          selectedFrame.textSettings.forEach((ts: any, index: number) => {
            const textToDraw = userTexts[index] || "";
            if (textToDraw) {
              // Handle very large frames (e.g., 3240px) by ensuring font size is at least visible.
              // If ts.size is missing or very small relative to frame, we use a default.
              let fontSize = ts.size || ts.fontSize || 30;

              // If the font size is clearly too small for the canvas (e.g. 20px on a 3000px canvas)
              // and it's likely a missing unit/scaling error, we try to preserve it but ensure it's drawn.
              const fontFamily = ts.font || 'Arial, sans-serif';

              ctx.font = `${fontSize}px ${fontFamily}`;
              ctx.fillStyle = ts.color || '#000000';
              ctx.textAlign = ts.align || 'center';
              ctx.textBaseline = 'middle';

              const itemWidth = ts.width || 0;
              const itemHeight = ts.height || 0;

              let textX = ts.x;
              let textY = ts.y;

              if (ts.align === 'center') {
                textX = ts.x + (itemWidth / 2);
              } else if (ts.align === 'right') {
                textX = ts.x + itemWidth;
              }

              textY = ts.y + (itemHeight / 2);

              // Debug: log where we are drawing for large frames
              if (selectedFrame.dimensions.width > 2000) {
                console.log(`Drawing text "${textToDraw}" at (${textX}, ${textY}) with size ${fontSize}`);
              }

              ctx.fillText(textToDraw, textX, textY);
            }
          });
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error rendering preview:', error);
        setError('Failed to render preview. Please try again.');
        setIsLoading(false);
      });
  }, [currentStep, croppedImage, selectedFrame, debouncedTexts]);

  const trackFrameUsage = async (frameId: string): Promise<boolean> => {
    if (!frameId) return false;

    try {
      const response = await fetch(`/api/frames/${frameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incrementUsage: true }),
      });

      const data = await response.json();

      if (!data.success) {
        console.warn("Failed to track frame usage:", data.message);
        return false;
      }

      console.log('Frame usage tracked successfully:', data.data.usageCount);
      return true;
    } catch (error) {
      console.error("Error tracking frame usage:", error);
      return false;
    }
  };

  const handleGenerateImage = async () => {
    if (!canvasRef.current || !selectedFrame) return;

    setIsProcessing(true);
    try {
      // Use PNG format with maximum quality
      const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
      setFinalImage(dataUrl);

      const usageTracked = await trackFrameUsage(selectedFrame._id);
      if (!usageTracked) {
        console.warn('Usage tracking failed but image generated successfully');
      }


      setCurrentStep("complete");
    } catch (err) {
      setError("Failed to generate image");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setCroppedImage(null);
    setUserTexts([]);
    setFinalImage(null);
    setSelectedFrame(null);
    setCurrentStep("select");
    // setImagePosition({ x: 0, y: 0, scale: 1, width: 0, height: 0 });
    setCrop(undefined);
    setCompletedCrop(null);

    const url = new URL(window.location.href);
    url.searchParams.delete('frame');
    window.history.pushState({}, '', url);
  };


  const handleShare = async () => {
    if (!finalImage) return;

    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const fileName = `framed-photo-${selectedFrame?.name.replace(/\s+/g, '-').toLowerCase() || 'photo'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Framed Photo',
            text: 'Check out my framed photo!',
            files: [file],
          });
          console.log('Shared successfully via Web Share API');
          return;
        } catch (error) {
          console.error('Web Share API failed:', error);
        }
      }

      try {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download triggered via Blob URL');
        return;
      } catch (error) {
        console.error('Blob URL download failed:', error);
      }

      const link = document.createElement('a');
      link.href = finalImage;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Download triggered via data URL');

    } catch (error) {
      console.error('Error in share function:', error);
      alert('Unable to share/download the image. Please try saving it manually by long-pressing the image.');
    }
  };

  if (isLoading && currentStep === "select") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9]">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-gray-100 border-t-brand-green rounded-full mb-4"></div>
          <p className="text-gray-900 text-lg font-bold">Loading frames...</p>
        </div>
      </div>
    );
  }

  if (error && !frames.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] p-4">
        <div className="text-center bg-white rounded-[2.5rem] border border-gray-50 p-8 max-w-md shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
            <X className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 font-medium mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-brand-green text-white rounded-full font-bold hover:bg-emerald-600 transition-all flex items-center mx-auto shadow-lg shadow-emerald-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!frames.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] p-4">
        <div className="text-center bg-white rounded-[2.5rem] border border-gray-50 p-8 max-w-md shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-6">
            <Camera className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Frames</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            There are currently no active photo frames available.
            Please check back later or contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-outfit">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-4 md:p-6 pb-16 pt-8">
          {currentStep === "select" && (
            <div className="space-y-16 pt-12">
              {/* Hero Section */}
              <div className="text-center max-w-4xl mx-auto mb-16 relative">
                <div className="mb-4 inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium text-gray-600">
                  <span className="mr-2">🎉</span> Best App for community frames
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                  SAFE WEB FOR <span className="text-brand-green">FRAMES</span> TO <br />
                  LEARN AND GROW
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                  With Built In Customization And High Quality Rendering
                </p>

                <div className="flex justify-center gap-4 mb-16">
                  <button
                    onClick={() => {
                      const el = document.getElementById('available-frames');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-brand-green text-white rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200"
                  >
                    Start Creating
                  </button>
                </div>

                {/* Card Fan Display */}
                <div className="relative h-64 md:h-80 w-full max-w-3xl mx-auto mb-20">
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full h-full perspective-1000">
                    {frames.slice(0, 5).map((frame, i) => (
                      <div
                        key={`fan-${frame._id}`}
                        className="absolute w-48 h-48 md:w-64 md:h-64 bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden transition-all duration-500 hover:scale-110 hover:z-50 card-clip"
                        style={{
                          transform: `translateX(${(i - 2) * 60}px) rotate(${(i - 2) * 8}deg) translateY(${Math.abs(i - 2) * 10}px)`,
                          zIndex: 10 - Math.abs(i - 2)
                        }}
                      >
                        <NextImage
                          src={frame.imageUrl}
                          alt={frame.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative max-w-xl mx-auto mt-20">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search frames by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-4 px-6 pl-14 border-0 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-green transition-all duration-300 bg-white placeholder:text-gray-400 text-lg"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Render Search Results with Memoized FrameCard */}
              {filteredFrames.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-6">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No frames found</h3>
                  <p className="text-gray-500 mb-8 font-medium">Try searching with a different keyword</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2.5 bg-brand-green text-white rounded-full hover:bg-emerald-600 transition-colors font-bold shadow-lg shadow-emerald-100"
                    >
                      Show All Frames
                    </button>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2.5 bg-white text-gray-700 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors font-bold"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : (
                <div id="available-frames">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      Available Collections
                    </h2>
                    <span className="text-sm font-bold text-brand-green bg-emerald-50 px-4 py-1.5 rounded-full">
                      {filteredFrames.length} Items Found
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredFrames.map((frame) => (
                      <FrameCard
                        key={frame._id}
                        frame={frame}
                        onSelect={handleSelectFrame}
                        onCopyLink={handleCopyFrameLink}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favoriteFrames.includes(frame._id)}
                        copySuccess={!!frameCopySuccess[frame._id]}
                      />
                    ))}
                  </div>
                </div>
              )}

              {favoriteFrames.length > 0 && (
                <div className="mt-20 pt-12 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
                      <Heart className="h-6 w-6 mr-3 text-red-500 fill-red-500" />
                      Your Favorites
                    </h2>
                    <span className="text-sm font-bold text-red-500 bg-red-50 px-4 py-1.5 rounded-full">
                      {favoriteFrames.length} Saved
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favoriteFramesList.map((frame) => (
                      <div
                        key={`fav-${frame._id}`}
                        className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer border border-transparent hover:border-red-100 p-2 pb-4 flex flex-col"
                        onClick={() => handleSelectFrame(frame)}
                      >
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                          <NextImage
                            src={frame.imageUrl}
                            alt={frame.name}
                            width={300} // Small thumbnails for favorites
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />

                          <div className="absolute top-2 left-2 z-20">
                            <div className="p-1.5 rounded-full bg-red-500 shadow-lg">
                              <Heart className="h-3 w-3 text-white fill-white" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 px-2">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {frame.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === "upload" && selectedFrame && (
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden mt-15">
              <div className="bg-[#FDFCF9] p-8 border-b border-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Upload Photo</h2>
                <p className="text-gray-500 font-medium">Choose a photo for <span className="text-brand-green">{selectedFrame.name}</span></p>
              </div>

              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="w-full lg:w-1/2 lg:order-2">
                    <div className="bg-[#FDFCF9] rounded-3xl p-6 border border-gray-50 shadow-sm mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Frame</h3>
                      <div
                        style={{
                          aspectRatio: `${selectedFrame.dimensions.width} / ${selectedFrame.dimensions.height}`,
                        }}
                        className="rounded-2xl overflow-hidden relative flex items-center justify-center bg-white shadow-inner card-clip"
                      >
                        <NextImage
                          src={selectedFrame.imageUrl}
                          alt={selectedFrame.name}
                          width={selectedFrame.dimensions.width}
                          height={selectedFrame.dimensions.height}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-50">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-brand-green mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-emerald-900 mb-2">Pro Tips</h4>
                          <ul className="text-xs text-emerald-800 space-y-2">
                            <li>• Use high-res images for better results</li>
                            <li>• You can Crop & Zoom in the next step</li>
                            <li>• Add custom text to personalize</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 lg:order-1">
                    <div
                      className={`border-4 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center min-h-[350px] relative transition-all group ${isDragOver
                        ? 'border-brand-green bg-emerald-50/50'
                        : 'border-gray-100 bg-[#FDFCF9] hover:border-brand-green'
                        }`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="rounded-3xl p-6 mb-6 bg-white shadow-xl group-hover:scale-110 transition-transform">
                        <Upload className="h-10 w-10 text-brand-green" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 text-center mb-1">
                        Drop your photo here
                      </p>
                      <p className="text-sm font-medium text-gray-400 text-center mb-6">
                        or <span className="text-brand-green cursor-pointer">click to browse</span>
                      </p>

                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-400 border border-gray-50 shadow-sm uppercase tracking-wider">PNG</span>
                        <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-400 border border-gray-50 shadow-sm uppercase tracking-wider">JPG</span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
                      />
                    </div>

                    {error && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-red-400" />
                        </div>
                        <p className="ml-3">{error}</p>
                      </div>
                    )}

                    <div className="mt-8 space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight">Personalize</h4>
                      {selectedFrame.textSettings && selectedFrame.textSettings.map((_, index) => (
                        <div key={index} className="relative">
                          <input
                            type="text"
                            value={userTexts[index] || ''}
                            onChange={(e) => {
                              const newTexts = [...userTexts];
                              newTexts[index] = e.target.value;
                              setUserTexts(newTexts);
                            }}
                            placeholder={"Enter text here..."}
                            className="w-full px-6 py-4 bg-[#FDFCF9] border-0 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-green transition-all text-lg font-medium placeholder:text-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("select")}
                    className="px-8 py-3 bg-white border border-gray-100 text-gray-700 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep("crop")}
                    disabled={!userImage}
                    className={`px-8 py-3 text-white rounded-full font-bold transition-all flex items-center shadow-lg ${userImage
                      ? 'bg-brand-green hover:bg-emerald-600 hover:shadow-emerald-100'
                      : 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
                      }`}
                  >
                    Continue <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "crop" && selectedFrame && userImage && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-15">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Crop Your Photo</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Adjust your photo to perfectly fit the frame
                </p>
              </div>

              <div className="p-6">
                {/* New mobile-friendly crop controls */}
                {isMobileDevice && (
                  <div className="flex justify-center mb-6 space-x-3">
                    <button
                      onClick={handleAutoFit}
                      className="px-6 py-2 bg-brand-green text-white rounded-full font-bold text-sm flex items-center shadow-lg"
                    >
                      <Maximize2 className="h-4 w-4 mr-2" /> Auto-Fit
                    </button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-4 mb-6 relative">
                  <div className="flex items-center justify-center">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      className="max-h-[500px] max-w-full"
                    >
                      <NextImage
                        ref={userImgRef}
                        src={userImage}
                        alt="User uploaded image"
                        onLoad={onImageLoad}
                        className="max-h-[500px] max-w-full object-contain"
                        width={500}
                        height={500}
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    </ReactCrop>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white shadow-sm text-gray-700 text-xs px-3 py-1.5 rounded-full flex items-center">
                    <CropIcon className="h-3 w-3 mr-1.5" />
                    {isMobileDevice ? "Pinch or drag to adjust" : "Drag corners to adjust crop"}
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <CropIcon className="h-5 w-5 mr-3 text-brand-green" />
                      Crop Instructions
                    </h3>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-500 leading-relaxed">
                        {isMobileDevice
                          ? "Drag the corners of the selection box to crop your photo. Use the Auto-Fit button for a perfect fit."
                          : "Drag the corners of the selection box to perfectly crop your photo. The crop ratio is locked to match the frame's photo area dimensions."
                        }
                      </p>

                      {!isMobileDevice && (
                        <button
                          onClick={handleAutoFit}
                          className="mt-2 px-6 py-2 bg-brand-green text-white rounded-full font-bold text-sm flex items-center shadow-lg hover:shadow-emerald-100 transition-all"
                        >
                          <Maximize2 className="h-4 w-4 mr-2" /> Auto-Fit to Frame
                        </button>
                      )}

                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Cropping Tips
                    </h4>
                    <ul className="space-y-3 text-sm text-blue-700">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-600 text-xs mr-2">1</div>
                        <span>Focus on the most important part of your photo</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-600 text-xs mr-2">2</div>
                        <span>The aspect ratio is fixed to match the frame&apos;s photo area</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-600 text-xs mr-2">3</div>
                        <span>Make sure faces are clearly visible and centered</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-600 text-xs mr-2">4</div>
                        <span>{isMobileDevice ? "Use Auto-Fit for best results" : "When you're happy with the crop, click \"Apply Crop\""}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700 flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="ml-3">{error}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("upload")}
                    className="px-8 py-3 bg-white border border-gray-100 text-gray-700 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyCrop}
                    className="px-8 py-3 bg-brand-green text-white rounded-full font-bold shadow-lg hover:bg-emerald-600 hover:shadow-emerald-100 transition-all flex items-center"
                  >
                    Apply Crop <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "preview" && selectedFrame && (selectedFrame.hasImageArea === false || croppedImage) && (
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden mt-15">
              <div className="bg-[#FDFCF9] p-8 border-b border-gray-50">
                <h2 className="text-3xl font-bold text-gray-900">Preview</h2>
                <p className="text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  Almost ready! Check your <span className="text-brand-green">{selectedFrame.name}</span>
                </p>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-4 mb-6 flex items-center justify-center relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full mb-3"></div>
                        <p className="text-gray-600 text-sm">Generating preview...</p>
                      </div>
                    </div>
                  )}

                  <div
                    className="relative"
                    style={{
                      width: 'auto',
                      maxWidth: '100%',
                      maxHeight: '70vh'
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain'
                      }}
                      className="rounded-md shadow-sm"
                    />
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mb-6">
                  Final dimensions: {selectedFrame.dimensions.width} × {selectedFrame.dimensions.height} pixels
                </div>

                <div className="my-4 space-y-3">
                  <h4 className="text-lg font-bold text-gray-900 tracking-tight">Personalize</h4>
                  {selectedFrame.textSettings && selectedFrame.textSettings.map((_, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={userTexts[index] || ''}
                        onChange={(e) => {
                          const newTexts = [...userTexts];
                          newTexts[index] = e.target.value;
                          setUserTexts(newTexts);
                        }}
                        placeholder={"Enter text here..."}
                        className="w-full px-6 py-4 bg-[#FDFCF9] border-0 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-green transition-all text-lg font-medium placeholder:text-gray-300"
                      />
                    </div>
                  ))}
                  {userTexts.some(t => t) && (
                    <p className="mt-2 text-xs text-green-600 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Text will appear on the frame
                    </p>
                  )}
                </div>

                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-blue-500" />
                      Preview Details
                    </h3>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        This is how your framed photo will look. If you&apos;re happy with it, click &apos;Generate Final Image&apos; to create your shareable picture.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-600">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      What&apos;s Next?
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">1</div>
                        <span>When you click &quot;Generate Final Image&quot;, your photo will be processed</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">2</div>
                        <span>You&apos;ll be able to download your framed photo</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">3</div>
                        <span>Share your creation directly to social media or messaging apps</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">4</div>
                        <span>If you need to make changes, use the &quot;Back&quot; button</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700 flex items-start">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="ml-3">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(selectedFrame.hasImageArea === false ? "select" : "crop")}
                    className="px-8 py-3 bg-white border border-gray-100 text-gray-700 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    className="px-8 py-3 bg-brand-green text-white rounded-full font-bold shadow-lg hover:bg-emerald-600 hover:shadow-emerald-100 transition-all flex items-center"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Generate Image <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "complete" && finalImage && selectedFrame && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden mt-15">
              <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900">Your Masterpiece is Ready!</h2>
                <p className="text-gray-500 font-medium">Download or share your creation with the world</p>
              </div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-brand-green mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfect!</h2>
                  <p className="text-gray-500 font-medium">Your photo has been successfully framed.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-4 flex items-center justify-center">
                    <div
                      className="relative"
                      style={{
                        width: 'auto',
                        maxWidth: '100%',
                        maxHeight: '70vh'
                      }}
                    >
                      <NextImage
                        src={finalImage}
                        alt="Final framed photo"
                        width={selectedFrame.dimensions.width}
                        height={selectedFrame.dimensions.height}
                        className="max-w-full object-contain rounded-md shadow-sm"
                        sizes="(max-width: 1024px) 66vw, 50vw"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                      <h3 className="text-base font-medium text-gray-700 mb-4 flex items-center">
                        <Save className="h-4 w-4 mr-2 text-blue-500" />
                        Download Options
                      </h3>

                      <a
                        href={finalImage}
                        download={`framed-photo-${selectedFrame.name.replace(/\s+/g, '-').toLowerCase()}.png`}
                        className="w-full py-4 px-4 bg-brand-green text-white rounded-full font-bold mb-4 hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg hover:shadow-emerald-100"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Download High Res
                      </a>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Create Another
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 hidden md:block">
                      <h3 className="text-base font-medium text-gray-700 mb-4 flex items-center">
                        <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                        Share Your Creation
                      </h3>

                      <button
                        type="button"
                        onClick={handleShare}
                        className="w-full py-4 px-4 bg-brand-green text-white rounded-full font-bold hover:bg-emerald-600 transition-all flex items-center justify-center mb-4 shadow-lg hover:shadow-emerald-100"
                      >
                        <Share className="h-5 w-5 mr-3" />
                        Share Now
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="text-base font-medium text-gray-800 mb-2">
                    Thank You for Using Our Photo Framing Tool!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    We hope you enjoyed creating your framed photo. Don&apos;t forget to download your creation and share it with your friends and family!
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 py-3 bg-brand-green hover:bg-emerald-600 text-white rounded-full font-bold transition-all inline-flex items-center shadow-lg hover:shadow-emerald-100"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {(currentStep === "select" || currentStep === "upload") && (
        <section className="bg-white border-t border-gray-50 py-20 mt-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 tracking-tight">HOW IT WORKS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 bg-[#FDFCF9] rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-gray-50">
                  <Camera className="h-10 w-10 text-brand-green" />
                  <div className="absolute -right-3 -top-3 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pick Collection</h3>
                <p className="text-gray-500 font-medium px-4">
                  Browse through our premium curated library of community frames.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 bg-[#FDFCF9] rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-gray-50">
                  <Upload className="h-10 w-10 text-brand-green" />
                  <div className="absolute -right-3 -top-3 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Photo</h3>
                <p className="text-gray-500 font-medium px-4">
                  Add your favorite photo and adjust it to fit the frame perfectly.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 bg-[#FDFCF9] rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-gray-50">
                  <Share2 className="h-10 w-10 text-brand-green" />
                  <div className="absolute -right-3 -top-3 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Share Away</h3>
                <p className="text-gray-500 font-medium px-4">
                  Download high-res results instantly and share with your community.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SUHBA Union. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Help</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Contact</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default UserPhotoFraming;