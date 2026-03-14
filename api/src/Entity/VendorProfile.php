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
use App\Repository\VendorProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('profile:create')"),
        new Patch(security: "is_granted('profile:edit', object)"),
        new Delete(security: "is_granted('ROLE_ADMIN') or is_granted('profile:edit', object)"),
    ],

    normalizationContext: ['groups' => ['vendor:read']],
    denormalizationContext: ['groups' => ['vendor:write']],
    order: ['averageRating' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: ['serviceArea' => 'ipartial', 'businessName' => 'ipartial', 'category' => 'exact', 'priceRange' => 'exact'])]
#[ORM\Entity(repositoryClass: VendorProfileRepository::class)]
#[UniqueEntity(fields: ['slug'], message: 'This slug is already taken')]
#[Gedmo\TranslationEntity(class: Translation::class)]
class VendorProfile implements Translatable
{
    public const PRICE_BUDGET = 'MAD';
    public const PRICE_MODERATE = 'MADMAD';
    public const PRICE_PREMIUM = 'MADMADMAD';
    public const PRICE_LUXURY = 'MADMADMAD+';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['businessName'])]
    #[Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', message: 'Slug must be lowercase alphanumeric with hyphens')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $slug = null;

    /**
     * Translatable: stored in ext_translations table for ar/ary/en locales.
     * Falls back to this column value (fr) when no translation exists.
     */
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Gedmo\Translatable]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $businessName = '';

    #[ORM\Column(length: 255, nullable: true)]
    #[Gedmo\Translatable]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $tagline = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $category = '';

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Gedmo\Translatable]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $description = '';

    /**
     * Locale hint used by Gedmo at runtime — NOT persisted as a column.
     * Set by LocaleListener via TranslatableListener.
     */
    #[Gedmo\Locale]
    private ?string $locale = null;

    /**
     * @var string[] Multi-select tags (e.g. Traditional, Modern, Fusion)
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private array $tags = [];

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $serviceArea = '';

    #[ORM\Column(length: 10)]
    #[Assert\Choice(choices: [self::PRICE_BUDGET, self::PRICE_MODERATE, self::PRICE_PREMIUM, self::PRICE_LUXURY])]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $priceRange = self::PRICE_MODERATE;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $coverImageUrl = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $whatsapp = '';

    /**
     * @var string[] Gallery image URLs
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private array $galleryImages = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private array $languagesSpoken = ['ary', 'fr'];

    #[ORM\Column(type: 'decimal', precision: 3, scale: 2, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $averageRating = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['vendor:read'])]
    private int $reviewCount = 0;

    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private bool $isVerified = false;

    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private bool $isFeatured = false;

    #[ORM\Column(length: 20)]
    #[Groups(['vendor:read'])]
    private string $subscriptionTier = 'free';

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $minGuests = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $maxGuests = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $website = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $instagram = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['vendor:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['vendor:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, City>
     */
    #[ORM\ManyToMany(targetEntity: City::class, inversedBy: 'vendorProfiles')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private Collection $cities;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'vendorProfile')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vendor:read'])]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'vendorProfile', targetEntity: MenuItem::class, cascade: ['persist', 'remove'])]
    #[Groups(['vendor:read'])]
    private Collection $menuItems;

    #[ORM\OneToMany(mappedBy: 'vendorProfile', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'vendorProfile', targetEntity: QuoteRequest::class)]
    private Collection $quoteRequests;

    public function __construct()
    {
        $this->menuItems = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->quoteRequests = new ArrayCollection();
        $this->cities = new ArrayCollection();
        $this->tags = [];
        $this->galleryImages = [];
        $this->languagesSpoken = ['ary', 'fr'];
    }

    public function getId(): ?int { return $this->id; }

    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(?string $slug): static { $this->slug = $slug; return $this; }

    /** Required by Gedmo Translatable interface */
    public function setTranslatableLocale(string $locale): void { $this->locale = $locale; }
    public function getLocale(): ?string { return $this->locale; }

    public function getBusinessName(): string { return $this->businessName; }
    public function setBusinessName(string $businessName): static { $this->businessName = $businessName; return $this; }

    public function getTagline(): ?string { return $this->tagline; }
    public function setTagline(?string $tagline): static { $this->tagline = $tagline; return $this; }

    public function getCategory(): string { return $this->category; }
    public function setCategory(string $category): static { $this->category = $category; return $this; }

    public function getDescription(): string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }

    public function getTags(): array { return $this->tags; }
    public function setTags(array $tags): static { $this->tags = $tags; return $this; }

    public function getServiceArea(): string { return $this->serviceArea; }
    public function setServiceArea(string $serviceArea): static { $this->serviceArea = $serviceArea; return $this; }

    public function getPriceRange(): string { return $this->priceRange; }
    public function setPriceRange(string $priceRange): static { $this->priceRange = $priceRange; return $this; }

    public function getCoverImageUrl(): ?string { return $this->coverImageUrl; }
    public function setCoverImageUrl(?string $coverImageUrl): static { $this->coverImageUrl = $coverImageUrl; return $this; }

    public function getWhatsapp(): string { return $this->whatsapp; }
    public function setWhatsapp(string $whatsapp): static { $this->whatsapp = $whatsapp; return $this; }

    public function getGalleryImages(): array { return $this->galleryImages; }
    public function setGalleryImages(array $galleryImages): static { $this->galleryImages = $galleryImages; return $this; }

    public function getLanguagesSpoken(): array { return $this->languagesSpoken; }
    public function setLanguagesSpoken(array $languagesSpoken): static { $this->languagesSpoken = $languagesSpoken; return $this; }

    public function getAverageRating(): ?string { return $this->averageRating; }
    public function setAverageRating(?string $averageRating): static { $this->averageRating = $averageRating; return $this; }

    public function getReviewCount(): int { return $this->reviewCount; }
    public function setReviewCount(int $reviewCount): static { $this->reviewCount = $reviewCount; return $this; }

    public function isVerified(): bool { return $this->isVerified; }
    public function setIsVerified(bool $isVerified): static { $this->isVerified = $isVerified; return $this; }

    public function isFeatured(): bool { return $this->isFeatured; }
    public function setIsFeatured(bool $isFeatured): static { $this->isFeatured = $isFeatured; return $this; }

    public function getSubscriptionTier(): string { return $this->subscriptionTier; }
    public function setSubscriptionTier(string $subscriptionTier): static { $this->subscriptionTier = $subscriptionTier; return $this; }

    public function getMinGuests(): ?string { return $this->minGuests; }
    public function setMinGuests(?string $minGuests): static { $this->minGuests = $minGuests; return $this; }

    public function getMaxGuests(): ?string { return $this->maxGuests; }
    public function setMaxGuests(?string $maxGuests): static { $this->maxGuests = $maxGuests; return $this; }

    public function getWebsite(): ?string { return $this->website; }
    public function setWebsite(?string $website): static { $this->website = $website; return $this; }

    public function getInstagram(): ?string { return $this->instagram; }
    public function setInstagram(?string $instagram): static { $this->instagram = $instagram; return $this; }

    public function getOwner(): ?User { return $this->owner; }
    public function setOwner(?User $owner): static { $this->owner = $owner; return $this; }

    /** @return Collection<int, MenuItem> */
    public function getMenuItems(): Collection { return $this->menuItems; }

    /** @return Collection<int, Review> */
    public function getReviews(): Collection { return $this->reviews; }

    /** @return Collection<int, QuoteRequest> */
    public function getQuoteRequests(): Collection { return $this->quoteRequests; }

    /** @return Collection<int, City> */
    public function getCities(): Collection { return $this->cities; }

    public function addCity(City $city): static
    {
        if (!$this->cities->contains($city)) {
            $this->cities->add($city);
        }
        return $this;
    }

    public function removeCity(City $city): static
    {
        $this->cities->removeElement($city);
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }
}
