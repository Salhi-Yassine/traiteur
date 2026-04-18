<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Review;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Auto-sets the authenticated user as the review author on POST.
 * Prevents author spoofing via the denormalization context.
 *
 * @implements ProcessorInterface<Review, Review>
 */
class ReviewProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private Security $security,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Review
    {
        if ($data instanceof Review) {
            $user = $this->security->getUser();
            if ($user instanceof User && null === $data->getAuthor()) {
                $data->setAuthor($user);
            }
        }

        /** @var Review */
        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
