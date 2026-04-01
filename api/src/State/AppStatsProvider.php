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

        // Categories with vendor counts (single query, no N+1)
        $categoryRepo = $this->entityManager->getRepository(Category::class);
        $availableCategories = $categoryRepo->createQueryBuilder('cat')
            ->leftJoin('cat.vendorProfiles', 'vp')
            ->addSelect('COUNT(vp.id) as vendorCount')
            ->groupBy('cat.id')
            ->getQuery()
            ->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER, 'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->getResult();

        $stats->availableCategories = array_map(fn(array $row) => [
            'name' => $row[0]->getName(),
            'slug' => $row[0]->getSlug(),
            'emoji' => $row[0]->getEmoji(),
            'vendorCount' => (int)$row['vendorCount'],
        ], $availableCategories);

        return $stats;
    }
}