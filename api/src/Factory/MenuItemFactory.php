<?php

namespace App\Factory;

use App\Entity\MenuItem;
use App\Factory\VendorProfileFactory;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<MenuItem>
 */
final class MenuItemFactory extends PersistentObjectFactory
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
        return MenuItem::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'category' => self::faker()->randomElement([MenuItem::CATEGORY_STARTER, MenuItem::CATEGORY_MAIN, MenuItem::CATEGORY_DESSERT]),
            'description' => self::faker()->sentence(),
            'name' => self::faker()->word(),
            'pricePerPerson' => self::faker()->randomFloat(2, 200, 1000),
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
            // ->afterInstantiate(function(MenuItem $menuItem): void {})
        ;
    }
}
