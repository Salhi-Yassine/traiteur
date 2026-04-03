<?php

namespace App\Factory;

use App\Entity\VendorProfile;
use App\Factory\UserFactory;
use App\Factory\CityFactory;
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
            'coverImageUrl' => self::faker()->randomElement([
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
                'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
            ]),
            'whatsapp' => self::faker()->phoneNumber(),
            'cities' => CityFactory::randomRange(1, 3),
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
