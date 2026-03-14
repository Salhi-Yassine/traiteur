<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\AppStats;
use App\Entity\VendorProfile;
use App\Entity\Review;
use App\Entity\City;
use Doctrine\ORM\EntityManagerInterface;

class AppStatsProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
        )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array |null
    {
        $stats = new AppStats();

        $vendorRepo = $this->entityManager->getRepository(VendorProfile::class);
        $reviewRepo = $this->entityManager->getRepository(Review::class);

        // Basic counts
        $stats->vendorCount = $vendorRepo->count(['isVerified' => true]);

        // Cities (only those with verified vendors)
        $cityRepo = $this->entityManager->getRepository(City::class);
        $cities = $cityRepo->createQueryBuilder('c')
            ->select('DISTINCT c.name')
            ->getQuery()
            ->getScalarResult();

        $stats->availableCities = array_column($cities, 'name');
        $stats->cityCount = count($stats->availableCities);

        // Ratings & Reviews from VendorProfiles
        $reviewStats = $vendorRepo->createQueryBuilder('v')
            ->select('SUM(v.reviewCount) as count, AVG(v.averageRating) as avg')
            ->where('v.isVerified = :verified')
            ->setParameter('verified', true)
            ->getQuery()
            ->getOneOrNullResult();

        $stats->reviewCount = (int)($reviewStats['count'] ?? 0);
        $stats->averageRating = round((float)($reviewStats['avg'] ?? 0.0), 1);

        // Category counts
        $categories = $vendorRepo->createQueryBuilder('v')
            ->select('v.category, COUNT(v.id) as count')
            ->where('v.isVerified = :verified')
            ->setParameter('verified', true)
            ->groupBy('v.category')
            ->getQuery()
            ->getResult();

        foreach ($categories as $cat) {
            $stats->categoryCounts[$cat['category']] = (int)$cat['count'];
        }

        return $stats;
    }
}