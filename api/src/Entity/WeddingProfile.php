<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\WeddingProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_ADMIN') or object.getUser() == user"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_ADMIN') or object.getUser() == user"),
    ],
    normalizationContext: ['groups' => ['wedding:read']],
    denormalizationContext: ['groups' => ['wedding:write']],
)]
#[ORM\Entity(repositoryClass: WeddingProfileRepository::class)]
class WeddingProfile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['wedding:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'weddingProfile', targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['wedding:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['wedding:read', 'wedding:write'])]
    private string $brideName = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['wedding:read', 'wedding:write'])]
    private string $groomName = '';

    #[ORM\Column(type: 'date', nullable: true)]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?\DateTimeInterface $weddingDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?string $weddingCity = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?int $guestCountEst = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['wedding:read', 'wedding:write'])]
    private ?int $totalBudgetMad = null;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: Guest::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $guests;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: BudgetItem::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $budgetItems;

    #[ORM\OneToMany(mappedBy: 'weddingProfile', targetEntity: ChecklistTask::class, cascade: ['persist', 'remove'])]
    #[Groups(['wedding:read'])]
    private Collection $checklistTasks;

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

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
