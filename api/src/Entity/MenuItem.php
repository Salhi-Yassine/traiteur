<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\MenuItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_CATERER')"),
        new Patch(security: "is_granted('ROLE_CATERER') and object.getCatererProfile().getOwner() == user"),
        new Delete(security: "is_granted('ROLE_CATERER') and object.getCatererProfile().getOwner() == user"),
    ],
    normalizationContext: ['groups' => ['menu:read']],
    denormalizationContext: ['groups' => ['menu:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['catererProfile' => 'exact', 'category' => 'exact'])]
#[ORM\Entity(repositoryClass: MenuItemRepository::class)]
class MenuItem
{
    public const CATEGORY_STARTER = 'Starter';
    public const CATEGORY_MAIN = 'Main';
    public const CATEGORY_DESSERT = 'Dessert';
    public const CATEGORY_DRINKS = 'Drinks';
    public const CATEGORY_CANAPÉ = 'Canapé';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['menu:read', 'vendor:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private string $name = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private ?string $description = null;

    #[ORM\Column(type: 'decimal', precision: 8, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private ?string $pricePerPerson = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(choices: [self::CATEGORY_STARTER, self::CATEGORY_MAIN, self::CATEGORY_DESSERT, self::CATEGORY_DRINKS, self::CATEGORY_CANAPÉ])]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private string $category = self::CATEGORY_MAIN;

    #[ORM\Column]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private bool $isVegetarian = false;

    #[ORM\Column]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private bool $isVegan = false;

    #[ORM\Column]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private bool $isGlutenFree = false;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['menu:read', 'menu:write', 'vendor:read'])]
    private ?string $imageUrl = null;

    #[ORM\ManyToOne(targetEntity: VendorProfile::class, inversedBy: 'menuItems')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['menu:read', 'menu:write'])]
    private ?VendorProfile $vendorProfile = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['menu:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['menu:read'])]
    private ?\DateTimeImmutable $updatedAt = null;


    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getPricePerPerson(): ?string { return $this->pricePerPerson; }
    public function setPricePerPerson(?string $pricePerPerson): static { $this->pricePerPerson = $pricePerPerson; return $this; }

    public function getCategory(): string { return $this->category; }
    public function setCategory(string $category): static { $this->category = $category; return $this; }

    public function isVegetarian(): bool { return $this->isVegetarian; }
    public function setIsVegetarian(bool $isVegetarian): static { $this->isVegetarian = $isVegetarian; return $this; }

    public function isVegan(): bool { return $this->isVegan; }
    public function setIsVegan(bool $isVegan): static { $this->isVegan = $isVegan; return $this; }

    public function isGlutenFree(): bool { return $this->isGlutenFree; }
    public function setIsGlutenFree(bool $isGlutenFree): static { $this->isGlutenFree = $isGlutenFree; return $this; }

    public function getImageUrl(): ?string { return $this->imageUrl; }
    public function setImageUrl(?string $imageUrl): static { $this->imageUrl = $imageUrl; return $this; }

    public function getVendorProfile(): ?VendorProfile { return $this->vendorProfile; }
    public function setVendorProfile(?VendorProfile $vendorProfile): static { $this->vendorProfile = $vendorProfile; return $this; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }
}

