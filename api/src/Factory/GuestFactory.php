<?php

namespace App\Factory;

use App\Entity\Guest;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Guest>
 */
final class GuestFactory extends PersistentObjectFactory
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
        return Guest::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'fullName' => self::faker()->name(),
            'rsvpStatus' => self::faker()->randomElement([Guest::RSVP_PENDING, Guest::RSVP_CONFIRMED, Guest::RSVP_DECLINED]),
            'side' => self::faker()->randomElement(['bride', 'groom']),
            'weddingProfile' => WeddingProfileFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Guest $guest): void {})
        ;
    }
}
