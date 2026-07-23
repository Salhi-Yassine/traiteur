<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\SavedVendorRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_USER')",
            provider: \App\State\SavedVendorCollectionProvider::class
        ),
        new Get(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new Post(
            security: "is_granted('ROLE_USER')",
            processor: \App\State\SavedVendorProcessor::class
        ),
        new Delete(
            security: "is_granted('ROLE_USER') and object.getUser() == user"
        ),
    ],
    normalizationContext: ['groups' => ['saved_vendor:read', 'vendor:read']],
    denormalizationContext: ['groups' => ['saved_vendor:write']],
)]
#[UniqueEntity(fields: ['user', 'vendorProfile'], message: 'This vendor is already saved.')]
#[ORM\Entity(repositoryClass: SavedVendorRepository::class)]
#[ORM\UniqueConstraint(name: 'uniq_user_vendor', columns: ['user_id', 'vendor_profile_id'])]
class SavedVendor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['saved_vendor:read'])]
    private ?int $id = null;

    /**
     * Owner — always forced to the authenticated user by SavedVendorProcessor.
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: VendorProfile::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['saved_vendor:read', 'saved_vendor:write'])]
    private ?VendorProfile $vendorProfile = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['saved_vendor:read'])]
    private \DateTimeImmutable $createdAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getVendorProfile(): ?VendorProfile
    {
        return $this->vendorProfile;
    }

    public function setVendorProfile(?VendorProfile $vendorProfile): static
    {
        $this->vendorProfile = $vendorProfile;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
