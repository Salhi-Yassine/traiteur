import type { VendorProfile } from '@/types/api';
import type {
  WeddingDashboardProfile,
  InspirationPhoto,
} from './types';

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().split('T')[0];
}

export const MOCK_PROFILE: WeddingDashboardProfile = {
  id: 0,
  brideName: 'Yasmine',
  groomName: 'Yassine',
  weddingDate: daysFromNow(87),
  weddingCity: 'Marrakech',
  totalBudgetMad: 120_000,
  stylePersona: 'Élégant',
  quizResults: null,
  budgetItems: [{ spentAmount: 42_000 }, { spentAmount: 18_500 }],
  guests: Array.from({ length: 48 }),
  checklistTasks: [
    { id: 1, name: 'Réserver la salle de réception', status: 'done', dueDate: daysFromNow(-30), relatedVendorCategory: 'salle' },
    { id: 2, name: 'Choisir le traiteur', status: 'done', dueDate: daysFromNow(-15), relatedVendorCategory: 'traiteur' },
    { id: 3, name: 'Envoyer les faire-parts', status: 'in_progress', dueDate: daysFromNow(5), relatedVendorCategory: 'faire-part' },
    { id: 4, name: 'Confirmer le photographe', status: 'todo', dueDate: daysFromNow(12), relatedVendorCategory: 'photographe' },
    { id: 5, name: 'Acheter la robe de mariée', status: 'todo', dueDate: daysFromNow(20), relatedVendorCategory: 'robe' },
    { id: 6, name: 'Choisir le DJ ou orchestre', status: 'todo', dueDate: daysFromNow(25), relatedVendorCategory: 'musique' },
    { id: 7, name: 'Planifier la décoration', status: 'todo', dueDate: daysFromNow(40), relatedVendorCategory: 'decoration' },
    { id: 8, name: 'Louer la voiture', status: 'todo', dueDate: daysFromNow(50), relatedVendorCategory: 'transport' },
  ],
};
// ─── Persona photo map ───────────────────────────────────────────────────────

export const PERSONA_PHOTO_MAP: Record<string, InspirationPhoto[]> = {
  'Élégant': [
    { id: 101, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_elegant_1' },
    { id: 102, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_elegant_2' },
    { id: 103, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_elegant_3' },
    { id: 104, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_elegant_4' },
  ],
  'Traditionnel': [
    { id: 111, url: 'https://images.unsplash.com/photo-1535266818359-e11da8b3a1bb?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_trad_1' },
    { id: 112, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_trad_2' },
    { id: 113, url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_trad_3' },
    { id: 114, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_trad_4' },
  ],
  'Bohème': [
    { id: 121, url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_boho_1' },
    { id: 122, url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_boho_2' },
    { id: 123, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_boho_3' },
    { id: 124, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_boho_4' },
  ],
  'Moderne': [
    { id: 131, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_modern_1' },
    { id: 132, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_modern_2' },
    { id: 133, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_modern_3' },
    { id: 134, url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80', labelKey: 'dashboard.couple.style_board.photo_modern_4' },
  ],
  default: [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', labelKey: 'dashboard.couple.inspiration.photo_1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', labelKey: 'dashboard.couple.inspiration.photo_2' },
    { id: 3, url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80', labelKey: 'dashboard.couple.inspiration.photo_3' },
    { id: 4, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', labelKey: 'dashboard.couple.inspiration.photo_4' },
  ],
};

// ─── Vendors ─────────────────────────────────────────────────────────────────

const BASE_VENDOR: Omit<VendorProfile, '@id' | 'id' | 'slug' | 'businessName' | 'tagline' | 'category' | 'cities' | 'priceRange' | 'startingPrice' | 'coverImageUrl' | 'averageRating' | 'reviewCount' | 'isVerified'> = {
  '@type': 'VendorProfile',
  description: '',
  galleryImages: [],
  tags: [],
  languagesSpoken: ['fr', 'ar'],
  whatsapp: '',
  isFeatured: false,
  status: 'approved',
  subscriptionTier: 'premium',
  createdAt: '2025-01-01T00:00:00Z',
};

export const MOCK_VENDORS: VendorProfile[] = [
  {
    ...BASE_VENDOR,
    '@id': '/api/vendor_profiles/1',
    id: 1,
    slug: 'riad-al-andalous',
    businessName: 'Riad Al Andalous',
    tagline: 'Votre mariage de rêve dans un cadre authentique',
    category: { '@id': '/api/categories/1', '@type': 'Category', id: 1, name: 'Salle de réception', slug: 'salle', createdAt: '' },
    cities: [{ '@id': '/api/cities/1', '@type': 'City', id: 1, name: 'Marrakech', slug: 'marrakech', createdAt: '' }],
    priceRange: 'MADMADMAD',
    startingPrice: 350,
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    averageRating: '4.9',
    reviewCount: 124,
    isVerified: true,
    isFeatured: true,
    subscriptionTier: 'featured',
  },
  {
    ...BASE_VENDOR,
    '@id': '/api/vendor_profiles/2',
    id: 2,
    slug: 'photo-art-studio',
    businessName: 'Photo Art Studio',
    tagline: "Capturer l'émotion du grand jour",
    category: { '@id': '/api/categories/2', '@type': 'Category', id: 2, name: 'Photo & Vidéo', slug: 'photographe', createdAt: '' },
    cities: [{ '@id': '/api/cities/2', '@type': 'City', id: 2, name: 'Casablanca', slug: 'casablanca', createdAt: '' }],
    priceRange: 'MADMAD',
    startingPrice: 8_000,
    coverImageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
    averageRating: '4.7',
    reviewCount: 89,
    isVerified: true,
  },
  {
    ...BASE_VENDOR,
    '@id': '/api/vendor_profiles/3',
    id: 3,
    slug: 'fleurs-art-de-fes',
    businessName: 'Fleurs Art de Fès',
    tagline: 'Décoration florale traditionnelle & moderne',
    category: { '@id': '/api/categories/3', '@type': 'Category', id: 3, name: 'Décoration', slug: 'decoration', createdAt: '' },
    cities: [{ '@id': '/api/cities/3', '@type': 'City', id: 3, name: 'Fès', slug: 'fes', createdAt: '' }],
    priceRange: 'MADMAD',
    startingPrice: 15_000,
    coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    averageRating: '4.8',
    reviewCount: 67,
    isVerified: true,
  },
  {
    ...BASE_VENDOR,
    '@id': '/api/vendor_profiles/4',
    id: 4,
    slug: 'orchestre-nour',
    businessName: 'Orchestre Nour',
    tagline: 'Musique traditionnelle & moderne pour votre mariage',
    category: { '@id': '/api/categories/4', '@type': 'Category', id: 4, name: 'Musique', slug: 'musique', createdAt: '' },
    cities: [{ '@id': '/api/cities/4', '@type': 'City', id: 4, name: 'Rabat', slug: 'rabat', createdAt: '' }],
    priceRange: 'MADMAD',
    startingPrice: 12_000,
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    averageRating: '4.6',
    reviewCount: 45,
    isVerified: true,
  },
];
