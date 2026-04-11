<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Get(security: "is_granted('ROLE_ADMIN') or object == user"),
        new Post(),
        new Patch(security: "is_granted('ROLE_ADMIN') or object == user"),
        new Get(
            name: 'me',
            uriTemplate: '/me',
            provider: \App\State\MeProvider::class,
            read: true,
        ),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const TYPE_COUPLE = 'couple';
    public const TYPE_VENDOR = 'vendor';
    public const TYPE_ADMIN = 'admin';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:write', 'caterer:read', 'review:read', 'quote:read'])]
    private string $firstName = '';

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:write', 'caterer:read', 'review:read', 'quote:read'])]
    private string $lastName = '';

    #[ORM\Column(length: 30, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $phone = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: [self::TYPE_COUPLE, self::TYPE_VENDOR, self::TYPE_ADMIN])]
    #[Groups(['user:read', 'user:write'])]
    private string $userType = self::TYPE_COUPLE;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank(groups: ['Default'])]
    private ?string $plainPassword = null;

    #[ORM\Column(nullable: false)]
    private bool $isVerified = false;

    #[ORM\OneToOne(mappedBy: 'owner', cascade: ['persist', 'remove'])]
    #[Groups(['user:read'])]
    private ?VendorProfile $vendorProfile = null;

    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_roles')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $userRoles;

    #[ORM\OneToOne(mappedBy: 'user', targetEntity: WeddingProfile::class, cascade: ['persist', 'remove'])]
    #[Groups(['user:read'])]
    private ?WeddingProfile $weddingProfile = null;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Review::class)]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: QuoteRequest::class)]
    private Collection $quoteRequests;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    #[Groups(['user:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Gedmo\Timestampable(on: 'update')]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->reviews = new ArrayCollection();
        $this->quoteRequests = new ArrayCollection();
        $this->userRoles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFullName(): string
    {
        return trim($this->firstName.' '.$this->lastName);
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getUserType(): string
    {
        return $this->userType;
    }

    public function setUserType(string $userType): static
    {
        $this->userType = $userType;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        // Add roles from DB
        foreach ($this->userRoles as $role) {
            $roles[] = $role->getName();
        }

        // Guarantees every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        if (self::TYPE_VENDOR === $this->userType) {
            $roles[] = 'ROLE_VENDOR';
        }

        if (self::TYPE_ADMIN === $this->userType) {
            $roles[] = 'ROLE_ADMIN';
        }

        return array_unique($roles);
    }

    /** @return Collection<int, Role> */
    public function getUserRoles(): Collection
    {
        return $this->userRoles;
    }

    public function setUserRoles(Collection|array $userRoles): static
    {
        if ($userRoles instanceof Collection) {
            $this->userRoles = $userRoles;
        } else {
            $this->userRoles = new ArrayCollection($userRoles);
        }

        return $this;
    }

    public function addRoleEntity(Role $role): static
    {
        if (!$this->userRoles->contains($role)) {
            $this->userRoles->add($role);
        }

        return $this;
    }

    public function removeRoleEntity(Role $role): static
    {
        $this->userRoles->removeElement($role);

        return $this;
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): static
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
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

    public function getVendorProfile(): ?VendorProfile
    {
        return $this->vendorProfile;
    }

    public function setVendorProfile(?VendorProfile $vendorProfile): static
    {
        if (null === $vendorProfile && null !== $this->vendorProfile) {
            $this->vendorProfile->setOwner(null);
        }
        if (null !== $vendorProfile && $vendorProfile->getOwner() !== $this) {
            $vendorProfile->setOwner($this);
        }
        $this->vendorProfile = $vendorProfile;

        return $this;
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

    public function getWeddingProfile(): ?WeddingProfile
    {
        return $this->weddingProfile;
    }

    public function setWeddingProfile(?WeddingProfile $weddingProfile): static
    {
        if (null === $weddingProfile && null !== $this->weddingProfile) {
            $this->weddingProfile->setUser(null);
        }
        if (null !== $weddingProfile && $weddingProfile->getUser() !== $this) {
            $weddingProfile->setUser($this);
        }
        $this->weddingProfile = $weddingProfile;

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
