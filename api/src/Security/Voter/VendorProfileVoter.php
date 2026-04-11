<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\VendorProfile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class VendorProfileVoter extends Voter
{
    public const EDIT = 'profile:edit';
    public const VIEW = 'profile:view';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof VendorProfile;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        /** @var VendorProfile $profile */
        $profile = $subject;

        switch ($attribute) {
            case self::VIEW:
                return true; // Everyone can view profiles for now
            case self::EDIT:
                return $this->canEdit($profile, $user);
        }

        return false;
    }

    private function canEdit(VendorProfile $profile, User $user): bool
    {
        // Admins can edit anything
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        // Owners can edit their own profile
        if ($profile->getOwner() === $user) {
            return true;
        }

        // Check for specific DB permission "manage:all_profiles"
        foreach ($user->getUserRoles() as $role) {
            foreach ($role->getPermissions() as $permission) {
                if ('manage:all_profiles' === $permission->getName()) {
                    return true;
                }
            }
        }

        return false;
    }
}
