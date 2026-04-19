export interface Category { id: number; name: string; slug: string; emoji: string | null; }
export interface City     { id: number; name: string; slug: string; }

export interface WizardValues {
    businessName:    string;
    tagline:         string;
    category:        string;
    description:     string;
    cities:          string[];
    whatsapp:        string;
    website:         string;
    instagram:       string;
    priceRange:      string;
    startingPrice:   string;
    languagesSpoken: string[];
    coverImageUrl:   string;
    galleryImages:   string[];
    coverFile:       File | null;
    coverPreview:    string | null;
    galleryFiles:    (File | null)[];
    galleryPreviews: (string | null)[];
}

export const INITIAL_VALUES: WizardValues = {
    businessName: "", tagline: "", category: "",
    description: "", cities: [], whatsapp: "", website: "", instagram: "",
    priceRange: "MADMAD", startingPrice: "",
    languagesSpoken: ["ary", "fr"],
    coverImageUrl: "", galleryImages: ["", "", "", "", "", ""],
    coverFile: null, coverPreview: null,
    galleryFiles: [null, null, null, null, null, null],
    galleryPreviews: [null, null, null, null, null, null],
};
