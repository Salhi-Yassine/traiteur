<?php

namespace App\Repository;

use App\Entity\VendorProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VendorProfile>
 */
class VendorProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VendorProfile::class);
    }

    /**
     * @return VendorProfile[]
     */
    public function findFeatured(int $limit = 6): array
    {
        return $this->createQueryBuilder('v')
            ->where('v.isVerified = true')
            ->andWhere('v.isFeatured = true')
            ->orderBy('v.averageRating', 'DESC')
            ->addOrderBy('v.reviewCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
