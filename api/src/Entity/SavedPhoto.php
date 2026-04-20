<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new Post(
            security: "is_granted('ROLE_USER')",
            processor: \App\State\SavedPhotoProcessor::class
        ),
        new Delete(
            security: "is_granted('ROLE_USER') and object.getUser() == user"
        ),
    ],
    normalizationContext: ['groups' => ['saved_photo:read']],
    denormalizationContext: ['groups' => ['saved_photo:write']],
)]
#[ORM\Entity]
#[ORM\UniqueConstraint(name: 'uniq_user_photo', columns: ['user_id', 'photo_id'])]
class SavedPhoto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['saved_photo:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['saved_photo:read', 'saved_photo:write'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: InspirationPhoto::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['saved_photo:read', 'saved_photo:write'])]
    private ?InspirationPhoto $photo = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['saved_photo:read'])]
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

    public function getPhoto(): ?InspirationPhoto
    {
        return $this->photo;
    }

    public function setPhoto(?InspirationPhoto $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
