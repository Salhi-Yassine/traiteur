<?php

namespace App\Factory;

use App\Entity\VendorProfile;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<VendorProfile>
 */
final class VendorProfileFactory extends PersistentObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return VendorProfile::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'businessName' => self::faker()->company(),
            'category' => CategoryFactory::randomOrCreate(),
            'description' => self::faker()->paragraphs(3, true),
            'tagline' => self::faker()->sentence(),
            'whatsapp' => self::faker()->phoneNumber(),
            'serviceArea' => 'Casablanca, Rabat',
            'isVerified' => true,
            'isFeatured' => self::faker()->boolean(20),
            'subscriptionTier' => self::faker()->randomElement(['free', 'bronze', 'silver', 'gold']),
            'priceRange' => self::faker()->randomElement([VendorProfile::PRICE_BUDGET, VendorProfile::PRICE_PREMIUM, VendorProfile::PRICE_LUXURY]),
            'languagesSpoken' => ['fr', 'ary'],
            'tags' => self::faker()->words(5),
            'owner' => UserFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(VendorProfile $vendorProfile): void {})
        ;
    }
}
