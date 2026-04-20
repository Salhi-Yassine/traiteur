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
use App\Repository\TimelineItemRepository;
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
    normalizationContext: ['groups' => ['timeline:read']],
    denormalizationContext: ['groups' => ['timeline:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['weddingProfile' => 'exact'])]
#[ORM\Entity(repositoryClass: TimelineItemRepository::class)]
class TimelineItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['timeline:read', 'wedding:public'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'timelineItems', targetEntity: WeddingProfile::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['timeline:read', 'timeline:write'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\Column(length: 10)]
    #[Assert\NotBlank]
    #[Groups(['timeline:read', 'timeline:write', 'wedding:public'])]
    private string $time = ''; // e.g. "19:00"

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['timeline:read', 'timeline:write', 'wedding:public'])]
    private string $title = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['timeline:read', 'timeline:write', 'wedding:public'])]
    private ?string $description = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['timeline:read', 'timeline:write', 'wedding:public'])]
    private ?string $icon = null; // lucide-react icon name

    #[ORM\Column]
    #[Groups(['timeline:read', 'timeline:write', 'wedding:public'])]
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

    public function getTime(): string
    {
        return $this->time;
    }

    public function setTime(string $time): static
    {
        $this->time = $time;

        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): static
    {
        $this->icon = $icon;

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
