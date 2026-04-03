<?php

namespace App\Story;

use App\Entity\User;
use App\Entity\VendorProfile;
use App\Factory\BudgetItemFactory;
use App\Factory\CategoryFactory;
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
    private static ?\Doctrine\Persistence\ObjectManager $em = null;

    public static function setEntityManager(\Doctrine\Persistence\ObjectManager $em): void
    {
        self::$em = $em;
    }

    public function build(): void
    {
        $em = self::$em;
        if (!$em) {
            // Fallback for cases where setEntityManager wasn't called (e.g. tests)
            // This might still fail but at least we tried.
        }
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
            $city = CityFactory::createOne(['name' => $cityName]);
            $cityFactories[$cityName] = $city;
            
            /** @var \Gedmo\Translatable\Entity\Repository\TranslationRepository $repo */
            $repo = $em->getRepository(\App\Entity\Translation::class);
            $repo->translate($city, 'name', 'ar', $arabicName);
        }
        $em->flush();

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

        // --- Categories ---
        // [French name => [Arabic name, emoji]]
        $catData = [
            'Salles'      => ['قاعات الأفراح', '🏛️'],
            'Photography' => ['تصوير فوتوغرافي', '📸'],
            'Negrafa'     => ['نكافة', '👑'],
            'Catering'    => ['تموين الحفلات', '🍽️'],
            'Decoration'  => ['ديكور', '🌸'],
            'Makeup'      => ['حلاقة و تجميل', '✋'],
            'Orchestra'   => ['أوركسترا', '🎵'],
            'Transport'   => ['نقل', '🚗'],
            'Patisserie'  => ['حلويات', '🎂'],
            'Hennaya'     => ['نقاشة الحناء', '🧡'],
            'Jewelry'     => ['مجوهرات', '💍'],
            'Dresses'     => ['فساتين الزفاف', '👗'],
            'Suits'       => ['بدلات رجالية', '👔'],
            'Invitations' => ['دعوات الزفاف', '✉️'],
            'Honeymoon'   => ['شهر العسل', '✈️'],
            'Lighting'    => ['إضاءة وصوت', '💡'],
        ];

        $categoryFactories = [];
        foreach ($catData as $catName => [$arabicName, $emoji]) {
            $category = CategoryFactory::createOne(['name' => $catName, 'emoji' => $emoji]);
            $categoryFactories[$catName] = $category;

            /** @var \Gedmo\Translatable\Entity\Repository\TranslationRepository $repo */
            $repo = $em->getRepository(\App\Entity\Translation::class);
            $repo->translate($category, 'name', 'ar', $arabicName);
        }
        $em->flush();

        // --- Vendor Profiles ---
        $repo = $em->getRepository(\App\Entity\Translation::class);

        $profile1 = VendorProfileFactory::createOne([
            'businessName' => 'Festin Royal',
            'category' => $categoryFactories['Catering'],
            'tagline' => 'Cuisine marocaine authentique pour vos événements mémorables',
            'description' => 'Festin Royal est un service traiteur haut de gamme basé à Casablanca...',
            'languagesSpoken' => ['ary', 'fr', 'en'],
            'priceRange' => VendorProfile::PRICE_PREMIUM,
            'owner' => $vendorUser1,
            'cities' => [$cityFactories['Casablanca'], $cityFactories['Rabat'], $cityFactories['Marrakech']],
        ]);
        $repo->translate($profile1, 'businessName', 'ar', 'الترايتور الملكي');
        $repo->translate($profile1, 'tagline', 'ar', 'مطبخ مغربي أصيل لمناسباتكم التي لا تنسى');
        $repo->translate($profile1, 'description', 'ar', 'الترايتور الملكي هو خدمة تموين راقية في الدار البيضاء...');

        $profile2 = VendorProfileFactory::createOne([
            'businessName' => 'Negrafa Majesty',
            'category' => $categoryFactories['Negrafa'],
            'tagline' => 'L\'élégance de la mariée marocaine',
            'owner' => $vendorUser2,
            'cities' => [$cityFactories['Rabat']],
        ]);
        $repo->translate($profile2, 'businessName', 'ar', 'نكافة ماجيستي');
        $repo->translate($profile2, 'tagline', 'ar', 'أناقة العروس المغربية');

        // --- Menu Items ---
        MenuItemFactory::createOne(['name' => 'Pastilla au Pigeon', 'category' => 'Main', 'vendorProfile' => $profile1]);
        MenuItemFactory::createOne(['name' => 'Tajine d\'Agneau Mrouzia', 'category' => 'Main', 'vendorProfile' => $profile1]);

        // --- Reviews ---
        ReviewFactory::createOne(['rating' => 5, 'vendorProfile' => $profile1, 'author' => $coupleUser]);

        // --- Random Extras with Realistic Moroccan Data ---
        $vendorTemplates = [
            ['Traiteur Lahlou', 'ممُون لحلو', 'Saveurs authentiques marocaines', 'نكهات مغربية أصيلة', 'Catering', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', 350],
            ['Salles des Fêtes Al Majd', 'قاعة الأفراح المجد', 'Espace luxueux pour vos célébrations', 'مساحة فاخرة لاحتفالاتكم', 'Salles', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', 15000],
            ['Negafa Amira', 'نكافة أميرة', 'L\'élégance et la tradition marocaine', 'الأناقة والتقاليد المغربية', 'Negrafa', 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&q=80', 4000],
            ['Photographe Mehdi', 'المصور مهدي', 'Immortalisez vos meilleurs moments', 'تخليد أجمل اللحظات', 'Photography', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', 2500],
            ['Décoration Andalous', 'ديكور الأندلس', 'Design floral d\'exception', 'تصميم زهور استثنائي', 'Decoration', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', 3000],
            ['Orchestre Essaid', 'أوركسترا السعيد', 'Animation musicale inoubliable', 'تنشيط موسيقي لا ينسى', 'Orchestra', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 8000],
            ['Traiteur Afrah', 'ممُون أفراح', 'Le goût de la perfection', 'طعم الكمال', 'Catering', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', 450],
            ['Palais des Roses', 'قصر الورود', 'Un cadre féérique pour votre mariage', 'إطار ساحر لزفافكم', 'Salles', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', 20000],
            ['Negafa Sultana', 'نكافة سلطانة', 'Le charme impérial pour la mariée', 'السحر الإمبراطوري للعروس', 'Negrafa', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80', 7000],
            ['Studio Marrakech', 'ستوديو مراكش', 'Prestations photo & vidéo 4K', 'خدمات تصوير وفيديو 4K', 'Photography', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', 4000],
            ['Maison des Gâteaux', 'دار الحلويات', 'Pâtisseries marocaines de luxe', 'حلويات مغربية فاخرة', 'Patisserie', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80', 2000],
            ['Hennaya Fatima', 'النقاشة فاطمة', 'Henné 100% naturel et artisanal', 'حناء طبيعي 100٪ بلمسة أصيلة', 'Hennaya', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', 500],
            ['Bijouterie Berrada', 'مجوهرات برادة', 'Parures de mariée en diamant', 'أطقم زفاف من الألماس', 'Jewelry', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 10000],
            ['Dresses Elégance', 'فساتين الأناقة', 'Location de robes de mariée', 'تأجير فساتين الزفاف', 'Dresses', 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&q=80', 1500],
            ['Costumes d\'Or', 'بدلات الذهب', 'Sur-mesure pour le marié', 'تفصيل للعريس حسب المقاس', 'Suits', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', 2500],
            ['Invitations Noor', 'دعوات نور', 'Faire-part élégants et personnalisés', 'بطاقات دعوة أنيقة ومخصصة', 'Invitations', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', 300],
            ['Transports Prestige', 'نقل كبار الشخصيات', 'Transport VIP pour votre soirée', 'نقل فخم لأمسيتكم', 'Transport', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80', 3000],
            ['Éclairage Magique', 'إضاءة سحرية', 'Sons et lumières professionnels', 'صوتيات وإضاءة احترافية', 'Lighting', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 4000],
            ['Voyages Lune d\'Miel', 'أسفار شهر العسل', 'Des destinations de rêve romantiques', 'وجهات أحلام رومانسية', 'Honeymoon', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', 12000],
            ['Salon Beauté Royale', 'صالون الجمال الملكي', 'Coiffure et Maquillage complet', 'تصفيف شعر وماكياج شامل', 'Makeup', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80', 1500],
        ];

        for ($i = 0; $i < 60; $i++) {
            $tpl = $vendorTemplates[$i % count($vendorTemplates)];
            $frName = $tpl[0] . ($i >= count($vendorTemplates) ? ' ' . ($i + 1) : '');
            $arName = $tpl[1] . ($i >= count($vendorTemplates) ? ' ' . ($i + 1) : '');
            $frTagline = $tpl[2];
            $arTagline = $tpl[3];
            $categoryName = $tpl[4];
            $img = $tpl[5];
            $startingPrice = $tpl[6] + ($i * 100);

            $cat = $categoryFactories[$categoryName] ?? $categoryFactories['Salles'];

            $vProfile = VendorProfileFactory::createOne([
                'businessName' => $frName,
                'tagline' => $frTagline,
                'description' => "Bienvenue chez $frName. $frTagline. Nous offrons nos services pour sublimer votre événement.",
                'category' => $cat,
                'coverImageUrl' => $img,
                'startingPrice' => $startingPrice,
                'cities' => [
                    array_values($cityFactories)[$i % count($cityFactories)],
                    array_values($cityFactories)[($i + 1) % count($cityFactories)],
                ],
            ]);

            $repo->translate($vProfile, 'businessName', 'ar', $arName);
            $repo->translate($vProfile, 'tagline', 'ar', $arTagline);
            $repo->translate($vProfile, 'description', 'ar', "مرحباً بكم في $arName. $arTagline. نحن نقدم خدماتنا لجعل مناسبتكم استثنائية.");
        }

        $em->flush();
    }
}
