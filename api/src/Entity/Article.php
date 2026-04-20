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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    normalizationContext: ['groups' => ['article:read']],
    denormalizationContext: ['groups' => ['article:write']],
    order: ['publishedAt' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: ['category.slug' => 'exact', 'title' => 'ipartial', 'isPublished' => 'exact', 'isFeatured' => 'exact', 'tags' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['publishedAt', 'title'])]
#[ORM\Entity]
#[Gedmo\TranslationEntity(class: Translation::class)]
class Article implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Gedmo\Translatable]
    #[Groups(['article:read', 'article:write'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['title'])]
    #[Groups(['article:read'])]
    private ?string $slug = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Gedmo\Translatable]
    #[Groups(['article:read', 'article:write'])]
    private ?string $content = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Gedmo\Translatable]
    #[Groups(['article:read', 'article:write'])]
    private ?string $excerpt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $featuredImage = null;

    #[ORM\ManyToOne(targetEntity: ArticleCategory::class, inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read', 'article:write'])]
    private ?ArticleCategory $category = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?User $author = null;

    #[ORM\Column]
    #[Groups(['article:read', 'article:write'])]
    private bool $isPublished = false;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['article:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    #[Groups(['article:read', 'article:write'])]
    private bool $isFeatured = false;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?int $featuredOrder = null;

    /**
     * @var string[]
     */
    #[ORM\Column(type: 'json')]
    #[Groups(['article:read', 'article:write'])]
    private array $tags = [];

    /** hamlou | budget | null */
    #[ORM\Column(length: 32, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $widgetType = null;

    /**
     * @var Collection<int, VendorProfile>
     */
    #[ORM\ManyToMany(targetEntity: VendorProfile::class)]
    #[ORM\JoinTable(name: 'article_vendor_profile')]
    #[Groups(['article:read', 'article:write'])]
    private Collection $relatedVendors;

    #[Gedmo\Locale]
    private ?string $locale = null;

    public function __construct()
    {
        $this->relatedVendors = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getExcerpt(): ?string
    {
        return $this->excerpt;
    }

    public function setExcerpt(?string $excerpt): static
    {
        $this->excerpt = $excerpt;

        return $this;
    }

    public function getFeaturedImage(): ?string
    {
        return $this->featuredImage;
    }

    public function setFeaturedImage(?string $featuredImage): static
    {
        $this->featuredImage = $featuredImage;

        return $this;
    }

    public function getCategory(): ?ArticleCategory
    {
        return $this->category;
    }

    public function setCategory(?ArticleCategory $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function isPublished(): bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
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

    public function getFeaturedOrder(): ?int
    {
        return $this->featuredOrder;
    }

    public function setFeaturedOrder(?int $featuredOrder): static
    {
        $this->featuredOrder = $featuredOrder;

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

    public function getWidgetType(): ?string
    {
        return $this->widgetType;
    }

    public function setWidgetType(?string $widgetType): static
    {
        $this->widgetType = $widgetType;

        return $this;
    }

    #[Groups(['article:read'])]
    public function getReadingTimeMinutes(): int
    {
        $words = str_word_count(strip_tags($this->content ?? ''));

        return max(1, (int) ceil($words / 200));
    }

    /**
     * @return Collection<int, VendorProfile>
     */
    public function getRelatedVendors(): Collection
    {
        return $this->relatedVendors;
    }

    public function addRelatedVendor(VendorProfile $vendor): static
    {
        if (!$this->relatedVendors->contains($vendor)) {
            $this->relatedVendors->add($vendor);
        }

        return $this;
    }

    public function removeRelatedVendor(VendorProfile $vendor): static
    {
        $this->relatedVendors->removeElement($vendor);

        return $this;
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
