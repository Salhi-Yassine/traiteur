<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\SavedVendor;
use App\Entity\User;
use App\Repository\SavedVendorRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class SavedVendorProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private Security $security,
        private SavedVendorRepository $repository,
    ) {
    }

    /**
     * Forces the owner of a new SavedVendor to the authenticated user
     * and rejects duplicates before the DB unique constraint turns them into a 500.
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof SavedVendor && $this->security->getUser() instanceof User) {
            $user = $this->security->getUser();
            $data->setUser($user);

            $existing = $this->repository->findOneBy([
                'user' => $user,
                'vendorProfile' => $data->getVendorProfile(),
            ]);
            if (null !== $existing) {
                throw new UnprocessableEntityHttpException('This vendor is already saved.');
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
