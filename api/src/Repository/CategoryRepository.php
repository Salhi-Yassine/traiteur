<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    /**
     * Returns all categories with vendor counts in a single query.
     *
     * @return array<int, array{id: int, name: string, slug: string, emoji: string|null, vendorCount: int}>
     */
    public function findAllWithVendorCounts(): array
    {
        /** @var array<int, array{id: int, name: string, slug: string, emoji: string|null, vendorCount: string}> $rows */
        $rows = $this->createQueryBuilder('cat')
            ->select('cat.id, cat.name, cat.slug, cat.emoji, COUNT(vp.id) as vendorCount')
            ->leftJoin('cat.vendorProfiles', 'vp')
            ->groupBy('cat.id, cat.name, cat.slug, cat.emoji')
            ->getQuery()
            ->setHint(
                \Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER,
                'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker'
            )
            ->getArrayResult();

        return array_map(static fn (array $row): array => [
            'id' => $row['id'],
            'name' => $row['name'],
            'slug' => $row['slug'],
            'emoji' => $row['emoji'],
            'vendorCount' => (int) $row['vendorCount'],
        ], $rows);
    }
}
