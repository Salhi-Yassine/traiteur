<?php

namespace App\Repository;

use App\Entity\Review;
use App\Entity\VendorProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Review>
 */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    /**
     * Returns the average rating and count for a vendor in one query.
     *
     * @return array{avg: float, count: int}
     */
    public function computeStats(VendorProfile $vendorProfile): array
    {
        $result = $this->createQueryBuilder('r')
            ->select('AVG(r.rating) AS avg, COUNT(r.id) AS cnt')
            ->where('r.vendorProfile = :vp')
            ->setParameter('vp', $vendorProfile)
            ->getQuery()
            ->getSingleResult();

        return [
            'avg'   => (float) ($result['avg'] ?? 0),
            'count' => (int) ($result['cnt'] ?? 0),
        ];
    }
}
