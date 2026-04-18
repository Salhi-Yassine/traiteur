<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AppStats;
use App\Entity\City;
use App\Entity\VendorProfile;
use App\Repository\CategoryRepository;
use App\Repository\CityRepository;
use App\Repository\ReviewRepository;
use App\Repository\VendorProfileRepository;

class AppStatsProvider implements ProviderInterface
{
    public function __construct(
        private VendorProfileRepository $vendorProfileRepository,
        private ReviewRepository $reviewRepository,
        private CityRepository $cityRepository,
        private CategoryRepository $categoryRepository,
        private \Gedmo\Translatable\TranslatableListener $translatableListener,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $stats = new AppStats();

        $stats->vendorCount = $this->vendorProfileRepository->count(['isVerified' => true]);

        $cities = $this->cityRepository->createQueryBuilder('c')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

        $stats->availableCities = array_map(fn (City $c) => [
            'name' => $c->getName(),
            'slug' => $c->getSlug(),
        ], $cities);
        $stats->cityCount = count($stats->availableCities);

        $reviewStats = $this->reviewRepository->createQueryBuilder('r')
            ->select('COUNT(r.id) as count, AVG(r.rating) as avg')
            ->getQuery()
            ->getOneOrNullResult();

        $stats->reviewCount = (int) ($reviewStats['count'] ?? 0);
        $stats->averageRating = round((float) ($reviewStats['avg'] ?? 0.0), 1);

        // Single query: categories with translated names + vendor counts
        $stats->availableCategories = $this->categoryRepository->findAllWithVendorCounts();

        $featuredVendorsRaw = $this->vendorProfileRepository->findFeatured();

        $stats->featuredVendors = array_map(function (VendorProfile $v) {
            $cat = $v->getCategory();

            return [
                'id' => $v->getId(),
                'slug' => $v->getSlug(),
                'businessName' => $v->getBusinessName(),
                'tagline' => $v->getTagline(),
                'serviceArea' => implode(', ', $v->getCities()->map(fn (City $c) => $c->getName())->toArray()),
                'cities' => $v->getCities()->map(fn (City $c) => [
                    'name' => $c->getName(),
                    'slug' => $c->getSlug(),
                ])->toArray(),
                'priceRange' => $v->getPriceRange(),
                'startingPrice' => $v->getStartingPrice(),
                'coverImageUrl' => $v->getCoverImageUrl(),
                'averageRating' => null !== $v->getAverageRating() ? (float) $v->getAverageRating() : null,
                'reviewCount' => $v->getReviewCount(),
                'isVerified' => $v->isVerified(),
                'category' => $cat ? [
                    'name' => $cat->getName(),
                    'slug' => $cat->getSlug(),
                ] : null,
            ];
        }, $featuredVendorsRaw);

        return $stats;
    }
}
