<?php

namespace App\Voter;

use App\Entity\QuoteRequest;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Controls access to QuoteRequest resources.
 *
 *  quote:create — any authenticated user (couple or vendor)
 *  quote:view   — the client who sent it OR the vendor who received it OR admin
 *  quote:manage — the vendor who received it (to accept/decline) OR admin
 */
class QuoteRequestVoter extends Voter
{
    public const CREATE = 'quote:create';
    public const VIEW = 'quote:view';
    public const MANAGE = 'quote:manage';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (self::CREATE === $attribute) {
            return true;
        }

        return in_array($attribute, [self::VIEW, self::MANAGE], true)
            && $subject instanceof QuoteRequest;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::CREATE => true, // any authenticated user
            self::VIEW => $this->canView($subject, $user),
            self::MANAGE => $this->canManage($subject, $user),
            default => false,
        };
    }

    private function canView(QuoteRequest $quote, User $user): bool
    {
        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return true;
        }

        // The client who submitted the quote
        if ($quote->getClient()?->getId() === $user->getId()) {
            return true;
        }

        // The vendor who received the quote
        return $quote->getVendorProfile()?->getOwner()?->getId() === $user->getId();
    }

    private function canManage(QuoteRequest $quote, User $user): bool
    {
        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return true;
        }

        return $quote->getVendorProfile()?->getOwner()?->getId() === $user->getId();
    }
}
