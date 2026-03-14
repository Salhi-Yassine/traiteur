<?php

namespace App\Security\Voter;

use App\Entity\QuoteRequest;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class QuoteRequestVoter extends Voter
{
    public const VIEW = 'quote:view';
    public const CREATE = 'quote:create';
    public const MANAGE = 'quote:manage';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($attribute === self::CREATE) {
            return true;
        }

        return in_array($attribute, [self::VIEW, self::MANAGE])
            && $subject instanceof QuoteRequest;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if ($attribute === self::CREATE) {
            return $this->canCreate($user);
        }

        /** @var QuoteRequest $quote */
        $quote = $subject;

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($quote, $user);
            case self::MANAGE:
                return $this->canManage($quote, $user);
        }

        return false;
    }

    private function canCreate(User $user): bool
    {
        // Any logged in user can create a quote request for now
        return true;
    }

    private function canView(QuoteRequest $quote, User $user): bool
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        if ($quote->getUser() === $user) {
            return true;
        }

        if ($quote->getVendorProfile()->getOwner() === $user) {
            return true;
        }

        return $this->hasPermission($user, 'view:all_quotes');
    }

    private function canManage(QuoteRequest $quote, User $user): bool
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        // Only the vendor owner can manage the status (accept/decline)
        if ($quote->getVendorProfile()->getOwner() === $user) {
            return true;
        }

        return $this->hasPermission($user, 'manage:all_quotes');
    }

    private function hasPermission(User $user, string $permissionName): bool
    {
        foreach ($user->getUserRoles() as $role) {
            foreach ($role->getPermissions() as $permission) {
                if ($permission->getName() === $permissionName) {
                    return true;
                }
            }
        }
        return false;
    }
}
