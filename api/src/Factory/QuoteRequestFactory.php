<?php

namespace App\Factory;

use App\Entity\QuoteRequest;
use App\Factory\UserFactory;
use App\Factory\VendorProfileFactory;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<QuoteRequest>
 */
final class QuoteRequestFactory extends PersistentObjectFactory
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
        return QuoteRequest::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'client' => UserFactory::new(),
            'eventDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeBetween('+1 month', '+1 year')),
            'eventType' => self::faker()->randomElement(['Wedding', 'Engagement', 'Private Party']),
            'guestCount' => self::faker()->numberBetween(50, 1000),
            'message' => self::faker()->paragraph(),
            'status' => self::faker()->randomElement(['pending', 'sent', 'rejected', 'accepted']),
            'vendorProfile' => VendorProfileFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(QuoteRequest $quoteRequest): void {})
        ;
    }
}
