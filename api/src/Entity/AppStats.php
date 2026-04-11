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
        ),
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
     * @var array<int, array{name: string, slug: string}>
     */
    #[Groups(['stats:read'])]
    public array $availableCities = [];

    /**
     * @var array<int, array{name: string, slug: string, emoji: string|null, vendorCount: int}>
     */
    #[Groups(['stats:read'])]
    public array $availableCategories = [];

    /**
     * @var array<int, array{
     *     id: int,
     *     slug: string,
     *     businessName: string,
     *     tagline: string|null,
     *     serviceArea: string,
     *     cities: array<int, array{name: string, slug: string}>,
     *     priceRange: string,
     *     coverImageUrl: string|null,
     *     averageRating: float|null,
     *     reviewCount: int,
     *     isVerified: bool,
     *     category: array{name: string, slug: string}|null
     * }>
     */
    #[Groups(['stats:read'])]
    public array $featuredVendors = [];
}
