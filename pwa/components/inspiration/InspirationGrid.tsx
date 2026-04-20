import Masonry from "react-masonry-css";
import InspirationCard from "./InspirationCard";

interface InspirationPhoto {
    id: number;
    imagePath: string;
    caption: string;
    style: string;
    category?: { name: string };
    city?: { name: string };
}

interface InspirationGridProps {
    photos: InspirationPhoto[];
    onPhotoClick: (photo: InspirationPhoto) => void;
}

export default function InspirationGrid({ photos, onPhotoClick }: InspirationGridProps) {
    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-6"
            columnClassName="bg-clip-padding"
        >
            {photos.map((photo) => (
                <div key={photo.id} className="mb-6">
                    <InspirationCard 
                        photo={photo} 
                        onClick={() => onPhotoClick(photo)} 
                    />
                </div>
            ))}
        </Masonry>
    );
}
