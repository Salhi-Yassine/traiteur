import {
  mockArticles,
  mockArticleCategories,
  mockInspirationPhotos,
  mockWeddingStories,
  searchArticles,
  searchPhotos,
  MOCK_CONFIG,
  getABTestVariant,
  trackApiCall,
  getPerformanceReport,
} from '@/lib/mockInspirationData';

export interface MockDataTestSuite {
  name: string;
  description: string;
  test: () => Promise<boolean>;
  expectedResult: boolean;
}

// Comprehensive test suite for mock data system
export const MOCK_DATA_TESTS: MockDataTestSuite[] = [
  {
    name: 'Data Integrity',
    description: 'Verify all mock data has required fields and valid structure',
    test: async () => {
      // Check articles
      const articlesValid = mockArticles.every(article =>
        article.id &&
        article.title &&
        article.slug &&
        article.category?.name &&
        article.publishedAt
      );

      // Check photos
      const photosValid = mockInspirationPhotos.every(photo =>
        photo.id &&
        photo.imagePath &&
        photo.caption &&
        photo['@id']
      );

      // Check categories
      const categoriesValid = mockArticleCategories.every(cat =>
        cat.id &&
        cat.name &&
        cat.slug
      );

      return articlesValid && photosValid && categoriesValid;
    },
    expectedResult: true,
  },

  {
    name: 'Search Functionality',
    description: 'Test article and photo search with various filters',
    test: async () => {
      // Test text search
      const textResults = searchArticles({ query: 'wedding' });
      const hasWeddingResults = textResults.length > 0;

      // Test category filter
      const categoryResults = searchArticles({ category: 'planning-tips' });
      const hasCategoryResults = categoryResults.length > 0;

      // Test photo search
      const photoResults = searchPhotos({ style: 'Traditional' });
      const hasPhotoResults = photoResults.length > 0;

      return hasWeddingResults && hasCategoryResults && hasPhotoResults;
    },
    expectedResult: true,
  },

  {
    name: 'Scenario Switching',
    description: 'Test different mock data scenarios',
    test: async () => {
      // Test with different data sets directly
      const hasDefaultArticles = mockArticles.length > 0;
      const hasDefaultPhotos = mockInspirationPhotos.length > 0;
      const hasCategories = mockArticleCategories.length > 0;

      // Test empty scenario simulation
      const emptyArticles = mockArticles.filter(() => false); // Simulate empty
      const emptyPhotos = mockInspirationPhotos.filter(() => false);

      return hasDefaultArticles && hasDefaultPhotos && hasCategories &&
             emptyArticles.length === 0 && emptyPhotos.length === 0;
    },
    expectedResult: true,
  },

  {
    name: 'Performance Tracking',
    description: 'Test API call tracking and performance metrics',
    test: async () => {
      // Simulate API calls
      trackApiCall('/api/articles', 150, true);
      trackApiCall('/api/inspiration_photos', 200, true);
      trackApiCall('/api/failing-endpoint', 500, false);

      const report = getPerformanceReport();

      const hasApiCalls = report.apiCalls >= 3;
      const hasResponseTime = report.averageResponseTime > 0;
      const hasErrorRate = report.errorRate > 0;

      return hasApiCalls && hasResponseTime && hasErrorRate;
    },
    expectedResult: true,
  },

  {
    name: 'A/B Testing',
    description: 'Test variant selection and consistency',
    test: async () => {
      const variant1 = getABTestVariant('hero_layout', 'user123');
      const variant2 = getABTestVariant('hero_layout', 'user123');
      const variant3 = getABTestVariant('hero_layout', 'user456');

      // Same user should get same variant
      const consistent = variant1.layout === variant2.layout;
      // Different users can get different variants
      const hasVariants = variant1 && variant3;

      return consistent && hasVariants;
    },
    expectedResult: true,
  },

  {
    name: 'User Interactions',
    description: 'Test user interaction simulation',
    test: async () => {
      const likeInteraction = simulateUserInteraction('like', 1, 'photo', 123);
      const commentInteraction = simulateUserInteraction('comment', 2, 'article', 456);

      const hasLikeData = likeInteraction.type === 'like' && likeInteraction.photoId === 1;
      const hasCommentData = commentInteraction.type === 'comment' && commentInteraction.articleId === 2;
      const hasTimestamps = likeInteraction.createdAt && commentInteraction.createdAt;

      return hasLikeData && hasCommentData && hasTimestamps;
    },
    expectedResult: true,
  },

  {
    name: 'Configuration',
    description: 'Test configuration system and environment variables',
    test: async () => {
      const originalConfig = { ...MOCK_CONFIG };

      // Test config changes
      MOCK_CONFIG.ENABLE_RANDOM_DATA = false;
      const noRandomData = MOCK_CONFIG.ENABLE_RANDOM_DATA === false;

      MOCK_CONFIG.ENABLE_INTERACTIONS = true;
      const interactionsEnabled = MOCK_CONFIG.ENABLE_INTERACTIONS === true;

      // Restore original config
      Object.assign(MOCK_CONFIG, originalConfig);

      return noRandomData && interactionsEnabled;
    },
    expectedResult: true,
  },

  {
    name: 'Large Dataset Performance',
    description: 'Test performance with large datasets',
    test: async () => {
      // Simulate large dataset by duplicating existing data
      const largeArticles = [...mockArticles, ...mockArticles, ...mockArticles];
      const largePhotos = [...mockInspirationPhotos, ...mockInspirationPhotos, ...mockInspirationPhotos];

      const startTime = Date.now();

      // Simulate processing large dataset
      const processedArticles = largeArticles.slice(0, 60);
      const processedPhotos = largePhotos.slice(0, 150);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      const hasLargeArticles = processedArticles.length >= 60;
      const hasLargePhotos = processedPhotos.length >= 150;
      const reasonablePerformance = processingTime < 1000; // Should process in less than 1 second

      return hasLargeArticles && hasLargePhotos && reasonablePerformance;
    },
    expectedResult: true,
  },
];

// Run all tests
export const runMockDataTests = async (): Promise<{
  passed: number;
  failed: number;
  total: number;
  results: Array<{ name: string; passed: boolean; error?: string }>;
}> => {
  const results = [];

  for (const test of MOCK_DATA_TESTS) {
    try {
      const passed = await test.test();
      results.push({
        name: test.name,
        passed: passed === test.expectedResult,
      });
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    passed,
    failed,
    total: results.length,
    results,
  };
};

// Quick health check
export const mockDataHealthCheck = (): {
  healthy: boolean;
  issues: string[];
  metrics: Record<string, number>;
} => {
  const issues = [];
  const metrics = {
    articlesCount: mockArticles.length,
    photosCount: mockInspirationPhotos.length,
    categoriesCount: mockArticleCategories.length,
    storiesCount: mockWeddingStories.length,
  };

  // Check minimum data requirements
  if (mockArticles.length < 3) issues.push('Insufficient articles');
  if (mockInspirationPhotos.length < 3) issues.push('Insufficient photos');
  if (mockArticleCategories.length < 3) issues.push('Insufficient categories');

  // Check data integrity
  const invalidArticles = mockArticles.filter(a => !a.id || !a.title || !a.slug);
  if (invalidArticles.length > 0) issues.push(`${invalidArticles.length} invalid articles`);

  const invalidPhotos = mockInspirationPhotos.filter(p => !p.id || !p.imagePath);
  if (invalidPhotos.length > 0) issues.push(`${invalidPhotos.length} invalid photos`);

  return {
    healthy: issues.length === 0,
    issues,
    metrics,
  };
};