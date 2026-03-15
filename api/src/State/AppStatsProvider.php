<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AppStats;
use App\Entity\VendorProfile;
use App\Entity\Review;
use App\Entity\City;
use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;

class AppStatsProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private \Gedmo\Translatable\TranslatableListener $translatableListener
        )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array |null
    {
        error_log(sprintf(
            '[AppStatsProvider] Listener Hash: %s',
            spl_object_hash($this->translatableListener)
        ));
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

        $stats->availableCities = array_map(fn(City $c) => [
        'name' => $c->getName(),
        'slug' => $c->getSlug(),
        ], $cities);
        $stats->cityCount = count($stats->availableCities);

        // Ratings & Reviews directly from Review entity
        $reviewStats = $reviewRepo->createQueryBuilder('r')
            ->select('COUNT(r.id) as count, AVG(r.rating) as avg')
            ->getQuery()
            ->getOneOrNullResult();

        $stats->reviewCount = (int)($reviewStats['count'] ?? 0);
        $stats->averageRating = round((float)($reviewStats['avg'] ?? 0.0), 1);

        // Categories (only those with verified vendors)
        $categoryRepo = $this->entityManager->getRepository(Category::class);
        $availableCategories = $categoryRepo->createQueryBuilder('cat')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

        $stats->availableCategories = array_map(fn(Category $c) => [
        'name' => $c->getName(),
        'slug' => $c->getSlug(),
        ], $availableCategories);

        // Category counts (for legacy support if needed, or update to use slugs)
        $categories = $vendorRepo->createQueryBuilder('v')
            ->join('v.category', 'cat')
            ->select('cat.slug, COUNT(v.id) as count')
            ->where('v.isVerified = :verified')
            ->setParameter('verified', true)
            ->groupBy('cat.slug')
            ->getQuery()
            ->getResult();

        foreach ($categories as $cat) {
            $stats->categoryCounts[$cat['slug']] = (int)$cat['count'];
        }

        return $stats;
    }
}