# Mock Data System for Farah.ma

## Overview
This mock data system provides comprehensive test data for the inspiration section, ensuring UI/UX development can proceed independently of backend API availability.

## Features

### 🎨 **Rich Content**
- 5 detailed articles with full content, metadata, and author information
- 5 article categories with descriptions and counts
- 6 inspiration photos with captions and styling information
- 1 complete wedding story with timeline and vendor credits

### 🔧 **Developer Experience**
- **Configurable**: Enable/disable via environment variables
- **Dynamic**: Slight variations for realistic testing
- **Error Simulation**: Test loading, error, and empty states
- **Performance Testing**: Large datasets available

### 🌐 **Image Optimization**
- Responsive images with automatic sizing
- High-quality Unsplash placeholders
- Optimized loading with proper Next.js Image component usage

## Usage

### Basic Usage
```typescript
import { mockArticles, mockArticleCategories, mockInspirationPhotos } from '@/lib/mockInspirationData';

// Use directly in components
const articles = mockArticles;
const categories = mockArticleCategories;
```

### Advanced Usage with Scenarios
```typescript
import { useMockData, MOCK_SCENARIOS } from '@/lib/mockInspirationData';

// Test different states
const emptyData = useMockData('EMPTY');
const loadingData = useMockData('LOADING');
const largeDataset = useMockData('LARGE_DATASET');
```

### URL Parameter Testing
Add `?mockScenario=ERROR` to any inspiration page URL to test error states.

## Configuration

### Environment Variables
```bash
# Enable mock data in production for testing
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# Disable in production
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

### Mock Config
```typescript
export const MOCK_CONFIG = {
  ENABLE_MOCK_DATA: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  MOCK_DELAY: 500, // Simulate API latency
  ENABLE_RANDOM_DATA: true, // Add variations
  FALLBACK_TO_MOCK: true, // Use when API fails
};
```

## Testing Scenarios

### Loading States
```typescript
// Simulate slow API
await mockApiDelay(2000);
const data = useMockData('LOADING');
```

### Error States
```typescript
// Test error boundaries
const data = useMockData('ERROR'); // Throws error
```

### Performance Testing
```typescript
// Test with large datasets
const data = useMockData('LARGE_DATASET'); // 50 articles, 100 photos
```

## Image System

### Dynamic Image URLs
```typescript
import { getInspirationImageUrl } from '@/lib/utils';

// Responsive images
const heroImage = getInspirationImageUrl('moroccan_wedding_centerpiece', 1200, 90);
const thumbnail = getInspirationImageUrl('moroccan_bride_negafa', 400, 80);
```

### Supported Images
- `moroccan_wedding_centerpiece`
- `moroccan_bride_negafa`
- `moroccan_table_setting`
- `moroccan_caftan_detail`
- `riad_sunset_wedding`
- `moroccan_wedding_cake`

## Best Practices

### 1. **Realistic Content**
- Use authentic Moroccan wedding terminology
- Include cultural context and traditions
- Provide detailed, helpful content

### 2. **Performance**
- Images are optimized and cached by Unsplash CDN
- Mock data is lightweight and fast to load
- Use appropriate image sizes for different contexts

### 3. **Testing**
- Test all scenarios: loading, error, empty, success
- Verify responsive behavior with different data sizes
- Test accessibility with screen readers

### 4. **Maintenance**
- Keep mock data in sync with API schema
- Update images periodically for freshness
- Add new scenarios as needed

## Future Enhancements

- [ ] Localization support (French/Arabic content)
- [ ] User-generated content simulation
- [ ] Interactive features (likes, comments)
- [ ] Real-time updates simulation
- [ ] Advanced filtering and search
- [ ] A/B testing data variants