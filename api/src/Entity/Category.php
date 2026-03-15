<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
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
    normalizationContext: ['groups' => ['category:read']],
    denormalizationContext: ['groups' => ['category:write']],
)]
#[ORM\Entity]
#[Gedmo\TranslationEntity(class: Translation::class)]
class Category implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['category:read', 'vendor:read', 'stats:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Gedmo\Translatable]
    #[Groups(['category:read', 'category:write', 'vendor:read', 'stats:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['name'])]
    #[Groups(['category:read', 'vendor:read', 'stats:read'])]
    private ?string $slug = null;

    /**
     * Locale hint used by Gedmo at runtime
     */
    #[Gedmo\Locale]
    private ?string $locale = null;

    /**
     * @var Collection<int, VendorProfile>
     */
    #[ORM\OneToMany(mappedBy: 'category', targetEntity: VendorProfile::class)]
    private Collection $vendorProfiles;

    public function __construct()
    {
        $this->vendorProfiles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name ?? '';
    }

    public function setName(string $name): static
    {
        $this->name = $name;
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

    public function setTranslatableLocale(string $locale): void
    {
        $this->locale = $locale;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    /**
     * @return Collection<int, VendorProfile>
     */
    public function getVendorProfiles(): Collection
    {
        return $this->vendorProfiles;
    }

    public function addVendorProfile(VendorProfile $vendorProfile): static
    {
        if (!$this->vendorProfiles->contains($vendorProfile)) {
            $this->vendorProfiles->add($vendorProfile);
            $vendorProfile->setCategory($this);
        }

        return $this;
    }

    public function removeVendorProfile(VendorProfile $vendorProfile): static
    {
        if ($this->vendorProfiles->removeElement($vendorProfile)) {
            // set the owning side to null (unless already changed)
            if ($vendorProfile->getCategory() === $this) {
                $vendorProfile->setCategory(null);
            }
        }

        return $this;
    }
}
