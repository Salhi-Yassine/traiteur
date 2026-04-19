<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\WeddingProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_ADMIN') or object.getUser() == user"),
        new Get(
            uriTemplate: '/public/weddings/{slug}',
            uriVariables: [
                'slug' => new Link(fromClass: WeddingProfile::class, identifiers: ['slug'])
            ],
            normalizationContext: ['groups' => ['wedding:public']]
        ),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_ADMIN') or object.getUser() == user"),
    ],
    normalizationContext: ['groups' => ['wedding:read']],
    denormalizationContext: ['groups' => ['wedding:write']],
)]
#[UniqueEntity(fields: ['slug'])]
#[ORM\Entity(repositoryClass: WeddingProfileRepository::class)]
#[ORM\Index(columns: ['user_id'],    name: 'idx_wedding_profile_user')]
#[ORM\Index(columns: ['slug'],       name: 'idx_wedding_profile_slug')]
class WeddingProfile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['wedding:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['brideName', 'groomName'])]
    #[Groups(['wedding:read', 'wedding:public'])]
    private ?string $slug = null;

    #[ORM\OneToOne(inversedBy: 'weddingProfile', targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['wedding:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private string $brideName = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private string $groomName = '';

    #[ORM\Column(type: 'date', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?\DateTimeInterface $weddingDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $weddingCity = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $venueName = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $venueAddress = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $coverImage = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?int $guestCountEst = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?int $totalBudgetMad = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Assert\Url]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $registryUrl = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $accommodationInfo = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $ourStory = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?array $qa = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $travelInfo = null;

    #[ORM\Column(length: 50, options: ['default' => 'modern'])]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private string $selectedTheme = 'modern';

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?string $themeColor = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write', 'wedding:public'])]
    private ?array $galleryImages = null;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: Guest::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $guests;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: BudgetItem::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $budgetItems;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: ChecklistTask::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $checklistTasks;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: TimelineItem::class, cascade: ['persist', 'remove'])]
    #[ORM\OrderBy(['displayOrder' => 'ASC'])]
    #[Groups(['wedding:read', 'wedding:public'])]
    private Collection $timelineItems;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['wedding:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['wedding:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->guests = new ArrayCollection();
        $this->budgetItems = new ArrayCollection();
        $this->checklistTasks = new ArrayCollection();
        $this->timelineItems = new ArrayCollection();
    }

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

    public function getBrideName(): string
    {
        return $this->brideName;
    }

    public function setBrideName(string $brideName): static
    {
        $this->brideName = $brideName;

        return $this;
    }

    public function getGroomName(): string
    {
        return $this->groomName;
    }

    public function setGroomName(string $groomName): static
    {
        $this->groomName = $groomName;

        return $this;
    }

    public function getWeddingDate(): ?\DateTimeInterface
    {
        return $this->weddingDate;
    }

    public function setWeddingDate(?\DateTimeInterface $weddingDate): static
    {
        $this->weddingDate = $weddingDate;

        return $this;
    }

    public function getWeddingCity(): ?string
    {
        return $this->weddingCity;
    }

    public function setWeddingCity(?string $weddingCity): static
    {
        $this->weddingCity = $weddingCity;

        return $this;
    }

    public function getGuestCountEst(): ?int
    {
        return $this->guestCountEst;
    }

    public function setGuestCountEst(?int $guestCountEst): static
    {
        $this->guestCountEst = $guestCountEst;

        return $this;
    }

    public function getTotalBudgetMad(): ?int
    {
        return $this->totalBudgetMad;
    }

    public function setTotalBudgetMad(?int $totalBudgetMad): static
    {
        $this->totalBudgetMad = $totalBudgetMad;

        return $this;
    }

    public function getRegistryUrl(): ?string
    {
        return $this->registryUrl;
    }

    public function setRegistryUrl(?string $registryUrl): static
    {
        $this->registryUrl = $registryUrl;
        return $this;
    }

    public function getAccommodationInfo(): ?string
    {
        return $this->accommodationInfo;
    }

    public function setAccommodationInfo(?string $accommodationInfo): static
    {
        $this->accommodationInfo = $accommodationInfo;
        return $this;
    }

    /** @return Collection<int, Guest> */
    public function getGuests(): Collection
    {
        return $this->guests;
    }

    /** @return Collection<int, BudgetItem> */
    public function getBudgetItems(): Collection
    {
        return $this->budgetItems;
    }

    /** @return Collection<int, ChecklistTask> */
    public function getChecklistTasks(): Collection
    {
        return $this->checklistTasks;
    }

    /** @return Collection<int, TimelineItem> */
    public function getTimelineItems(): Collection
    {
        return $this->timelineItems;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getVenueName(): ?string
    {
        return $this->venueName;
    }

    public function setVenueName(?string $venueName): static
    {
        $this->venueName = $venueName;
        return $this;
    }

    public function getVenueAddress(): ?string
    {
        return $this->venueAddress;
    }

    public function setVenueAddress(?string $venueAddress): static
    {
        $this->venueAddress = $venueAddress;
        return $this;
    }

    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    public function setCoverImage(?string $coverImage): static
    {
        $this->coverImage = $coverImage;
        return $this;
    }

    public function getOurStory(): ?string
    {
        return $this->ourStory;
    }

    public function setOurStory(?string $ourStory): static
    {
        $this->ourStory = $ourStory;
        return $this;
    }

    public function getQa(): ?array
    {
        return $this->qa;
    }

    public function setQa(?array $qa): static
    {
        $this->qa = $qa;
        return $this;
    }

    public function getTravelInfo(): ?string
    {
        return $this->travelInfo;
    }

    public function setTravelInfo(?string $travelInfo): static
    {
        $this->travelInfo = $travelInfo;
        return $this;
    }

    public function getSelectedTheme(): string
    {
        return $this->selectedTheme;
    }

    public function setSelectedTheme(string $selectedTheme): static
    {
        $this->selectedTheme = $selectedTheme;
        return $this;
    }

    public function getThemeColor(): ?string
    {
        return $this->themeColor;
    }

    public function setThemeColor(?string $themeColor): static
    {
        $this->themeColor = $themeColor;
        return $this;
    }

    public function getGalleryImages(): ?array
    {
        return $this->galleryImages;
    }

    public function setGalleryImages(?array $galleryImages): static
    {
        $this->galleryImages = $galleryImages;
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
}
