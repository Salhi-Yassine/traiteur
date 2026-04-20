<?php

namespace App\Voter;

use App\Entity\User;
use App\Entity\VendorProfile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Controls access to VendorProfile resources.
 *
 *  profile:create — authenticated vendor-type user who has no profile yet
 *  profile:edit   — the profile owner or an admin
 *  profile:view   — public (always granted)
 */
class VendorProfileVoter extends Voter
{
    public const CREATE = 'profile:create';
    public const EDIT = 'profile:edit';
    public const VIEW = 'profile:view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        if (self::CREATE === $attribute) {
            return true;
        }

        return in_array($attribute, [self::EDIT, self::VIEW], true)
            && $subject instanceof VendorProfile;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        return match ($attribute) {
            self::CREATE => $this->canCreate($user),
            self::EDIT => $this->canEdit($subject, $user),
            self::VIEW => true,
            default => false,
        };
    }

    private function canCreate(mixed $user): bool
    {
        return $user instanceof User
            && User::TYPE_VENDOR === $user->getUserType();
    }

    private function canEdit(VendorProfile $profile, mixed $user): bool
    {
        if (!$user instanceof User) {
            return false;
        }

        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return true;
        }

        return $profile->getOwner()?->getId() === $user->getId();
    }
}
