<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\SavedVendor;
use App\Repository\SavedVendorRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<SavedVendor>
 */
class SavedVendorCollectionProvider implements ProviderInterface
{
    public function __construct(
        private SavedVendorRepository $repository,
        private Security $security,
    ) {
    }

    /**
     * Returns only the authenticated user's saved vendors, newest first.
     *
     * @return SavedVendor[]
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        return $this->repository->findBy(
            ['user' => $this->security->getUser()],
            ['createdAt' => 'DESC'],
        );
    }
}
