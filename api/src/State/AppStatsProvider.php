<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AppStats;
use App\Entity\Category;
use App\Entity\City;
use App\Entity\Review;
use App\Entity\VendorProfile;
use Doctrine\ORM\EntityManagerInterface;

class AppStatsProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private \Gedmo\Translatable\TranslatableListener $translatableListener,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $stats = new AppStats();

        $vendorRepo = $this->entityManager->getRepository(VendorProfile::class);
        $reviewRepo = $this->entityManager->getRepository(Review::class);

        // Basic counts
        $stats->vendorCount = $vendorRepo->count(['isVerified' => true]);

        // Cities (only those with verified vendors)
        $cityRepo = $this->entityManager->getRepository(City::class);
        $cities = $cityRepo->createQueryBuilder('c')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

        $stats->availableCities = array_map(fn (City $c) => [
            'name' => $c->getName(),
            'slug' => $c->getSlug(),
        ], $cities);
        $stats->cityCount = count($stats->availableCities);

        // Ratings & Reviews directly from Review entity
        $reviewStats = $reviewRepo->createQueryBuilder('r')
            ->select('COUNT(r.id) as count, AVG(r.rating) as avg')
            ->getQuery()
            ->getOneOrNullResult();

        $stats->reviewCount = (int) ($reviewStats['count'] ?? 0);
        $stats->averageRating = round((float) ($reviewStats['avg'] ?? 0.0), 1);

        // Categories with vendor counts (single query, no N+1)
        $categoryRepo = $this->entityManager->getRepository(Category::class);

        $availableCategoriesRaw = $categoryRepo->createQueryBuilder('cat')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

        $categoryCountsRaw = $categoryRepo->createQueryBuilder('cat')
            ->select('cat.id, COUNT(vp.id) as vendorCount')
            ->leftJoin('cat.vendorProfiles', 'vp')
            ->groupBy('cat.id')
            ->getQuery()
            ->getArrayResult();

        $countsByCatId = [];
        foreach ($categoryCountsRaw as $row) {
            $countsByCatId[$row['id']] = (int) $row['vendorCount'];
        }

        $stats->availableCategories = array_map(function (Category $cat) use ($countsByCatId) {
            return [
                'name' => $cat->getName(),
                'slug' => $cat->getSlug(),
                'emoji' => $cat->getEmoji(),
                'vendorCount' => $countsByCatId[$cat->getId()] ?? 0,
            ];
        }, $availableCategoriesRaw);

        // Featured vendors
        $featuredVendorsRaw = $vendorRepo->createQueryBuilder('v')
            ->leftJoin('v.category', 'cat')
            ->addSelect('cat')
            ->where('v.isFeatured = :isFeatured')
            ->andWhere('v.isVerified = :isVerified')
            ->setParameter('isFeatured', true)
            ->setParameter('isVerified', true)
            ->setMaxResults(6)
            ->orderBy('v.averageRating', 'DESC')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

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
