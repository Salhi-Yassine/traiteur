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
use App\Repository\BudgetItemRepository;
use Doctrine\ORM\Mapping as ORM;
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
    normalizationContext: ['groups' => ['budget:read']],
    denormalizationContext: ['groups' => ['budget:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['weddingProfile' => 'exact'])]
#[ORM\Entity(repositoryClass: BudgetItemRepository::class)]
class BudgetItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'budgetItems', targetEntity: WeddingProfile::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['budget:read', 'budget:write'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['budget:read', 'budget:write'])]
    private string $category = '';

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    #[Groups(['budget:read', 'budget:write'])]
    private int $budgetedAmount = 0;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    #[Groups(['budget:read', 'budget:write'])]
    private int $spentAmount = 0;

    #[ORM\Column]
    #[Groups(['budget:read', 'budget:write'])]
    private int $displayOrder = 0;

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

    public function getCategory(): string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getBudgetedAmount(): int
    {
        return $this->budgetedAmount;
    }

    public function setBudgetedAmount(int $budgetedAmount): static
    {
        $this->budgetedAmount = $budgetedAmount;

        return $this;
    }

    public function getSpentAmount(): int
    {
        return $this->spentAmount;
    }

    public function setSpentAmount(int $spentAmount): static
    {
        $this->spentAmount = $spentAmount;

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
}
