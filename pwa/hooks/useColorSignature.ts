import { useState, useEffect } from 'react';

export function useColorSignature(imagePath: string | null) {
    const [palette, setPalette] = useState<string[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (!imagePath) {
            setPalette([]);
            return;
        }

        const extractColors = async () => {
            setIsExtracting(true);
            try {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                
                // Construct the full image URL
                const fullUrl = imagePath.startsWith('http') 
                    ? imagePath 
                    : `${window.location.origin}/images/inspiration/${imagePath}.png`;

                img.src = fullUrl;

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorMap: Record<string, number> = {};

                // Sampling pixels for performance
                for (let i = 0; i < imageData.length; i += 400) {
                    const r = imageData[i];
                    const g = imageData[i+1];
                    const b = imageData[i+2];
                    
                    // Simple quantization
                    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                    colorMap[hex] = (colorMap[hex] || 0) + 1;
                }

                const sortedColors = Object.entries(colorMap)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([color]) => color);

                setPalette(sortedColors);
            } catch (error) {
                console.error("Failed to extract color palette", error);
                // Fallback palette
                setPalette(['#E8472A', '#1A1A1A', '#F7F7F7', '#AEAEAE', '#FFFFFF']);
            } finally {
                setIsExtracting(false);
            }
        };

        extractColors();
    }, [imagePath]);

    return { palette, isExtracting };
}
