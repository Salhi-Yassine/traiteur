<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class PermissionVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        // We support attributes that start with a specific prefix or look like permissions
        // For simplicity, we'll support any string attribute that isn't a standard Symfony role
        return is_string($attribute) && !str_starts_with($attribute, 'ROLE_');
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        // Admins have all permissions
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        // Check if any of the user's roles have this permission
        foreach ($user->getUserRoles() as $role) {
            foreach ($role->getPermissions() as $permission) {
                if ($permission->getName() === $attribute) {
                    return true;
                }
            }
        }

        return false;
    }
}
