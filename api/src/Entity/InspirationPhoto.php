<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['inspiration:read']],
    denormalizationContext: ['groups' => ['inspiration:write']],
    order: ['createdAt' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'category.slug' => 'exact',
    'city.slug' => 'exact',
    'style' => 'exact',
    'isApproved' => 'exact',
])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt'])]
#[ORM\Entity]
#[Gedmo\TranslationEntity(class: Translation::class)]
class InspirationPhoto implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['inspiration:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?string $imagePath = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Gedmo\Translatable]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?string $caption = null;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?Category $category = null;

    #[ORM\ManyToOne(targetEntity: City::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?City $city = null;

    /**
     * @var string traditional, Modern, Bohème, Andalou, etc
     */
    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?string $style = null;

    #[ORM\ManyToOne(targetEntity: VendorProfile::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private ?VendorProfile $vendor = null;

    #[ORM\Column]
    #[Groups(['inspiration:read', 'inspiration:write'])]
    private bool $isApproved = true;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['inspiration:read'])]
    private \DateTimeImmutable $createdAt;

    #[Gedmo\Locale]
    private ?string $locale = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImagePath(): ?string
    {
        return $this->imagePath;
    }

    public function setImagePath(string $imagePath): static
    {
        $this->imagePath = $imagePath;

        return $this;
    }

    public function getCaption(): ?string
    {
        return $this->caption;
    }

    public function setCaption(?string $caption): static
    {
        $this->caption = $caption;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getCity(): ?City
    {
        return $this->city;
    }

    public function setCity(?City $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getStyle(): ?string
    {
        return $this->style;
    }

    public function setStyle(?string $style): static
    {
        $this->style = $style;

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

    public function isApproved(): bool
    {
        return $this->isApproved;
    }

    public function setIsApproved(bool $isApproved): static
    {
        $this->isApproved = $isApproved;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setTranslatableLocale(string $locale): void
    {
        $this->locale = $locale;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }
}
