import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchArticles, searchPhotos, SearchFilters, MockArticle, MockInspirationPhoto } from '@/lib/mockInspirationData';

export interface UseInspirationSearchOptions {
  initialQuery?: string;
  initialFilters?: Partial<SearchFilters>;
  debounceMs?: number;
  enableUrlSync?: boolean;
}

export interface UseInspirationSearchReturn {
  // Articles
  articles: MockArticle[];
  filteredArticles: MockArticle[];
  totalArticles: number;

  // Photos
  photos: MockInspirationPhoto[];
  filteredPhotos: MockInspirationPhoto[];
  totalPhotos: number;

  // Search state
  query: string;
  filters: SearchFilters;
  isSearching: boolean;
  hasResults: boolean;

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  resetSearch: () => void;

  // Pagination
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
}

export const useInspirationSearch = (options: UseInspirationSearchOptions = {}): UseInspirationSearchReturn => {
  const {
    initialQuery = '',
    initialFilters = {},
    debounceMs = 300,
    enableUrlSync = true,
  } = options;

  const router = useRouter();

  // State
  const [query, setQueryState] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFiltersState] = useState<SearchFilters>({
    sortBy: 'newest',
    limit: 12,
    offset: 0,
    ...initialFilters,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // URL synchronization
  useEffect(() => {
    if (!enableUrlSync) return;

    const urlParams = new URLSearchParams();

    if (debouncedQuery) urlParams.set('q', debouncedQuery);
    if (filters.category) urlParams.set('category', filters.category);
    if (filters.style) urlParams.set('style', filters.style);
    if (filters.city) urlParams.set('city', filters.city);
    if (filters.sortBy && filters.sortBy !== 'newest') urlParams.set('sort', filters.sortBy);
    if (currentPage > 1) urlParams.set('page', currentPage.toString());

    const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : '';

    if (router.asPath !== router.pathname + newUrl) {
      router.replace(router.pathname + newUrl, undefined, { shallow: true });
    }
  }, [debouncedQuery, filters, currentPage, enableUrlSync, router]);

  // Load from URL on mount
  useEffect(() => {
    if (!enableUrlSync) return;

    const urlParams = new URLSearchParams(window.location.search);

    const urlQuery = urlParams.get('q') || '';
    const urlCategory = urlParams.get('category') || undefined;
    const urlStyle = urlParams.get('style') || undefined;
    const urlCity = urlParams.get('city') || undefined;
    const urlSort = (urlParams.get('sort') as SearchFilters['sortBy']) || 'newest';
    const urlPage = parseInt(urlParams.get('page') || '1', 10);

    setQueryState(urlQuery);
    setDebouncedQuery(urlQuery);
    setFiltersState(prev => ({
      ...prev,
      query: urlQuery,
      category: urlCategory,
      style: urlStyle,
      city: urlCity,
      sortBy: urlSort,
    }));
    setCurrentPage(urlPage);
  }, [enableUrlSync]);

  // Search results
  const searchResults = useMemo(() => {
    setIsSearching(true);

    const searchFilters: SearchFilters = {
      ...filters,
      query: debouncedQuery,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };

    const articles = searchArticles(searchFilters);
    const photos = searchPhotos(searchFilters);

    setTimeout(() => setIsSearching(false), 100); // Simulate async search

    return { articles, photos };
  }, [debouncedQuery, filters, currentPage, itemsPerPage]);

  // All items (for totals)
  const allArticles = useMemo(() => searchArticles({ ...filters, query: debouncedQuery }), [filters, debouncedQuery]);
  const allPhotos = useMemo(() => searchPhotos({ ...filters, query: debouncedQuery }), [filters, debouncedQuery]);

  // Pagination
  const totalArticles = allArticles.length;
  const totalPhotos = allPhotos.length;
  const totalPages = Math.ceil(Math.max(totalArticles, totalPhotos) / itemsPerPage);

  // Actions
  const setQuery = (newQuery: string) => {
    setQueryState(newQuery);
    setCurrentPage(1); // Reset to first page on new search
  };

  const setFilters = (newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFiltersState({
      sortBy: 'newest',
      limit: itemsPerPage,
      offset: 0,
    });
    setQueryState('');
    setDebouncedQuery('');
    setCurrentPage(1);
  };

  const resetSearch = () => {
    clearFilters();
  };

  const setPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    // Articles
    articles: allArticles,
    filteredArticles: searchResults.articles,
    totalArticles,

    // Photos
    photos: allPhotos,
    filteredPhotos: searchResults.photos,
    totalPhotos,

    // Search state
    query,
    filters,
    isSearching,
    hasResults: searchResults.articles.length > 0 || searchResults.photos.length > 0,

    // Actions
    setQuery,
    setFilters,
    clearFilters,
    resetSearch,

    // Pagination
    currentPage,
    totalPages,
    setPage,
    itemsPerPage,
    setItemsPerPage,
  };
};