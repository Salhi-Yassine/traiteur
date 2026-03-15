<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\AppStatsProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/app_stats',
            provider: AppStatsProvider::class,
            normalizationContext: ['groups' => ['stats:read']]
        )
    ]
)]
class AppStats
{
    #[Groups(['stats:read'])]
    public int $vendorCount = 0;

    #[Groups(['stats:read'])]
    public int $cityCount = 0;

    #[Groups(['stats:read'])]
    public float $averageRating = 0.0;

    #[Groups(['stats:read'])]
    public int $reviewCount = 0;

    /**
     * @var array<string, int>
     */
    #[Groups(['stats:read'])]
    public array $categoryCounts = [];

    /**
     * @var array<int, array{name: string, slug: string}>
     */
    #[Groups(['stats:read'])]
    public array $availableCities = [];
}
