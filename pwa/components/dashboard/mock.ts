import type { VendorProfile } from '@/types/api';
import type { WeddingDashboardProfile, GreetingSummary, ConsensusData } from './types';

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().split('T')[0];
}

export const MOCK_PROFILE: WeddingDashboardProfile = {
  id: 0,
  brideName: 'Yasmine',
  groomName: 'Yassine',
  weddingDate: daysFromNow(87),
  totalBudgetMad: 120_000,
  stylePersona: 'Élégant',
  quizResults: null,
  budgetItems: [{ spentAmount: 42_000 }, { spentAmount: 18_500 }],
  guests: Array.from({ length: 48 }),
  checklistTasks: [
    { id: 1, name: 'Réserver la salle de réception', status: 'done', dueDate: '2026-03-01' },
    { id: 2, name: 'Choisir le traiteur', status: 'done', dueDate: '2026-03-15' },
    { id: 3, name: 'Envoyer les faire-parts', status: 'in_progress', dueDate: '2026-05-01' },
    { id: 4, name: 'Confirmer le photographe', status: 'todo', dueDate: '2026-05-10' },
    { id: 5, name: 'Essayage de la robe', status: 'todo', dueDate: '2026-06-01' },
    { id: 6, name: 'Choisir le DJ', status: 'todo', dueDate: '2026-06-15' },
    { id: 7, name: 'Organiser le transport', status: 'todo', dueDate: '2026-07-01' },
  ],
};

export const MOCK_GREETINGS: GreetingSummary[] = [
  {
    id: 1,
    author: 'Fatima Zahra',
    message: 'Toutes nos félicitations ! Que votre union soit bénie et pleine de bonheur. 🤍',
    isAcknowledged: false,
    timeAgo: '2h',
  },
  {
    id: 2,
    author: 'Hassan & Khadija',
    message: 'Vous allez former un couple magnifique. On est tellement heureux pour vous !',
    isAcknowledged: true,
    timeAgo: '1j',
  },
  {
    id: 3,
    author: 'Sofia M.',
    message: 'Bonne chance pour la préparation ! On sera là pour vous soutenir le grand jour.',
    isAcknowledged: false,
    timeAgo: '3j',
  },
  {
    id: 4,
    author: 'Leila B.',
    message: 'Vous méritez le plus beau des mariages. Je suis si heureuse pour vous deux !',
    isAcknowledged: false,
    timeAgo: '5j',
  },
];

export const MOCK_CONSENSUS: ConsensusData = {
  score: 87,
  sharedStyles: ['Moderne', 'Élégant', 'Naturel', 'Minimaliste'],
};

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
