<?php

namespace App\Factory;

use App\Entity\BudgetItem;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<BudgetItem>
 */
final class BudgetItemFactory extends PersistentObjectFactory
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
        return BudgetItem::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'budgetedAmount' => self::faker()->numberBetween(1000, 50000),
            'category' => self::faker()->randomElement(['Venue', 'Catering', 'Photography', 'Music', 'Decoration']),
            'spentAmount' => self::faker()->numberBetween(0, 50000),
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
            // ->afterInstantiate(function(BudgetItem $budgetItem): void {})
        ;
    }
}
