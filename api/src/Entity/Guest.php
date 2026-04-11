<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\GuestRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_ADMIN') or object.getWeddingProfile().getUser() == user"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_ADMIN') or object.getWeddingProfile().getUser() == user"),
        new Delete(security: "is_granted('ROLE_ADMIN') or object.getWeddingProfile().getUser() == user"),
    ],
    normalizationContext: ['groups' => ['guest:read']],
    denormalizationContext: ['groups' => ['guest:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['weddingProfile' => 'exact', 'rsvpStatus' => 'exact'])]
#[ORM\Entity(repositoryClass: GuestRepository::class)]
class Guest
{
    public const RSVP_PENDING = 'pending';
    public const RSVP_CONFIRMED = 'confirmed';
    public const RSVP_DECLINED = 'declined';

    public const MEAL_STANDARD = 'standard';
    public const MEAL_VEGETARIAN = 'vegetarian';
    public const MEAL_CHILDREN = 'children';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['guest:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'guests', targetEntity: WeddingProfile::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['guest:read', 'guest:write'])]
    private string $fullName = '';

    #[ORM\Column(length: 30, nullable: true)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $phone = null;

    #[ORM\Column(length: 180, nullable: true)]
    #[Assert\Email]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 10)]
    #[Assert\Choice(choices: ['bride', 'groom', 'both'])]
    #[Groups(['guest:read', 'guest:write'])]
    private string $side = 'both';

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $relationship = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $city = null;

    #[ORM\Column(length: 15)]
    #[Assert\Choice(choices: [self::RSVP_PENDING, self::RSVP_CONFIRMED, self::RSVP_DECLINED])]
    #[Groups(['guest:read', 'guest:write'])]
    private string $rsvpStatus = self::RSVP_PENDING;

    #[ORM\Column(length: 20, nullable: true)]
    #[Assert\Choice(choices: [self::MEAL_STANDARD, self::MEAL_VEGETARIAN, self::MEAL_CHILDREN])]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $mealPreference = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?int $tableNumber = null;

    #[ORM\Column]
    #[Groups(['guest:read', 'guest:write'])]
    private bool $invitationSent = false;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['guest:read', 'guest:write'])]
    private ?string $notes = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['guest:read'])]
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

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): static
    {
        $this->fullName = $fullName;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getSide(): string
    {
        return $this->side;
    }

    public function setSide(string $side): static
    {
        $this->side = $side;

        return $this;
    }

    public function getRelationship(): ?string
    {
        return $this->relationship;
    }

    public function setRelationship(?string $relationship): static
    {
        $this->relationship = $relationship;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getRsvpStatus(): string
    {
        return $this->rsvpStatus;
    }

    public function setRsvpStatus(string $rsvpStatus): static
    {
        $this->rsvpStatus = $rsvpStatus;

        return $this;
    }

    public function getMealPreference(): ?string
    {
        return $this->mealPreference;
    }

    public function setMealPreference(?string $mealPreference): static
    {
        $this->mealPreference = $mealPreference;

        return $this;
    }

    public function getTableNumber(): ?int
    {
        return $this->tableNumber;
    }

    public function setTableNumber(?int $tableNumber): static
    {
        $this->tableNumber = $tableNumber;

        return $this;
    }

    public function isInvitationSent(): bool
    {
        return $this->invitationSent;
    }

    public function setInvitationSent(bool $invitationSent): static
    {
        $this->invitationSent = $invitationSent;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
