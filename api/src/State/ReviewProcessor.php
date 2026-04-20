<?php

namespace App\State;

use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Review;
use App\Entity\User;
use App\Service\ReviewAggregationService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Handles Review POST and DELETE:
 *  - POST: auto-sets the authenticated user as author
 *  - Both: recalculates averageRating + reviewCount on the related VendorProfile
 *
 * @implements ProcessorInterface<Review, Review|null>
 */
class ReviewProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
        private Security $security,
        private ReviewAggregationService $aggregationService,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Review) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        $vendorProfile = $data->getVendorProfile();

        if ($operation instanceof Delete) {
            $result = $this->removeProcessor->process($data, $operation, $uriVariables, $context);
            if (null !== $vendorProfile) {
                $this->aggregationService->recalculate($vendorProfile);
            }

            return $result;
        }

        $user = $this->security->getUser();
        if ($user instanceof User && null === $data->getAuthor()) {
            $data->setAuthor($user);
        }

        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        if (null !== $vendorProfile) {
            $this->aggregationService->recalculate($vendorProfile);
        }

        return $result;
    }
}
