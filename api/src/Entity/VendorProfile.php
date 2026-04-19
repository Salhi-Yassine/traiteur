<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
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
#[ApiFilter(SearchFilter::class, properties: ['cities.slug' => 'exact', 'businessName' => 'ipartial', 'category.slug' => 'exact', 'priceRange' => 'exact', 'isVerified' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['averageRating', 'reviewCount', 'priceRange', 'createdAt'], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(RangeFilter::class, properties: ['averageRating'])]
#[ORM\Entity(repositoryClass: VendorProfileRepository::class)]
#[ORM\Index(columns: ['category_id'],    name: 'idx_vendor_profile_category')]
#[ORM\Index(columns: ['owner_id'],       name: 'idx_vendor_profile_owner')]
#[ORM\Index(columns: ['average_rating'], name: 'idx_vendor_profile_avg_rating')]
#[ORM\Index(columns: ['review_count'],   name: 'idx_vendor_profile_review_count')]
#[ORM\Index(columns: ['created_at'],     name: 'idx_vendor_profile_created')]
#[ORM\Index(columns: ['is_verified'],    name: 'idx_vendor_profile_verified')]
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

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'vendorProfiles')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?Category $category = null;

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

    #[ORM\Column(length: 10)]
    #[Assert\Choice(choices: [self::PRICE_BUDGET, self::PRICE_MODERATE, self::PRICE_PREMIUM, self::PRICE_LUXURY])]
    #[Groups(['vendor:read', 'vendor:write'])]
    private string $priceRange = self::PRICE_MODERATE;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?int $startingPrice = null;

    public function getStartingPrice(): ?int
    {
        return $this->startingPrice;
    }

    public function setStartingPrice(?int $startingPrice): static
    {
        $this->startingPrice = $startingPrice;

        return $this;
    }

    #[ORM\Column(length: 500, nullable: true)]
    #[Assert\Url(message: 'Cover image must be a valid URL')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?string $coverImageUrl = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^\+?[\d\s\-]{7,15}$/', message: 'WhatsApp must be a valid international phone number')]
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

    #[ORM\Column(type: 'smallint', nullable: true)]
    #[Assert\Positive]
    #[Assert\LessThanOrEqual(10000)]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?int $minGuests = null;

    #[ORM\Column(type: 'smallint', nullable: true)]
    #[Assert\Positive]
    #[Assert\LessThanOrEqual(10000)]
    #[Assert\GreaterThanOrEqual(propertyPath: 'minGuests', message: 'Max guests must be ≥ min guests')]
    #[Groups(['vendor:read', 'vendor:write'])]
    private ?int $maxGuests = null;

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

    public function getId(): ?int
    {
        return $this->id;
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

    /** Required by Gedmo Translatable interface */
    public function setTranslatableLocale(string $locale): void
    {
        $this->locale = $locale;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function getBusinessName(): string
    {
        return $this->businessName;
    }

    public function setBusinessName(string $businessName): static
    {
        $this->businessName = $businessName;

        return $this;
    }

    public function getTagline(): ?string
    {
        return $this->tagline;
    }

    public function setTagline(?string $tagline): static
    {
        $this->tagline = $tagline;

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

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function setTags(array $tags): static
    {
        $this->tags = $tags;

        return $this;
    }

    public function getPriceRange(): string
    {
        return $this->priceRange;
    }

    public function setPriceRange(string $priceRange): static
    {
        $this->priceRange = $priceRange;

        return $this;
    }

    public function getCoverImageUrl(): ?string
    {
        return $this->coverImageUrl;
    }

    public function setCoverImageUrl(?string $coverImageUrl): static
    {
        $this->coverImageUrl = $coverImageUrl;

        return $this;
    }

    public function getWhatsapp(): string
    {
        return $this->whatsapp;
    }

    public function setWhatsapp(string $whatsapp): static
    {
        $this->whatsapp = $whatsapp;

        return $this;
    }

    public function getGalleryImages(): array
    {
        return $this->galleryImages;
    }

    public function setGalleryImages(array $galleryImages): static
    {
        $this->galleryImages = $galleryImages;

        return $this;
    }

    public function getLanguagesSpoken(): array
    {
        return $this->languagesSpoken;
    }

    public function setLanguagesSpoken(array $languagesSpoken): static
    {
        $this->languagesSpoken = $languagesSpoken;

        return $this;
    }

    public function getAverageRating(): ?string
    {
        return $this->averageRating;
    }

    /**
     * @internal Only ReviewAggregationService should call this.
     */
    public function setAverageRating(?string $averageRating): static
    {
        $this->averageRating = $averageRating;

        return $this;
    }

    public function getReviewCount(): int
    {
        return $this->reviewCount;
    }

    /**
     * @internal Only ReviewAggregationService should call this.
     */
    public function setReviewCount(int $reviewCount): static
    {
        $this->reviewCount = $reviewCount;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
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

    public function getSubscriptionTier(): string
    {
        return $this->subscriptionTier;
    }

    public function setSubscriptionTier(string $subscriptionTier): static
    {
        $this->subscriptionTier = $subscriptionTier;

        return $this;
    }

    public function getMinGuests(): ?int
    {
        return $this->minGuests;
    }

    public function setMinGuests(?int $minGuests): static
    {
        $this->minGuests = $minGuests;

        return $this;
    }

    public function getMaxGuests(): ?int
    {
        return $this->maxGuests;
    }

    public function setMaxGuests(?int $maxGuests): static
    {
        $this->maxGuests = $maxGuests;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getInstagram(): ?string
    {
        return $this->instagram;
    }

    public function setInstagram(?string $instagram): static
    {
        $this->instagram = $instagram;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    /** @return Collection<int, MenuItem> */
    public function getMenuItems(): Collection
    {
        return $this->menuItems;
    }

    /** @return Collection<int, Review> */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    /** @return Collection<int, QuoteRequest> */
    public function getQuoteRequests(): Collection
    {
        return $this->quoteRequests;
    }

    /** @return Collection<int, City> */
    public function getCities(): Collection
    {
        return $this->cities;
    }

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

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
