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
    normalizationContext: ['groups' => ['wedding_story:read']],
    denormalizationContext: ['groups' => ['wedding_story:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['location' => 'ipartial', 'vibe' => 'ipartial'])]
#[ORM\Entity]
#[Gedmo\TranslationEntity(class: Translation::class)]
class WeddingStory implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['wedding_story:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $coupleNames = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['coupleNames'])]
    #[Groups(['wedding_story:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    #[Gedmo\Translatable]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $location = null;

    #[ORM\Column(length: 255)]
    #[Gedmo\Translatable]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $vibe = null;

    #[ORM\Column(length: 255)]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $coverImage = null;

    #[ORM\Column(type: 'text')]
    #[Gedmo\Translatable]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $description = null;

    /**
     * @var string[] List of image URLs
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private array $gallery = [];

    /**
     * @var array[] List of {role: string, name: string, slug?: string}
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private array $vendorCredits = [];

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['wedding_story:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private bool $isFeatured = false;

    #[ORM\Column(length: 100, nullable: true)]
    #[Gedmo\Translatable]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $style = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Gedmo\Translatable]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?string $season = null;

    /**
     * @var string[] List of hex colors
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private array $colorPalette = [];

    /**
     * @var array[] List of {time: string, event: string, description: string}
     */
    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['wedding_story:read', 'wedding_story:write'])]
    private ?array $celebrationTimeline = [];

    #[Gedmo\Locale]
    private ?string $locale = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCoupleNames(): ?string
    {
        return $this->coupleNames;
    }

    public function setCoupleNames(string $coupleNames): static
    {
        $this->coupleNames = $coupleNames;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getVibe(): ?string
    {
        return $this->vibe;
    }

    public function setVibe(string $vibe): static
    {
        $this->vibe = $vibe;

        return $this;
    }

    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    public function setCoverImage(string $coverImage): static
    {
        $this->coverImage = $coverImage;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getGallery(): array
    {
        return $this->gallery;
    }

    public function setGallery(array $gallery): static
    {
        $this->gallery = $gallery;

        return $this;
    }

    public function getVendorCredits(): array
    {
        return $this->vendorCredits;
    }

    public function setVendorCredits(array $vendorCredits): static
    {
        $this->vendorCredits = $vendorCredits;

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

    public function isFeatured(): bool
    {
        return $this->isFeatured;
    }

    public function setIsFeatured(bool $isFeatured): static
    {
        $this->isFeatured = $isFeatured;

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

    public function getSeason(): ?string
    {
        return $this->season;
    }

    public function setSeason(?string $season): static
    {
        $this->season = $season;

        return $this;
    }

    public function getColorPalette(): array
    {
        return $this->colorPalette;
    }

    public function setColorPalette(array $colorPalette): static
    {
        $this->colorPalette = $colorPalette;

        return $this;
    }

    public function getCelebrationTimeline(): ?array
    {
        return $this->celebrationTimeline;
    }

    public function setCelebrationTimeline(?array $celebrationTimeline): static
    {
        $this->celebrationTimeline = $celebrationTimeline;

        return $this;
    }
}
