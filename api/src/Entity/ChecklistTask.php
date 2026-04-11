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
use App\Repository\ChecklistTaskRepository;
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
    normalizationContext: ['groups' => ['checklist:read']],
    denormalizationContext: ['groups' => ['checklist:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['weddingProfile' => 'exact', 'status' => 'exact', 'category' => 'exact'])]
#[ORM\Entity(repositoryClass: ChecklistTaskRepository::class)]
class ChecklistTask
{
    public const STATUS_TODO = 'todo';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_DONE = 'done';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['checklist:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'checklistTasks', targetEntity: WeddingProfile::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['checklist:read', 'checklist:write'])]
    private string $name = '';

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['checklist:read', 'checklist:write'])]
    private string $category = '';

    #[ORM\Column(nullable: true)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?int $monthsBefore = null;

    #[ORM\Column(type: 'date', nullable: true)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?\DateTimeInterface $dueDate = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?string $assignedTo = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: [self::STATUS_TODO, self::STATUS_IN_PROGRESS, self::STATUS_DONE])]
    #[Groups(['checklist:read', 'checklist:write'])]
    private string $status = self::STATUS_TODO;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?string $notes = null;

    #[ORM\Column]
    #[Groups(['checklist:read'])]
    private bool $isDefault = true;

    #[ORM\ManyToOne(targetEntity: VendorProfile::class)]
    #[Groups(['checklist:read', 'checklist:write'])]
    private ?VendorProfile $vendor = null;

    #[ORM\Column]
    #[Groups(['checklist:read', 'checklist:write'])]
    private int $displayOrder = 0;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['checklist:read'])]
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

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getMonthsBefore(): ?int
    {
        return $this->monthsBefore;
    }

    public function setMonthsBefore(?int $monthsBefore): static
    {
        $this->monthsBefore = $monthsBefore;

        return $this;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTimeInterface $dueDate): static
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getAssignedTo(): ?string
    {
        return $this->assignedTo;
    }

    public function setAssignedTo(?string $assignedTo): static
    {
        $this->assignedTo = $assignedTo;

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

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function isDefault(): bool
    {
        return $this->isDefault;
    }

    public function setIsDefault(bool $isDefault): static
    {
        $this->isDefault = $isDefault;

        return $this;
    }

    public function getVendor(): ?VendorProfile
    {
        return $this->vendor;
    }

    public function setVendor(?VendorProfile $vendor): static
    {
        $this->vendor = $vendor;

        return $this;
    }

    public function getDisplayOrder(): int
    {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): static
    {
        $this->displayOrder = $displayOrder;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
