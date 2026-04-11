<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\QuoteRequestRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('quote:view', object)"),
        new Post(security: "is_granted('quote:create')"),
        new Patch(
            security: "is_granted('quote:manage', object)",
            denormalizationContext: ['groups' => ['quote:status']]
        ),
    ],

    normalizationContext: ['groups' => ['quote:read']],
    denormalizationContext: ['groups' => ['quote:write']],
    order: ['createdAt' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: ['vendorProfile' => 'exact', 'client' => 'exact', 'status' => 'exact'])]
#[ORM\Entity(repositoryClass: QuoteRequestRepository::class)]
class QuoteRequest
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_EXPIRED = 'expired';

    public const EVENT_TYPES = ['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Graduation', 'Other'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['quote:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::EVENT_TYPES)]
    #[Groups(['quote:read', 'quote:write'])]
    private string $eventType = 'Other';

    #[ORM\Column(type: 'date')]
    #[Assert\NotNull]
    #[Assert\GreaterThan('today')]
    #[Groups(['quote:read', 'quote:write'])]
    private ?\DateTimeImmutable $eventDate = null;

    #[ORM\Column(type: 'integer')]
    #[Assert\Positive]
    #[Assert\LessThanOrEqual(10000)]
    #[Groups(['quote:read', 'quote:write'])]
    private int $guestCount = 50;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['quote:read', 'quote:write'])]
    private ?string $budget = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 2000)]
    #[Groups(['quote:read', 'quote:write'])]
    private string $message = '';

    #[ORM\Column(length: 20)]
    #[Groups(['quote:read', 'quote:status'])]
    private string $status = self::STATUS_PENDING;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['quote:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['quote:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'quoteRequests')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['quote:read'])]
    private ?User $client = null;

    #[ORM\ManyToOne(inversedBy: 'quoteRequests')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['quote:read', 'quote:write'])]
    private ?VendorProfile $vendorProfile = null;

    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEventType(): string
    {
        return $this->eventType;
    }

    public function setEventType(string $eventType): static
    {
        $this->eventType = $eventType;

        return $this;
    }

    public function getEventDate(): ?\DateTimeImmutable
    {
        return $this->eventDate;
    }

    public function setEventDate(?\DateTimeImmutable $eventDate): static
    {
        $this->eventDate = $eventDate;

        return $this;
    }

    public function getGuestCount(): int
    {
        return $this->guestCount;
    }

    public function setGuestCount(int $guestCount): static
    {
        $this->guestCount = $guestCount;

        return $this;
    }

    public function getBudget(): ?string
    {
        return $this->budget;
    }

    public function setBudget(?string $budget): static
    {
        $this->budget = $budget;

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

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getClient(): ?User
    {
        return $this->client;
    }

    public function setClient(?User $client): static
    {
        $this->client = $client;

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
}
