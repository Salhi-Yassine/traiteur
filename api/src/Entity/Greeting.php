<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\GreetingRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_ADMIN') or object.getWeddingProfile().getUser() == user"),
        new Post(security: "is_granted('ROLE_USER') or is_granted('PUBLIC_ACCESS')"), // Allow public RSVP submission
        new Patch(security: "is_granted('ROLE_ADMIN') or object.getWeddingProfile().getUser() == user"),
    ],
    normalizationContext: ['groups' => ['greeting:read']],
    denormalizationContext: ['groups' => ['greeting:write']],
)]
#[ORM\Entity(repositoryClass: GreetingRepository::class)]
class Greeting
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['greeting:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'greetings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['greeting:read', 'greeting:write'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['greeting:read', 'greeting:write'])]
    private ?Guest $guest = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Groups(['greeting:read', 'greeting:write'])]
    private string $message = '';

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['greeting:read', 'greeting:write'])]
    private ?string $photoUrl = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['greeting:read', 'greeting:write'])]
    private bool $isAcknowledged = false;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['greeting:read'])]
    private \DateTimeImmutable $createdAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWeddingProfile(): ?WeddingProfile
    {
        return $this->weddingProfile;
    }

    public function setWeddingProfile(?WeddingProfile $weddingProfile): static
    {
        $this->weddingProfile = $weddingProfile;

        return $this;
    }

    public function getGuest(): ?Guest
    {
        return $this->guest;
    }

    public function setGuest(?Guest $guest): static
    {
        $this->guest = $guest;

        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getPhotoUrl(): ?string
    {
        return $this->photoUrl;
    }

    public function setPhotoUrl(?string $photoUrl): static
    {
        $this->photoUrl = $photoUrl;

        return $this;
    }

    public function isAcknowledged(): bool
    {
        return $this->isAcknowledged;
    }

    public function setIsAcknowledged(bool $isAcknowledged): static
    {
        $this->isAcknowledged = $isAcknowledged;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
