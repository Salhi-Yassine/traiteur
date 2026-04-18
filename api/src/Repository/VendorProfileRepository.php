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
     * Returns featured verified vendors with category and cities pre-loaded (no N+1).
     *
     * @return VendorProfile[]
     */
    public function findFeatured(int $limit = 6): array
    {
        return $this->createQueryBuilder('v')
            ->leftJoin('v.category', 'cat')
            ->addSelect('cat')
            ->leftJoin('v.cities', 'city')
            ->addSelect('city')
            ->where('v.isFeatured = :isFeatured')
            ->andWhere('v.isVerified = :isVerified')
            ->setParameter('isFeatured', true)
            ->setParameter('isVerified', true)
            ->orderBy('v.averageRating', 'DESC')
            ->addOrderBy('v.reviewCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->setHint(
                \Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER,
                'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker'
            )
            ->getResult();
    }

    /**
     * Returns approved vendors for a given category slug.
     *
     * @return VendorProfile[]
     */
    public function findByCategory(string $categorySlug): array
    {
        return $this->createQueryBuilder('v')
            ->join('v.category', 'cat')
            ->where('cat.slug = :slug')
            ->andWhere('v.isVerified = :isVerified')
            ->setParameter('slug', $categorySlug)
            ->setParameter('isVerified', true)
            ->orderBy('v.averageRating', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
