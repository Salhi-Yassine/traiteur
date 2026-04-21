<?php

namespace App\Voter;

use App\Entity\User;
use App\Entity\WeddingProfile;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class WeddingProfileVoter extends Voter
{
    public const VIEW = 'WEDDING_VIEW';
    public const EDIT = 'WEDDING_EDIT';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT])
            && $subject instanceof WeddingProfile;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        /** @var WeddingProfile $weddingProfile */
        $weddingProfile = $subject;

        return match ($attribute) {
            self::VIEW => $this->canView($weddingProfile, $user),
            self::EDIT => $this->canEdit($weddingProfile, $user),
            default => false,
        };
    }

    private function canView(WeddingProfile $wp, User $user): bool
    {
        // Admin always can view
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        // Owner can view
        if ($wp->getUser() === $user) {
            return true;
        }

        // Partner can view
        if ($wp->getPartner() === $user) {
            return true;
        }

        // Elder can view
        if ($wp->getElders()->contains($user)) {
            return true;
        }

        return false;
    }

    private function canEdit(WeddingProfile $wp, User $user): bool
    {
        // Admin always can edit
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        // Owner can edit
        if ($wp->getUser() === $user) {
            return true;
        }

        // Partner can edit (full collaboration)
        if ($wp->getPartner() === $user) {
            return true;
        }

        // Elders CANNOT edit (read-only per PRD)
        return false;
    }
}
