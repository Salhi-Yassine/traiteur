<?php

namespace App\Repository;

use App\Entity\CatererProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CatererProfile>
 */
class CatererProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CatererProfile::class);
    }

    /**
     * @return CatererProfile[]
     */
    public function findFeatured(int $limit = 6): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.isVerified = true')
            ->orderBy('c.averageRating', 'DESC')
            ->addOrderBy('c.reviewCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
