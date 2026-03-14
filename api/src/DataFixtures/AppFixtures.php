<?php

namespace App\DataFixtures;

use App\Entity\CatererProfile;
use App\Entity\MenuItem;
use App\Entity\QuoteRequest;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private readonly UserPasswordHasherInterface $hasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        // --- Users ---
        $client = new User();
        $client->setEmail('client@traiteur.com')
            ->setFirstName('Yasmine')
            ->setLastName('Benali')
            ->setUserType(User::TYPE_CLIENT)
            ->setPassword($this->hasher->hashPassword($client, 'password'));
        $manager->persist($client);

        $catererUser1 = new User();
        $catererUser1->setEmail('chef.karim@traiteur.com')
            ->setFirstName('Karim')
            ->setLastName('Meziane')
            ->setUserType(User::TYPE_CATERER)
            ->setPassword($this->hasher->hashPassword($catererUser1, 'password'));
        $manager->persist($catererUser1);

        $catererUser2 = new User();
        $catererUser2->setEmail('chef.sophia@traiteur.com')
            ->setFirstName('Sophia')
            ->setLastName('Rahmani')
            ->setUserType(User::TYPE_CATERER)
            ->setPassword($this->hasher->hashPassword($catererUser2, 'password'));
        $manager->persist($catererUser2);

        $catererUser3 = new User();
        $catererUser3->setEmail('chef.youcef@traiteur.com')
            ->setFirstName('Youcef')
            ->setLastName('Cherif')
            ->setUserType(User::TYPE_CATERER)
            ->setPassword($this->hasher->hashPassword($catererUser3, 'password'));
        $manager->persist($catererUser3);

        // --- Caterer Profiles ---
        $profile1 = new CatererProfile();
        $profile1->setSlug('festin-royal-alger')
            ->setBusinessName('Festin Royal')
            ->setTagline('Cuisine algérienne authentique pour vos événements mémorables')
            ->setDescription('Festin Royal est un service traiteur haut de gamme basé à Alger, spécialisé dans la cuisine algérienne traditionnelle revisitée. Avec plus de 15 ans d\'expérience, nous proposons des menus sur mesure pour mariages, réceptions d\'entreprise et célébrations privées. Nos chefs utilisent uniquement des produits frais et locaux pour vous offrir une expérience culinaire authentique.')
            ->setCuisineTypes(['Algerian', 'Mediterranean', 'Oriental'])
            ->setServiceStyles(['Buffet', 'Plated', 'Family Style'])
            ->setServiceArea('Alger')
            ->setPriceRange(CatererProfile::PRICE_PREMIUM)
            ->setCoverImageUrl('https://images.unsplash.com/photo-1555244162-803834f70033?w=800')
            ->setGalleryImages([
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
            ])
            ->setMinGuests('50')
            ->setMaxGuests('500')
            ->setIsVerified(true)
            ->setOwner($catererUser1);
        $catererUser1->setCatererProfile($profile1);
        $manager->persist($profile1);

        $profile2 = new CatererProfile();
        $profile2->setSlug('le-jardin-saveurs-oran')
            ->setBusinessName('Le Jardin des Saveurs')
            ->setTagline('La gastronomie méditerranéenne à votre service')
            ->setDescription('Traiteur de prestige basé à Oran, Le Jardin des Saveurs marie les saveurs de la Méditerranée avec une touche de modernité. Notre équipe de chefs passionnés crée des expériences culinaires uniques pour tous types d\'événements. Nous proposons également un service de décoration de table et mise en place complète.')
            ->setCuisineTypes(['Mediterranean', 'French', 'Italian'])
            ->setServiceStyles(['Plated', 'Cocktail', 'Buffet'])
            ->setServiceArea('Oran')
            ->setPriceRange(CatererProfile::PRICE_LUXURY)
            ->setCoverImageUrl('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800')
            ->setGalleryImages([
                'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
                'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600',
                'https://images.unsplash.com/photo-1564339997428-2dc2b4ae9c55?w=600',
            ])
            ->setMinGuests('30')
            ->setMaxGuests('200')
            ->setIsVerified(true)
            ->setOwner($catererUser2);
        $catererUser2->setCatererProfile($profile2);
        $manager->persist($profile2);

        $profile3 = new CatererProfile();
        $profile3->setSlug('saveurs-kabyle-tizi-ouzou')
            ->setBusinessName('Saveurs Kabyles')
            ->setTagline('L\'authenticité berbère dans chaque bouché')
            ->setDescription('Passionné de cuisine traditionnelle kabyle, notre service traiteur vous propose des spécialités authentiques comme le couscous, le tajine, et les pâtisseries berbères. Nous mettons un point d\'honneur à préserver les recettes ancestrales tout en les adaptant aux standards modernes de restauration événementielle.')
            ->setCuisineTypes(['Algerian', 'Berber', 'Traditional'])
            ->setServiceStyles(['Buffet', 'Family Style'])
            ->setServiceArea('Tizi Ouzou')
            ->setPriceRange(CatererProfile::PRICE_MODERATE)
            ->setCoverImageUrl('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800')
            ->setGalleryImages([
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
            ])
            ->setMinGuests('20')
            ->setMaxGuests('300')
            ->setIsVerified(true)
            ->setOwner($catererUser3);
        $catererUser3->setCatererProfile($profile3);
        $manager->persist($profile3);

        // --- Menu Items for profile1 ---
        $menuItems1 = [
            ['Salade Mechouia', 'Poivrons et tomates grillés mariné aux épices', '350', MenuItem::CATEGORY_STARTER, true, false, true],
            ['Chorba Frik', 'Soupe traditionnelle alg. au blé vert et agneau', '500', MenuItem::CATEGORY_STARTER, false, false, false],
            ['Couscous Royal', 'Couscous avec merguez, poulet et légumes de saison', '1200', MenuItem::CATEGORY_MAIN, false, false, false],
            ['Tajine d\'Agneau', 'Agneau mijoté aux olives, citron confit et pommes de terre', '1500', MenuItem::CATEGORY_MAIN, false, false, false],
            ['Kalb Ellouz', 'Gâteau algérien aux amandes et eau de fleur d\'oranger', '400', MenuItem::CATEGORY_DESSERT, false, true, true],
        ];

        foreach ($menuItems1 as [$name, $desc, $price, $cat, $veg, $vegan, $gf]) {
            $item = new MenuItem();
            $item->setName($name)->setDescription($desc)->setPricePerPerson($price)
                ->setCategory($cat)->setIsVegetarian($veg)->setIsVegan($vegan)
                ->setIsGlutenFree($gf)->setCatererProfile($profile1);
            $manager->persist($item);
        }

        // --- Menu Items for profile2 ---
        $menuItems2 = [
            ['Carpaccio de Daurade', 'Daurade marinée huile d\'olive, câpres et basilic', '800', MenuItem::CATEGORY_STARTER, true, true, true],
            ['Risotto aux Cèpes', 'Risotto crémeux aux champignons cèpes et parmesan', '900', MenuItem::CATEGORY_MAIN, true, false, true],
            ['Filet de Bar en Croûte', 'Bar méditerranéen en croûte de sel aux herbes fraîches', '1800', MenuItem::CATEGORY_MAIN, false, false, true],
            ['Panna Cotta au Citron', 'Panna cotta italienne, coulis de fruits rouges', '550', MenuItem::CATEGORY_DESSERT, true, false, true],
        ];

        foreach ($menuItems2 as [$name, $desc, $price, $cat, $veg, $vegan, $gf]) {
            $item = new MenuItem();
            $item->setName($name)->setDescription($desc)->setPricePerPerson($price)
                ->setCategory($cat)->setIsVegetarian($veg)->setIsVegan($vegan)
                ->setIsGlutenFree($gf)->setCatererProfile($profile2);
            $manager->persist($item);
        }

        // --- Reviews ---
        $reviews = [
            [$profile1, $client, 5, 'Exceptionnel pour notre mariage!', 'Le service était irréprochable et les saveurs absolument délicieuses. Nos invités ont encore parlé de la nourriture des semaines après. Merci à toute l\'équipe!'],
            [$profile1, $client, 5, 'Parfait de A à Z', 'Festin Royal a géré notre réception d\'entreprise de 200 personnes avec une efficacité remarquable. La qualité constante sur tous les plats était impressionnante.'],
            [$profile2, $client, 4, 'Très bonne prestation', 'Cuisine raffinée et service professionnel. Légère hésitation sur le timing de service mais la qualité des plats était irréprochable.'],
            [$profile3, $client, 5, 'Authenticité garantie', 'Un voyage culinaire dans l\'âme de la Kabylie. Le couscous était préparé comme le faisait ma grand-mère. Incroyable!'],
        ];

        foreach ($reviews as [$profile, $author, $rating, $title, $body]) {
            $review = new Review();
            $review->setRating($rating)->setTitle($title)->setBody($body)
                ->setCatererProfile($profile)->setAuthor($author);
            $manager->persist($review);
        }

        // Update rating stats manually for fixtures
        $profile1->setAverageRating('5.00')->setReviewCount(2);
        $profile2->setAverageRating('4.00')->setReviewCount(1);
        $profile3->setAverageRating('5.00')->setReviewCount(1);

        $manager->flush();
    }
}
