<?php

namespace App\DataFixtures;

use App\Entity\VendorProfile;
use App\Entity\MenuItem;
use App\Entity\QuoteRequest;
use App\Entity\Review;
use App\Entity\User;
use App\Entity\Role;
use App\Entity\Permission;
use App\Entity\WeddingProfile;
use App\Entity\Guest;
use App\Entity\BudgetItem;
use App\Entity\ChecklistTask;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private array $permissions = [];
    private array $roles = [];

    public function __construct(private readonly UserPasswordHasherInterface $hasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $this->createPermissions($manager);
        $this->createRoles($manager);

        // --- Users ---

        $coupleUser = new User();
        $coupleUser->setEmail('couple@farah.ma')
            ->setFirstName('Yasmine')
            ->setLastName('Benali')
            ->setUserType(User::TYPE_COUPLE)
            ->addRoleEntity($this->roles['ROLE_COUPLE'])
            ->setPassword($this->hasher->hashPassword($coupleUser, 'password'));
        $manager->persist($coupleUser);

        // --- Wedding Profile ---
        $wedding = new WeddingProfile();
        $wedding->setUser($coupleUser)
            ->setBrideName('Yasmine')
            ->setGroomName('Amine')
            ->setWeddingDate(new \DateTime('+6 months'))
            ->setWeddingCity('Casablanca')
            ->setGuestCountEst(150)
            ->setTotalBudgetMad(250000);
        $manager->persist($wedding);

        // --- Guests ---
        $guest1 = new Guest();
        $guest1->setWeddingProfile($wedding)->setFullName('Mehdi Alami')->setSide('groom')->setRelationship('Friend')->setRsvpStatus(Guest::RSVP_CONFIRMED);
        $manager->persist($guest1);

        $guest2 = new Guest();
        $guest2->setWeddingProfile($wedding)->setFullName('Salma Bennani')->setSide('bride')->setRelationship('Sister')->setRsvpStatus(Guest::RSVP_PENDING);
        $manager->persist($guest2);

        // --- Budget Items ---
        $budget1 = new BudgetItem();
        $budget1->setWeddingProfile($wedding)->setCategory('Venue & Catering')->setBudgetedAmount(150000)->setSpentAmount(50000);
        $manager->persist($budget1);

        $vendorUser1 = new User();
        $vendorUser1->setEmail('traiteur.royal@farah.ma')
            ->setFirstName('Karim')
            ->setLastName('Meziane')
            ->setUserType(User::TYPE_VENDOR)
            ->addRoleEntity($this->roles['ROLE_VENDOR'])
            ->setPassword($this->hasher->hashPassword($vendorUser1, 'password'));
        $manager->persist($vendorUser1);

        $vendorUser2 = new User();
        $vendorUser2->setEmail('negrafa.majesty@farah.ma')
            ->setFirstName('Sophia')
            ->setLastName('Rahmani')
            ->setUserType(User::TYPE_VENDOR)
            ->addRoleEntity($this->roles['ROLE_VENDOR'])
            ->setPassword($this->hasher->hashPassword($vendorUser2, 'password'));
        $manager->persist($vendorUser2);

        $admin = new User();
        $admin->setEmail('admin@farah.ma')
            ->setFirstName('Admin')
            ->setLastName('Farah')
            ->setUserType(User::TYPE_ADMIN)
            ->addRoleEntity($this->roles['ROLE_ADMIN'])
            ->setPassword($this->hasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        // --- Cities ---
        $cities = [
            'Casablanca', 'Rabat', 'Fès', 'Tanger', 'Marrakech', 'Salé', 'Meknès', 'Agadir',
            'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Temara', 'Inezgane', 'Mohammédia',
            'Laâyoune', 'Khouribga', 'Béni Mellal', 'Nador', 'Taza', 'Aït Melloul',
            'Settat', 'Barrechid', 'Khemisset', 'Guelmim', 'El Jadida', 'Errachidia',
            'Ouarzazate', 'Tiznit', 'Essaouira', 'Ifrane', 'Azrou', 'Midelt', 'Larache',
            'Ksar El Kebir', 'Berrechid', 'Benslimane', 'Sidi Slimane', 'Sidi Kacem',
            'Skhirat', 'Oued Zem', 'Smara', 'Tan-Tan', 'Tarfaya', 'Boujdour', 'Dakhla'
        ];

        foreach ($cities as $cityName) {
            \App\Factory\CityFactory::new(['name' => $cityName])->create();
        }

        $cityRepo = $manager->getRepository(\App\Entity\City::class);
        $casablanca = $cityRepo->findOneBy(['name' => 'Casablanca']);
        $rabat = $cityRepo->findOneBy(['name' => 'Rabat']);
        $marrakech = $cityRepo->findOneBy(['name' => 'Marrakech']);

        // --- Vendor Profiles ---
        $profile1 = new VendorProfile();
        $profile1->setBusinessName('Festin Royal')
            ->setCategory('Catering')
            ->setTagline('Cuisine marocaine authentique pour vos événements mémorables')
            ->setDescription('Festin Royal est un service traiteur haut de gamme basé à Casablanca, spécialisé dans la cuisine marocaine traditionnelle revisitée. Avec plus de 15 ans d\'expérience, nous proposons des menus sur mesure pour mariages, réceptions d\'entreprise et célébrations privées.')
            ->setTags(['Traditional', 'Modern', 'Luxury', 'Fish', 'Meat'])
            ->setLanguagesSpoken(['ary', 'fr', 'en'])
            ->setWhatsapp('+212600000001')
            ->setServiceArea('Casablanca, Rabat, Marrakech') // Keep for compat
            ->setPriceRange(VendorProfile::PRICE_PREMIUM)
            ->setCoverImageUrl('https://images.unsplash.com/photo-1555244162-803834f70033?w=800')
            ->setGalleryImages([
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
            ])
            ->setMinGuests('50')
            ->setMaxGuests('1000')
            ->setIsVerified(true)
            ->setIsFeatured(true)
            ->setSubscriptionTier('gold')
            ->setOwner($vendorUser1);
        
        if ($casablanca) $profile1->addCity($casablanca);
        if ($rabat) $profile1->addCity($rabat);
        if ($marrakech) $profile1->addCity($marrakech);

        $manager->persist($profile1);

        $profile2 = new VendorProfile();
        $profile2->setBusinessName('Negrafa Majesty')
            ->setCategory('Negrafa')
            ->setTagline('L\'élégance de la mariée marocaine')
            ->setDescription('Plongez dans l\'univers du mariage marocain avec Negrafa Majesty. Nous proposons une collection exclusive de caftans et de bijoux traditionnels pour sublimer la mariée lors du plus beau jour de sa vie.')
            ->setTags(['Traditional', 'Elegance', 'Premium'])
            ->setLanguagesSpoken(['ary', 'fr'])
            ->setWhatsapp('+212600000002')
            ->setServiceArea('Rabat') // Keep for compat
            ->setPriceRange(VendorProfile::PRICE_LUXURY)
            ->setCoverImageUrl('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800')
            ->setGalleryImages([
                'https://images.unsplash.com/photo-1594613303673-9799298e3768?w=800',
            ])
            ->setIsVerified(true)
            ->setOwner($vendorUser2);
        
        if ($rabat) $profile2->addCity($rabat);

        $manager->persist($profile2);

        // --- Menu Items ---
        $item1 = new MenuItem();
        $item1->setName('Pastilla au Pigeon')->setDescription('Le grand classique de la gastronomie fassie')->setPricePerPerson('450')
            ->setCategory(MenuItem::CATEGORY_MAIN)->setVendorProfile($profile1);
        $manager->persist($item1);

        $item2 = new MenuItem();
        $item2->setName('Tajine d\'Agneau Mrouzia')->setDescription('Agneau mijoté miel et amandes')->setPricePerPerson('500')
            ->setCategory(MenuItem::CATEGORY_MAIN)->setVendorProfile($profile1);
        $manager->persist($item2);

        // --- Reviews ---
        $review1 = new Review();
        $review1->setRating(5)->setTitle('Mariage inoubliable')->setBody('Le traiteur était exceptionnel, la pastilla était à tomber par terre. Merci Karim!')
            ->setVendorProfile($profile1)->setAuthor($coupleUser);
        $manager->persist($review1);

        $manager->flush();
    }

    private function createPermissions(ObjectManager $manager): void
    {
        $names = [
            'profile:create', 'profile:edit', 'profile:view',
            'quote:create', 'quote:view', 'quote:manage',
            'manage:all_profiles', 'manage:all_quotes', 'view:all_quotes'
        ];

        foreach ($names as $name) {
            $p = new Permission();
            $p->setName($name);
            $manager->persist($p);
            $this->permissions[$name] = $p;
        }
    }

    private function createRoles(ObjectManager $manager): void
    {
        $config = [
            'ROLE_COUPLE' => ['quote:create'],
            'ROLE_VENDOR' => ['profile:create', 'quote:manage'],
            'ROLE_ADMIN' => ['manage:all_profiles', 'manage:all_quotes', 'view:all_quotes'],
        ];

        foreach ($config as $roleName => $perms) {
            $r = new Role();
            $r->setName($roleName);
            foreach ($perms as $pName) {
                $r->addPermission($this->permissions[$pName]);
            }
            $manager->persist($r);
            $this->roles[$roleName] = $r;
        }
    }
}

