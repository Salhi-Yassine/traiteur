/**
 * TypeScript interfaces for Farah.ma API responses.
 *
 * These types mirror the Doctrine entities exposed via API Platform.
 * All collection endpoints return Hydra JSON-LD format.
 * Single-resource endpoints return the entity directly.
 *
 * Usage:
 *   import type { VendorProfile, HydraCollection } from '@/types/api';
 *   const { data } = useQuery<HydraCollection<VendorProfile>>(...);
 */

// ─── Hydra JSON-LD Wrappers ───

/** Hydra collection wrapper returned by all GET collection endpoints */
export interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection';
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    '@type': 'hydra:PartialCollectionView';
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
  };
}

/** Base fields present on every JSON-LD resource */
export interface HydraResource {
  '@id': string;
  '@type': string;
  id: number;
}

// ─── Entities ───

export interface Category extends HydraResource {
  '@type': 'Category';
  name: string;
  slug: string;
  emoji?: string;
  vendorCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface City extends HydraResource {
  '@type': 'City';
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorProfile extends HydraResource {
  '@type': 'VendorProfile';
  businessName: string;
  slug: string;
  tagline?: string;
  description?: string;
  category?: Category;
  city?: City;
  citiesServed?: City[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  averageRating?: string; // Doctrine decimal → string
  reviewCount?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  coverPhotoUrl?: string;
  galleryPhotos?: string[];
  amenities?: string[];
  status: 'pending' | 'approved' | 'rejected';
  subscriptionTier?: 'free' | 'premium' | 'featured';
  owner?: string; // IRI reference to User
  reviews?: Review[];
  menuItems?: MenuItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Review extends HydraResource {
  '@type': 'Review';
  rating: number; // 1-5
  comment?: string;
  authorName?: string;
  vendorProfile?: string; // IRI reference
  createdAt: string;
  updatedAt?: string;
}

export interface MenuItem extends HydraResource {
  '@type': 'MenuItem';
  name: string;
  description?: string;
  pricePerPerson?: number;
  vendorProfile?: string; // IRI reference
  createdAt: string;
}

export interface User extends HydraResource {
  '@type': 'User';
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  userType: 'couple' | 'vendor' | 'admin';
  createdAt: string;
}

export interface WeddingProfile extends HydraResource {
  '@type': 'WeddingProfile';
  weddingDate?: string;
  totalBudget?: number;
  owner?: string; // IRI reference to User
  budgetItems?: BudgetItem[];
  guests?: Guest[];
  checklistTasks?: ChecklistTask[];
  createdAt: string;
  updatedAt?: string;
}

export interface BudgetItem extends HydraResource {
  '@type': 'BudgetItem';
  category: string;
  budgetedAmount: number;
  paidAmount: number;
  weddingProfile?: string; // IRI reference
  createdAt: string;
  updatedAt?: string;
}

export interface Guest extends HydraResource {
  '@type': 'Guest';
  fullName: string;
  email?: string;
  phone?: string;
  side: 'bride' | 'groom' | 'both';
  relationship?: string;
  city?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  mealPreference?: 'standard' | 'vegetarian' | 'children';
  tableNumber?: number;
  weddingProfile?: string; // IRI reference
  createdAt: string;
  updatedAt?: string;
}

export interface ChecklistTask extends HydraResource {
  '@type': 'ChecklistTask';
  name: string;
  category?: string;
  dueDate?: string;
  status: 'todo' | 'in_progress' | 'done';
  isDefault: boolean;
  assignee?: string;
  notes?: string;
  sortOrder?: number;
  weddingProfile?: string; // IRI reference
  createdAt: string;
  updatedAt?: string;
}

export interface QuoteRequest extends HydraResource {
  '@type': 'QuoteRequest';
  name: string;
  email: string;
  phone?: string;
  weddingDate?: string;
  guestCount?: number;
  budgetMad?: number;
  message: string;
  status: 'new' | 'read' | 'replied';
  vendorProfile?: string; // IRI reference
  createdAt: string;
  updatedAt?: string;
}

export interface AppStats extends HydraResource {
  '@type': 'AppStats';
  totalVendors: number;
  totalCities: number;
  verifiedVendors: number;
  averageRating: string;
  categories?: Array<{
    name: string;
    slug: string;
    emoji?: string;
    vendorCount: number;
  }>;
}

// ─── Auth ───

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token?: string;
}

export interface RegisterPayload {
  email: string;
  plainPassword: string;
  firstName: string;
  lastName: string;
  userType: 'couple' | 'vendor';
}
