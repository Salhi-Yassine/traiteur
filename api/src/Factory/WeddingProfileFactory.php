<?php

namespace App\Factory;

use App\Entity\WeddingProfile;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<WeddingProfile>
 */
final class WeddingProfileFactory extends PersistentObjectFactory
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
        return WeddingProfile::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'brideName' => self::faker()->firstNameFemale(),
            'groomName' => self::faker()->firstNameMale(),
            'weddingDate' => self::faker()->dateTimeBetween('+1 month', '+1 year'),
            'weddingCity' => self::faker()->randomElement(['Casablanca', 'Rabat', 'Marrakech', 'Tanger']),
            'guestCountEst' => self::faker()->numberBetween(50, 500),
            'totalBudgetMad' => self::faker()->numberBetween(50000, 500000),
            'user' => UserFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(WeddingProfile $weddingProfile): void {})
        ;
    }
}
