<?php

namespace App\Factory;

use App\Entity\ChecklistTask;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<ChecklistTask>
 */
final class ChecklistTaskFactory extends PersistentObjectFactory
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
        return ChecklistTask::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'category' => self::faker()->randomElement(['Planning', 'Booking', 'Reviewing']),
            'isDefault' => self::faker()->boolean(),
            'name' => self::faker()->sentence(),
            'status' => self::faker()->randomElement(['pending', 'completed']),
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
            // ->afterInstantiate(function(ChecklistTask $checklistTask): void {})
        ;
    }
}
