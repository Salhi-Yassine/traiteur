<?php

namespace App\Story;

use App\Entity\User;
use App\Entity\VendorProfile;
use App\Factory\BudgetItemFactory;
use App\Factory\CityFactory;
use App\Factory\GuestFactory;
use App\Factory\MenuItemFactory;
use App\Factory\PermissionFactory;
use App\Factory\ReviewFactory;
use App\Factory\RoleFactory;
use App\Factory\UserFactory;
use App\Factory\VendorProfileFactory;
use App\Factory\WeddingProfileFactory;
use Zenstruck\Foundry\Story;

final class InitialAppStory extends Story
{
    public function build(): void
    {
        // --- Permissions ---
        $perms = [];
        foreach ([
            'profile:create', 'profile:edit', 'profile:view',
            'quote:create', 'quote:view', 'quote:manage',
            'manage:all_profiles', 'manage:all_quotes', 'view:all_quotes'
        ] as $name) {
            $perms[$name] = PermissionFactory::createOne(['name' => $name]);
        }

        // --- Roles ---
        $roles = [];
        $roles['ROLE_COUPLE'] = RoleFactory::createOne(['name' => 'ROLE_COUPLE', 'permissions' => [$perms['quote:create']]]);
        $roles['ROLE_VENDOR'] = RoleFactory::createOne(['name' => 'ROLE_VENDOR', 'permissions' => [$perms['profile:create'], $perms['quote:manage']]]);
        $roles['ROLE_ADMIN'] = RoleFactory::createOne(['name' => 'ROLE_ADMIN', 'permissions' => [$perms['manage:all_profiles'], $perms['manage:all_quotes'], $perms['view:all_quotes']]]);

        // --- Users ---
        $coupleUser = UserFactory::createOne([
            'email' => 'couple@farah.ma',
            'firstName' => 'Yasmine',
            'lastName' => 'Benali',
            'userType' => User::TYPE_COUPLE,
            'userRoles' => [$roles['ROLE_COUPLE']],
        ]);

        $vendorUser1 = UserFactory::createOne([
            'email' => 'traiteur.royal@farah.ma',
            'firstName' => 'Karim',
            'lastName' => 'Meziane',
            'userType' => User::TYPE_VENDOR,
            'userRoles' => [$roles['ROLE_VENDOR']],
        ]);

        $vendorUser2 = UserFactory::createOne([
            'email' => 'negrafa.majesty@farah.ma',
            'firstName' => 'Sophia',
            'lastName' => 'Rahmani',
            'userType' => User::TYPE_VENDOR,
            'userRoles' => [$roles['ROLE_VENDOR']],
        ]);

        $admin = UserFactory::createOne([
            'email' => 'admin@farah.ma',
            'firstName' => 'Admin',
            'lastName' => 'Farah',
            'userType' => User::TYPE_ADMIN,
            'userRoles' => [$roles['ROLE_ADMIN']],
            'password' => 'admin123',
        ]);

        // --- Cities ---
        $cities = [
            'Casablanca' => 'الدار البيضاء',
            'Rabat' => 'الرباط',
            'Fès' => 'فاس',
            'Tanger' => 'طنجة',
            'Marrakech' => 'مراكش',
            'Salé' => 'سلا',
            'Meknès' => 'مكناس',
            'Agadir' => 'أكادير',
            'Oujda' => 'وجدة',
            'Kenitra' => 'القنيطرة',
            'Tétouan' => 'تطوان',
            'Safi' => 'آسفي',
            'Temara' => 'تمارة',
            'Inezgane' => 'إنزكان',
            'Mohammédia' => 'المحمدية',
            'Laâyoune' => 'العيون',
            'Khouribga' => 'خريبكة',
            'Béni Mellal' => 'بني ملال',
            'Nador' => 'الناظور',
            'Taza' => 'تازة',
            'Aït Melloul' => 'آيت ملول',
            'Settat' => 'سطات',
            'Barrechid' => 'برشيد',
            'Khemisset' => 'الخميسات',
            'Guelmim' => 'كلميم',
            'El Jadida' => 'الجديدة',
            'Errachidia' => 'الرشيدية',
            'Ouarzazate' => 'ورزازات',
            'Tiznit' => 'تيزنيت',
            'Essaouira' => 'الصويرة',
            'Ifrane' => 'إفران',
            'Azrou' => 'أزرو',
            'Midelt' => 'ميدلت',
            'Larache' => 'العرائش',
            'Ksar El Kebir' => 'القصر الكبير',
            'Berrechid' => 'برشيد',
            'Benslimane' => 'بنسليمان',
            'Sidi Slimane' => 'سيدي سليمان',
            'Sidi Kacem' => 'سيدي قاسم',
            'Skhirat' => 'الصخيرات',
            'Oued Zem' => 'وادي زم',
            'Smara' => 'السمارة',
            'Tan-Tan' => 'طانطان',
            'Tarfaya' => 'طرفاية',
            'Boujdour' => 'بوجدور',
            'Dakhla' => 'الداخلة'
        ];

        $cityFactories = [];
        foreach ($cities as $cityName => $arabicName) {
            $city = CityFactory::createOne(['name' => $cityName])->_real();
            $cityFactories[$cityName] = $city;
            
            /** @var \Gedmo\Translatable\Entity\Repository\TranslationRepository $repo */
            $repo = CityFactory::repository()->_repository()->getEntityManager()->getRepository(\App\Entity\Translation::class);
            $repo->translate($city, 'name', 'ar', $arabicName);
        }
        CityFactory::repository()->_repository()->getEntityManager()->flush();

        // --- Wedding Profile ---
        $wedding = WeddingProfileFactory::createOne([
            'user' => $coupleUser,
            'brideName' => 'Yasmine',
            'groomName' => 'Amine',
            'weddingCity' => 'Casablanca',
            'guestCountEst' => 150,
            'totalBudgetMad' => 250000,
        ]);

        GuestFactory::createOne(['weddingProfile' => $wedding, 'fullName' => 'Mehdi Alami', 'side' => 'groom', 'rsvpStatus' => 'confirmed']);
        GuestFactory::createOne(['weddingProfile' => $wedding, 'fullName' => 'Salma Bennani', 'side' => 'bride', 'rsvpStatus' => 'pending']);
        BudgetItemFactory::createOne(['weddingProfile' => $wedding, 'category' => 'Venue & Catering', 'budgetedAmount' => 150000, 'spentAmount' => 50000]);

        // --- Vendor Profiles ---
        $profile1 = VendorProfileFactory::createOne([
            'businessName' => 'Festin Royal',
            'category' => 'Catering',
            'tagline' => 'Cuisine marocaine authentique pour vos événements mémorables',
            'description' => 'Festin Royal est un service traiteur haut de gamme basé à Casablanca...',
            'languagesSpoken' => ['ary', 'fr', 'en'],
            'priceRange' => VendorProfile::PRICE_PREMIUM,
            'owner' => $vendorUser1,
            'cities' => [$cityFactories['Casablanca'], $cityFactories['Rabat'], $cityFactories['Marrakech']],
        ]);

        $profile2 = VendorProfileFactory::createOne([
            'businessName' => 'Negrafa Majesty',
            'category' => 'Negrafa',
            'tagline' => 'L\'élégance de la mariée marocaine',
            'owner' => $vendorUser2,
            'cities' => [$cityFactories['Rabat']],
        ]);

        // --- Menu Items ---
        MenuItemFactory::createOne(['name' => 'Pastilla au Pigeon', 'category' => 'Main', 'vendorProfile' => $profile1]);
        MenuItemFactory::createOne(['name' => 'Tajine d\'Agneau Mrouzia', 'category' => 'Main', 'vendorProfile' => $profile1]);

        // --- Reviews ---
        ReviewFactory::createOne(['rating' => 5, 'vendorProfile' => $profile1, 'author' => $coupleUser]);

        // --- Random Extras ---
        VendorProfileFactory::createMany(10);
    }
}
