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
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use App\Repository\CatererProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

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

    normalizationContext: ['groups' => ['caterer:read']],
    denormalizationContext: ['groups' => ['caterer:write']],
    order: ['averageRating' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: ['serviceArea' => 'ipartial', 'businessName' => 'ipartial', 'cuisineTypes' => 'partial', 'priceRange' => 'exact'])]
#[ORM\Entity(repositoryClass: CatererProfileRepository::class)]
#[UniqueEntity(fields: ['slug'], message: 'This slug is already taken')]
class CatererProfile
{
    public const PRICE_BUDGET = '$';
    public const PRICE_MODERATE = '$$';
    public const PRICE_PREMIUM = '$$$';
    public const PRICE_LUXURY = '$$$$';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['caterer:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['businessName'])]
    #[Assert\Regex(pattern: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', message: 'Slug must be lowercase alphanumeric with hyphens')]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $slug = null;



    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['caterer:read', 'caterer:write'])]
    private string $businessName = '';

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $tagline = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Groups(['caterer:read', 'caterer:write'])]
    private string $description = '';

    /**
     * @var string[] Cuisine types (e.g. French, Mediterranean, Algerian, Italian)
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['caterer:read', 'caterer:write'])]
    private array $cuisineTypes = [];

    /**
     * @var string[] Service styles (Buffet, Plated, Cocktail, Food Truck, Family Style)
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['caterer:read', 'caterer:write'])]
    private array $serviceStyles = [];

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['caterer:read', 'caterer:write'])]
    private string $serviceArea = '';

    #[ORM\Column(length: 10)]
    #[Assert\Choice(choices: [self::PRICE_BUDGET, self::PRICE_MODERATE, self::PRICE_PREMIUM, self::PRICE_LUXURY])]
    #[Groups(['caterer:read', 'caterer:write'])]
    private string $priceRange = self::PRICE_MODERATE;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $coverImageUrl = null;

    /**
     * @var string[] Gallery image URLs
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['caterer:read', 'caterer:write'])]
    private array $galleryImages = [];

    #[ORM\Column(type: 'decimal', precision: 3, scale: 2, nullable: true)]
    #[Groups(['caterer:read'])]
    private ?string $averageRating = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['caterer:read'])]
    private int $reviewCount = 0;

    #[ORM\Column]
    #[Groups(['caterer:read'])]
    private bool $isVerified = false;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $minGuests = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $maxGuests = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $website = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['caterer:read', 'caterer:write'])]
    private ?string $instagram = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['caterer:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['caterer:read'])]
    private ?\DateTimeImmutable $updatedAt = null;


    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'catererProfile')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['caterer:read'])]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'catererProfile', targetEntity: MenuItem::class, cascade: ['persist', 'remove'])]
    #[Groups(['caterer:read'])]
    private Collection $menuItems;

    #[ORM\OneToMany(mappedBy: 'catererProfile', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'catererProfile', targetEntity: QuoteRequest::class)]
    private Collection $quoteRequests;

    public function __construct()
    {
        $this->menuItems = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->quoteRequests = new ArrayCollection();
    }


    public function getId(): ?int { return $this->id; }

    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(?string $slug): static { $this->slug = $slug; return $this; }


    public function getBusinessName(): string { return $this->businessName; }
    public function setBusinessName(string $businessName): static { $this->businessName = $businessName; return $this; }

    public function getTagline(): ?string { return $this->tagline; }
    public function setTagline(?string $tagline): static { $this->tagline = $tagline; return $this; }

    public function getDescription(): string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }

    public function getCuisineTypes(): array { return $this->cuisineTypes; }
    public function setCuisineTypes(array $cuisineTypes): static { $this->cuisineTypes = $cuisineTypes; return $this; }

    public function getServiceStyles(): array { return $this->serviceStyles; }
    public function setServiceStyles(array $serviceStyles): static { $this->serviceStyles = $serviceStyles; return $this; }

    public function getServiceArea(): string { return $this->serviceArea; }
    public function setServiceArea(string $serviceArea): static { $this->serviceArea = $serviceArea; return $this; }

    public function getPriceRange(): string { return $this->priceRange; }
    public function setPriceRange(string $priceRange): static { $this->priceRange = $priceRange; return $this; }

    public function getCoverImageUrl(): ?string { return $this->coverImageUrl; }
    public function setCoverImageUrl(?string $coverImageUrl): static { $this->coverImageUrl = $coverImageUrl; return $this; }

    public function getGalleryImages(): array { return $this->galleryImages; }
    public function setGalleryImages(array $galleryImages): static { $this->galleryImages = $galleryImages; return $this; }

    public function getAverageRating(): ?string { return $this->averageRating; }
    public function setAverageRating(?string $averageRating): static { $this->averageRating = $averageRating; return $this; }

    public function getReviewCount(): int { return $this->reviewCount; }
    public function setReviewCount(int $reviewCount): static { $this->reviewCount = $reviewCount; return $this; }

    public function isVerified(): bool { return $this->isVerified; }
    public function setIsVerified(bool $isVerified): static { $this->isVerified = $isVerified; return $this; }

    public function getMinGuests(): ?string { return $this->minGuests; }
    public function setMinGuests(?string $minGuests): static { $this->minGuests = $minGuests; return $this; }

    public function getMaxGuests(): ?string { return $this->maxGuests; }
    public function setMaxGuests(?string $maxGuests): static { $this->maxGuests = $maxGuests; return $this; }

    public function getWebsite(): ?string { return $this->website; }
    public function setWebsite(?string $website): static { $this->website = $website; return $this; }

    public function getInstagram(): ?string { return $this->instagram; }
    public function setInstagram(?string $instagram): static { $this->instagram = $instagram; return $this; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }


    public function getOwner(): ?User { return $this->owner; }
    public function setOwner(?User $owner): static { $this->owner = $owner; return $this; }

    /** @return Collection<int, MenuItem> */
    public function getMenuItems(): Collection { return $this->menuItems; }

    /** @return Collection<int, Review> */
    public function getReviews(): Collection { return $this->reviews; }

    /** @return Collection<int, QuoteRequest> */
    public function getQuoteRequests(): Collection { return $this->quoteRequests; }

    public function updateRatingStats(): void
    {
        $publishedReviews = $this->reviews->filter(fn(Review $r) => $r->getId() !== null);
        $count = $publishedReviews->count();
        if ($count === 0) {
            $this->averageRating = null;
            $this->reviewCount = 0;
            return;
        }
        $sum = array_sum($publishedReviews->map(fn(Review $r) => $r->getRating())->toArray());
        $this->averageRating = number_format($sum / $count, 2);
        $this->reviewCount = $count;
    }
}
