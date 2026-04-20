<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\ArticleCategory;
use App\Entity\Translation;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class MagazineFixtures extends Fixture implements FixtureGroupInterface
{
    public static function getGroups(): array
    {
        return ['magazine'];
    }

    public function load(ObjectManager $manager): void
    {
        $author = $manager->getRepository(User::class)->findOneBy(['email' => 'masterbrains4ai@gmail.com']);

        // ── 1. Categories ──────────────────────────────────────────────────────

        $catTraditions = new ArticleCategory();
        $catTraditions->setName('Traditions');
        $catTraditions->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M20 3a4 4 0 0 1-4 4"/><circle cx="18" cy="5" r="1.5" fill="currentColor"/></svg>');
        $manager->persist($catTraditions);

        $catMode = new ArticleCategory();
        $catMode->setName('Mode & Beauté');
        $catMode->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
        $manager->persist($catMode);

        $catBudget = new ArticleCategory();
        $catBudget->setName('Budget & Planning');
        $catBudget->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>');
        $manager->persist($catBudget);

        $catInspiration = new ArticleCategory();
        $catInspiration->setName('Inspiration & Lieux');
        $catInspiration->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>');
        $manager->persist($catInspiration);

        $catGastronomie = new ArticleCategory();
        $catGastronomie->setName('Gastronomie');
        $catGastronomie->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>');
        $manager->persist($catGastronomie);

        $catCulture = new ArticleCategory();
        $catCulture->setName('Culture & Conseils');
        $catCulture->setIconSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>');
        $manager->persist($catCulture);

        /** @var \Gedmo\Translatable\Entity\Repository\TranslationRepository $translationRepo */
        $translationRepo = $manager->getRepository(Translation::class);

        foreach ([
            [$catTraditions, 'التقاليد'],
            [$catMode, 'الموضة والجمال'],
            [$catBudget, 'الميزانية والتخطيط'],
            [$catInspiration, 'الإلهام والأماكن'],
            [$catGastronomie, 'المطبخ المغربي'],
            [$catCulture, 'الثقافة والنصائح'],
        ] as [$cat, $nameAry]) {
            $translationRepo->translate($cat, 'name', 'ary', $nameAry);
        }

        $manager->flush();

        // ── 2. Articles ────────────────────────────────────────────────────────

        $articles = $this->getArticlesData($catTraditions, $catMode, $catBudget, $catInspiration, $catGastronomie, $catCulture);

        foreach ($articles as $data) {
            $article = new Article();
            $article->setTitle($data['title']);
            $article->setExcerpt($data['excerpt']);
            $article->setContent($data['content']);
            $article->setCategory($data['category']);
            $article->setFeaturedImage($data['featuredImage']);
            $article->setTags($data['tags']);
            $article->setIsPublished(true);
            $article->setPublishedAt(new \DateTimeImmutable($data['publishedAt']));
            $article->setIsFeatured($data['isFeatured'] ?? false);
            if (isset($data['widgetType'])) {
                $article->setWidgetType($data['widgetType']);
            }
            if (isset($data['featuredOrder'])) {
                $article->setFeaturedOrder($data['featuredOrder']);
            }
            if ($author) {
                $article->setAuthor($author);
            }
            $manager->persist($article);

            if (isset($data['titleAry'])) {
                $translationRepo->translate($article, 'title', 'ary', $data['titleAry']);
            }
            if (isset($data['excerptAry'])) {
                $translationRepo->translate($article, 'excerpt', 'ary', $data['excerptAry']);
            }
        }

        $manager->flush();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getArticlesData(
        ArticleCategory $traditions,
        ArticleCategory $mode,
        ArticleCategory $budget,
        ArticleCategory $inspiration,
        ArticleCategory $gastronomie,
        ArticleCategory $culture,
    ): array {
        return [
            // ── TRADITIONS ────────────────────────────────────────────────────

            [
                'title' => 'Guide complet de la Negafa : rôle, timing et tarifs en 2026',
                'excerpt' => 'La Negafa est l\'âme du mariage marocain. Découvrez tout ce que vous devez savoir pour bien choisir la vôtre et planifier son intervention.',
                'content' => '<p>Au cœur de chaque mariage marocain se trouve une figure incontournable : <strong>la Negafa</strong>. Plus qu\'une simple habilleuse, elle est la gardienne des traditions, l\'architecte de l\'image de la mariée et la chef d\'orchestre des changements de tenues.</p><h2>Le rôle de la Negafa</h2><p>La Negafa est responsable de l\'ensemble du parcours de la mariée lors de la nuit du mariage. Elle gère les transitions entre les différentes <em>lbssat</em> (tenues), supervise les accessoires comme la <em>taaj</em> (couronne) et le <em>ceinturon</em>, et s\'assure que chaque entrée est mémorable. Elle travaille souvent en équipe avec une ou deux assistantes.</p><h2>Combien de tenues prévoir ?</h2><p>Un mariage marocain traditionnel comprend en général entre <strong>5 et 7 tenues</strong> pour la mariée :</p><ul><li>La <em>Lebssa Mezgouda</em> (tenue fassia, souvent verte ou bordeaux)</li><li>Le <em>Caftan</em> de réception</li><li>Le <em>Takchita</em> d\'honneur</li><li>La robe blanche ou moderne</li><li>La tenue de l\'<em>Amariya</em></li></ul><h2>Timing typique d\'une nuit de mariage</h2><p>La Negafa coordonne généralement ses interventions selon un timing précis. L\'habillage commence en général 3 à 4 heures avant l\'arrivée des invités. Les changements de tenues se font toutes les 45 à 90 minutes pendant la soirée.</p><h2>Tarifs en 2026</h2><p>Les tarifs varient selon la ville et la renommée de la Negafa :</p><ul><li><strong>Casablanca / Rabat :</strong> 4 000 à 12 000 MAD pour la nuit</li><li><strong>Marrakech :</strong> 5 000 à 15 000 MAD</li><li><strong>Fès :</strong> 3 500 à 9 000 MAD</li></ul><p>Ces tarifs incluent généralement l\'habillage, les accessoires de cérémonie (couronne, ceinturon, éventail) et la coordination des entrées. Vérifiez toujours ce qui est inclus avant de signer le contrat.</p><h2>Comment choisir sa Negafa ?</h2><p>Demandez un book photo ou vidéo de ses précédents mariages. Assurez-vous qu\'elle maîtrise le style que vous souhaitez (fassi, gnawi, moderne). Rencontrez-la en personne pour évaluer votre feeling, car vous passerez la journée entière ensemble.</p><p>Sur Farah.ma, vous trouverez des Negafas vérifiées dans toutes les grandes villes du Maroc, avec les avis de vraies mariées.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
                'category' => $traditions,
                'tags' => ['negafa', 'traditions', 'tenues', 'mariage-marocain'],
                'isFeatured' => true,
                'featuredOrder' => 1,
                'publishedAt' => '2026-04-10',
            ],

            [
                'title' => 'Cérémonie du Henné : traditions, symboliques et organisation',
                'excerpt' => 'La Laylat al-Henna est bien plus qu\'une simple soirée de beauté — c\'est un rituel ancestral chargé de symboliques et de bénédictions pour la future mariée.',
                'content' => '<p>La <strong>Laylat al-Henna</strong> (nuit du henné) est l\'une des cérémonies prénuptiales les plus importantes au Maroc. Elle a lieu généralement la veille ou quelques jours avant le mariage et réunit les femmes de la famille et les amies proches de la mariée.</p><h2>Les origines du rituel</h2><p>Le henné est utilisé au Maroc depuis des siècles comme symbole de fertilité, de bonheur et de protection contre le mauvais œil. Les motifs appliqués sur les mains et les pieds de la mariée sont chargés de sens : les arabesques représentent la continuité de la vie, les fleurs symbolisent l\'épanouissement et les points évoquent la prospérité.</p><h2>Le déroulement de la soirée</h2><p>La soirée commence généralement en fin d\'après-midi. L\'<em>Hnanya</em> (artiste spécialisée dans le henné) commence par appliquer le henné sur les mains et les pieds de la mariée. Pendant ce temps, des youyous, de la musique et des plateaux de pâtisseries créent une ambiance festive. Les invitées reçoivent également un peu de henné, souvent un simple point symbolique.</p><h2>Les éléments indispensables</h2><ul><li><strong>Le plateau de henné :</strong> traditionnellement décoré de bougies, de roses et de pièces de monnaie dorées</li><li><strong>La tenue de la mariée :</strong> souvent un Kaftan vert ou rose avec des broderies dorées</li><li><strong>La musique :</strong> groupe de musique Andalouse ou Gnawa selon les régions</li><li><strong>Les pâtisseries :</strong> Briwat, Kaab el-Ghzal, Sellou</li></ul><h2>Combien ça coûte ?</h2><p>Organiser une Laylat al-Henna pour 50 à 80 personnes coûte entre <strong>8 000 et 25 000 MAD</strong> selon la ville, la salle choisie, la qualité du traiteur et le groupe musical. Une Hnanya de qualité facture entre 500 et 2 000 MAD selon la complexité des motifs demandés.</p><p>Retrouvez des artistes Hnanya vérifiées et des traiteurs spécialisés dans les cérémonies traditionnelles sur Farah.ma.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
                'category' => $traditions,
                'tags' => ['henne', 'traditions', 'laylat-al-henna', 'ceremonie'],
                'publishedAt' => '2026-04-08',
            ],

            [
                'title' => "L'Amariya : l'entrée royale de la mariée marocaine",
                'excerpt' => "Le trône nuptial porté à bout de bras par les hommes de la famille — l'Amariya est le moment le plus spectaculaire du mariage marocain traditionnel.",
                'content' => "<p>L'<strong>Amariya</strong> (également écrit Amaria ou Ammariya selon les régions) est le trône de cérémonie sur lequel la mariée est portée par les hommes de la famille ou des porteurs professionnels. Ce moment est sans doute le plus spectaculaire et le plus attendu de la soirée.</p><h2>Les origines de l'Amariya</h2><p>Cette tradition remonte à l'époque des sultans et des vizirs. Le trône portatif symbolisait la royauté accordée à la mariée en ce jour particulier. Selon les régions, les formes et les ornements varient : à Fès on privilégie le bois sculpté et doré, à Casablanca les modèles plus modernes avec des LED et des voiles de tulle blanc.</p><h2>Combien d'entrées ?</h2><p>Un mariage traditionnel comprend généralement <strong>3 à 5 entrées sur Amariya</strong>, une par changement de tenue majeur. La première entrée marque l'arrivée officielle des mariés, et chaque apparition suivante est accueillie par des youyous et des chants de la Negafa.</p><h2>Louer ou acheter ?</h2><p>La plupart des couples louent l'Amariya. Les tarifs de location varient :</p><ul><li>Modèle standard bois doré : 800 – 1 500 MAD</li><li>Modèle prestige avec éclairage LED : 2 000 – 4 500 MAD</li><li>Porteurs professionnels : 300 – 600 MAD par personne (4 à 6 personnes)</li></ul><h2>Conseils pratiques</h2><p>Prévoyez un couloir d'au moins 2 mètres de large entre les tables pour permettre à l'Amariya de passer confortablement. Testez la hauteur sous plafond si votre salle comporte des lustre bas. Répétez les transitions avec la Negafa pour que les entrées soient fluides et mémorables.</p>",
                'featuredImage' => 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
                'category' => $traditions,
                'tags' => ['amariya', 'traditions', 'ceremonie', 'mariage-marocain'],
                'publishedAt' => '2026-04-05',
            ],

            // ── MODE & BEAUTÉ ─────────────────────────────────────────────────

            [
                'title' => 'Choisir son Caftan de mariée : les couturiers incontournables en 2026',
                'excerpt' => 'De Casablanca à Fès, les grands ateliers du Caftan marocain rivalisent de créativité. Notre guide pour trouver la tenue qui vous ressemble.',
                'content' => '<p>Le <strong>Caftan de mariée</strong> est la pièce centrale de la garde-robe nuptiale marocaine. Contrairement à la robe de mariée occidentale, le choix ne s\'arrête pas à une seule tenue — c\'est une collection complète de 5 à 7 <em>lbssat</em> qui raconte votre histoire.</p><h2>Les grandes capitales du Caftan</h2><p><strong>Fès</strong> est la capitale historique du Caftan. Les ateliers fassis perpétuent des savoir-faire transmis de génération en génération : broderie à l\'aiguille (Seffa), velours ciselé (Makhzen), et fils d\'or véritable. Les maisons comme Zineb Joundy ou Kaoutar Fassi sont des références incontournables.</p><p><strong>Casablanca</strong> incarne la modernité. Les couturiers comme Rafiq el-Hariry et Nour Abid fusionnent l\'esthétique traditionnelle avec les tendances contemporaines, créant des Caftans qui traversent les époques.</p><h2>Les matières à privilégier</h2><ul><li><strong>Le Dibaaj :</strong> brocart tissé avec des fils de soie et d\'or, le plus précieux</li><li><strong>Le velours cisellé (Makhzen) :</strong> somptueux pour les cérémonies d\'hiver</li><li><strong>Le crêpe de soie :</strong> idéal pour les mariages d\'été, léger et fluide</li><li><strong>Le satin Duchesse :</strong> pour une silhouette sculptée et glamour</li></ul><h2>Budget et timing</h2><p>Un Caftan de mariée de qualité se commande <strong>6 à 12 mois à l\'avance</strong>. Les tarifs varient considérablement :</p><ul><li>Entrée de gamme (prêt-à-porter) : 3 000 – 8 000 MAD par tenue</li><li>Demi-mesure (atelier local) : 8 000 – 20 000 MAD</li><li>Haute couture (sur-mesure, couturier renommé) : 20 000 – 80 000 MAD et plus</li></ul><h2>Questions à poser à votre couturier</h2><p>Demandez toujours à voir des photos de mariées réelles portant ses créations, pas seulement des mannequins. Vérifiez que les délais de livraison incluent au moins deux essayages. Et surtout, définissez clairement le nombre et les coloris des tenues avant de signer.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
                'category' => $mode,
                'tags' => ['caftan', 'mode', 'couturier', 'beaute'],
                'isFeatured' => true,
                'featuredOrder' => 2,
                'publishedAt' => '2026-04-12',
            ],

            [
                'title' => "La broderie R'anda : l'art du fil d'or marocain pour la mariée",
                'excerpt' => "La R'anda est l'une des broderies les plus précieuses du patrimoine marocain — un travail d'orfèvre transmis de génération en génération dans les ateliers de Fès et Tétouan.",
                'content' => "<p>Parmi les nombreuses techniques de broderie qui ornent les tenues de la mariée marocaine, la <strong>R'anda</strong> occupe une place d'exception. Cette dentelle de fils d'or et d'argent, travaillée à l'aiguille sur un fond de tulle ou de mousseline, est le summum du luxe artisanal marocain.</p><h2>L'origine de la R'anda</h2><p>La R'anda est née dans les médinas de Fès et de Tétouan, héritière de l'influence andalouse apportée par les Maures expulsés d'Espagne au XVe siècle. Les motifs — arabesques, rinceaux floraux, étoiles à huit branches — sont codifiés et transmis oralement de maîtresse en apprentie dans les ateliers familiaux.</p><h2>Comment reconnaître une R'anda authentique</h2><ul><li>Le fil est en or ou argent véritable, pas en fil métallique industriel</li><li>Le travail est entièrement fait main — aucune machine ne peut reproduire la finesse des points</li><li>Le motif est régulier et symétrique, avec des raccords quasi invisibles</li><li>L'envers est presque aussi propre que l'endroit</li></ul><h2>Les prix d'une R'anda</h2><p>Le temps de travail est considérable : une ceinture R'anda de qualité représente entre 200 et 400 heures de travail. Les tarifs reflètent cet investissement :</p><ul><li>Ceinture simple : 3 000 – 8 000 MAD</li><li>Col et manches brodés : 5 000 – 15 000 MAD</li><li>Caftan entièrement brodé : 30 000 – 100 000 MAD et plus</li></ul><h2>Où acheter une R'anda authentique ?</h2><p>Les quartiers des tisserands dans la médina de Fès (Souk Seffarine) et le marché artisanal de Tétouan restent les meilleures adresses. Méfiez-vous des imitations en fils synthétiques vendues comme authentiques dans les souks touristiques.</p>",
                'featuredImage' => 'https://images.unsplash.com/photo-1571846983003-3c67aa49a5a9?w=1200&q=80',
                'category' => $mode,
                'tags' => ['randa', 'broderie', 'mode', 'artisanat'],
                'publishedAt' => '2026-04-07',
            ],

            [
                'title' => 'Maquillage mariage marocain : tendances et artistes à suivre en 2026',
                'excerpt' => "Le maquillage de la mariée marocaine mêle l'art du Khôl ancestral aux techniques contemporaines. Voici les tendances et les noms à retenir pour 2026.",
                'content' => '<p>Le maquillage de la mariée marocaine est un art à part entière, à mi-chemin entre tradition et modernité. Il doit non seulement être sublime, mais aussi tenir pendant 8 à 12 heures de festivités intenses.</p><h2>Les tendances 2026</h2><p><strong>Le Natural Glam :</strong> Inspiré des grandes maisons occidentales mais adapté au teint marocain, ce style mise sur une peau lumineuse, des lèvres nude glossy et un eye-liner en amande allongé. Parfait pour les mariées qui veulent se reconnaître dans leurs photos.</p><p><strong>Le Fassi Moderne :</strong> Une réinterprétation du maquillage traditionnel de Fès avec des smoky eyes en bordeaux ou en cuivre, du Khôl noir intensifié, et un fond de teint mat ambré. Somptueux et photographique.</p><p><strong>Le Boho Doré :</strong> Tons terra cotta sur les paupières, highlighter poudré sur les pommettes, et lèvres abricot. Idéal pour les mariages en riad ou en plein air.</p><h2>La durabilité, clé du maquillage de mariage</h2><p>Demandez systématiquement un test maquillage 4 à 6 semaines avant le mariage. Vérifiez le rendu en lumière naturelle ET en lumière de salle. Insistez sur un fond de teint waterproof et une fixation longue durée pour résister aux youyous et aux émotions de la nuit.</p><h2>Budget</h2><p>Les maquilleuses spécialisées mariages marocains facturent entre <strong>800 et 3 500 MAD</strong> pour la nuit, selon leur niveau d\'expérience et la ville. Ce tarif inclut généralement les changements de looks entre les tenues.</p><p>Retrouvez les meilleures maquilleuses vérifiées de votre région sur la plateforme Farah.ma.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1596704017254-9b5b31399af9?w=1200&q=80',
                'category' => $mode,
                'tags' => ['maquillage', 'beaute', 'mode', 'tendances'],
                'publishedAt' => '2026-04-03',
            ],

            // ── BUDGET & PLANNING ─────────────────────────────────────────────

            [
                'title' => 'Budget mariage au Maroc : répartition type pour 150 invités',
                'excerpt' => 'Combien coûte vraiment un mariage au Maroc ? On détaille poste par poste la répartition budgétaire pour 150 invités, de la salle au photographe.',
                'content' => '<p>Organiser un mariage au Maroc représente un investissement significatif. Pour aider les futurs mariés à s\'y retrouver, voici une répartition budgétaire réaliste basée sur <strong>150 invités</strong> et un budget total moyen de <strong>120 000 MAD</strong>.</p><h2>Répartition type des dépenses</h2><table style="width:100%; border-collapse: collapse;"><tr style="background:#f5f5f5;"><th style="padding:8px; text-align:left;">Poste</th><th style="padding:8px; text-align:right;">Budget estimé</th><th style="padding:8px; text-align:right;">% du total</th></tr><tr><td style="padding:8px;">Salle de réception</td><td style="padding:8px; text-align:right;">25 000 MAD</td><td style="padding:8px; text-align:right;">21%</td></tr><tr style="background:#fef0ed;"><td style="padding:8px;">Traiteur (menu complet)</td><td style="padding:8px; text-align:right;">30 000 MAD</td><td style="padding:8px; text-align:right;">25%</td></tr><tr><td style="padding:8px;">Tenues (Negafa + Caftan)</td><td style="padding:8px; text-align:right;">20 000 MAD</td><td style="padding:8px; text-align:right;">17%</td></tr><tr style="background:#fef0ed;"><td style="padding:8px;">Photographe + vidéaste</td><td style="padding:8px; text-align:right;">12 000 MAD</td><td style="padding:8px; text-align:right;">10%</td></tr><tr><td style="padding:8px;">Décoration florale</td><td style="padding:8px; text-align:right;">10 000 MAD</td><td style="padding:8px; text-align:right;">8%</td></tr><tr style="background:#fef0ed;"><td style="padding:8px;">Musique / DJ / groupe</td><td style="padding:8px; text-align:right;">8 000 MAD</td><td style="padding:8px; text-align:right;">7%</td></tr><tr><td style="padding:8px;">Pâtisseries et gâteaux</td><td style="padding:8px; text-align:right;">5 000 MAD</td><td style="padding:8px; text-align:right;">4%</td></tr><tr style="background:#fef0ed;"><td style="padding:8px;">Invitations + faire-part</td><td style="padding:8px; text-align:right;">3 000 MAD</td><td style="padding:8px; text-align:right;">3%</td></tr><tr><td style="padding:8px;">Coiffure + maquillage</td><td style="padding:8px; text-align:right;">3 500 MAD</td><td style="padding:8px; text-align:right;">3%</td></tr><tr style="background:#fef0ed;"><td style="padding:8px;">Imprévus (10%)</td><td style="padding:8px; text-align:right;">12 000 MAD</td><td style="padding:8px; text-align:right;">10%</td></tr></table><h2>Les postes sur lesquels économiser</h2><p>Le photographe et la salle sont les postes sur lesquels il ne faut PAS économiser — ce sont les souvenirs qui durent. En revanche, les invitations peuvent être digitalisées (économie de 60%), et les compositions florales peuvent être remplacées par des décorations de chandelles moins coûteuses.</p><h2>Astuces pour réduire la facture</h2><ul><li>Choisissez une date en semaine ou hors saison (janvier-mars)</li><li>Réservez la salle et le traiteur plus de 12 mois à l\'avance pour négocier</li><li>Comparez au moins 3 devis pour chaque prestataire sur Farah.ma</li></ul>',
                'featuredImage' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
                'category' => $budget,
                'tags' => ['budget', 'planning', 'conseils', 'organisation'],
                'publishedAt' => '2026-04-15',
            ],

            [
                'title' => 'Checklist ultime du mariage marocain : 18 mois de planification',
                'excerpt' => "De la réservation de la salle à la liste des invités : votre planning mois par mois pour n'oublier aucun détail le jour J.",
                'content' => "<p>Organiser un mariage traditionnel marocain est un projet de longue haleine. Cette checklist mois par mois vous permettra d'avancer sereinement sans oublier aucun détail essentiel.</p><h2>18 à 12 mois avant le mariage</h2><ul><li>Fixer la date et le budget global</li><li>Établir la liste préliminaire des invités</li><li>Visiter et réserver la salle de réception</li><li>Rencontrer les premiers couturiers Caftan</li><li>Réserver le traiteur (les meilleurs se bookent tôt)</li></ul><h2>12 à 6 mois avant</h2><ul><li>Commander les tenues (première consultation Negafa)</li><li>Choisir et réserver photographe et vidéaste</li><li>Organiser la cérémonie du henné (Hnanya, traiteur, salle)</li><li>Commander les faire-part</li><li>Planifier le voyage de noces</li></ul><h2>6 à 3 mois avant</h2><ul><li>Envoyer les invitations et commencer à collecter les confirmations</li><li>Premier essayage des tenues</li><li>Choisir la décoration florale</li><li>Réserver le groupe musical ou DJ</li><li>Organiser les préparatifs beauté (soin de la peau, test maquillage)</li></ul><h2>3 à 1 mois avant</h2><ul><li>Finaliser le plan de table</li><li>Confirmer tous les prestataires par écrit</li><li>Prévoir le transport des invités si nécessaire</li><li>Dernier essayage des tenues</li><li>Préparer la liste musicale et le déroulé de la soirée avec la Negafa</li></ul><h2>La semaine du mariage</h2><ul><li>Confirmer les horaires avec chaque prestataire</li><li>Préparer les enveloppes de paiement pour le Jour J</li><li>Se reposer et prendre soin de soi</li></ul><p>Avec l'outil Checklist de Farah.ma, vous pouvez gérer toutes ces tâches en temps réel et les partager avec votre famille.</p>",
                'featuredImage' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
                'category' => $budget,
                'tags' => ['planning', 'checklist', 'organisation', 'budget'],
                'publishedAt' => '2026-04-01',
            ],

            // ── INSPIRATION & LIEUX ───────────────────────────────────────────

            [
                'title' => 'Top 8 des Riads pour un mariage à Marrakech',
                'excerpt' => 'Entre les jardins secrets et les patios aux mosaïques zellige, Marrakech concentre les plus beaux riads pour un mariage intime et inoubliable.',
                'content' => '<p>Marrakech est sans conteste la capitale mondiale du mariage en riad. Sa médina millénaire renferme des dizaines de joyaux architecturaux qui se transforment en décors de conte pour les nuits de noces. Voici notre sélection des 8 riads les plus prisés.</p><h2>Riad El Fenn</h2><p>Fondé par Vanessa Branson, El Fenn est le riad le plus iconique de la Médina. Ses 21 suites entourent plusieurs patios et piscines. Capacité maximale pour un mariage : <strong>120 personnes</strong>. Tarif de privatisation à partir de 80 000 MAD pour 2 nuits.</p><h2>Riad Kheirredine</h2><p>Un riad du XVIIe siècle entièrement restauré dans le respect des traditions architecturales fassis. Son grand patio peut accueillir jusqu\'à <strong>80 personnes</strong> pour un dîner assis. Idéal pour les cérémonies intimistes.</p><h2>Riad Les Yeux Bleus</h2><p>Situé à deux pas du Musée de Marrakech, ce riad charmant est parfait pour les mariages boho-chic. Ses toits-terrasses offrent une vue imprenable sur les minarets de la médina. Capacité : <strong>60 personnes</strong>.</p><h2>Conseils pour choisir votre riad</h2><ul><li>Vérifiez le droit au bruit après 23h (certains quartiers ont des restrictions)</li><li>Demandez si le riad possède un accès traiteur extérieur ou cuisine interne</li><li>Anticipez la question du parking pour les invités (les médinas sont piétonnes)</li><li>Visitez impérativement en soirée pour évaluer l\'éclairage ambiant</li></ul><p>Sur Farah.ma, vous pouvez consulter les disponibilités et demander des devis à tous ces prestataires en quelques clics.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                'category' => $inspiration,
                'tags' => ['lieux', 'marrakech', 'riad', 'inspiration'],
                'publishedAt' => '2026-04-14',
            ],

            [
                'title' => 'Real Wedding : Leila & Youssef — Un mariage andalou à Fès',
                'excerpt' => 'Leila et Youssef voulaient un mariage qui honore leur héritage fassi tout en séduisant leurs invités parisiens. Voici comment ils ont réussi ce pari magnifique.',
                'content' => "<p>Novembre 2025. Leila et Youssef, tous deux trentenaires et parisiens d'adoption, ont choisi de célébrer leur mariage dans la médina de Fès — la ville de leurs grands-parents. L'enjeu était de taille : créer une expérience authentique pour 220 invités dont la moitié venait de France.</p><h2>Le choix du lieu : Dar Bensouda</h2><p>Après plusieurs mois de recherche, le couple a craqué pour Dar Bensouda, un palais du XVIIIe siècle récemment restauré. Ses trois patios en zellige turquoise, ses plafonds en cèdre sculpté et son grand jardin offraient le décor rêvé pour une nuit andalouse.</p><h2>La vision : entre deux mondes</h2><p>\"Nous voulions que nos amis français vivent une expérience immersive, pas touristique\", explique Leila. La décoration mêlait des lanternes en cuivre martelé (kenyat) et des compositions florales épurées signées Studio Botanica. La vaisselle mêlait l'artisanat local (assiettes à motifs géométriques fassis) et un service blanc contemporain.</p><h2>Les prestataires clés</h2><ul><li><strong>Negafa :</strong> Fatima Benali (Fès) — 5 tenues sur 7 heures</li><li><strong>Traiteur :</strong> Dar Cuisine — menu traditionnel fassi revisité</li><li><strong>Musique :</strong> Orchestre Andalou de Fès pour la première partie, DJ électro-oriental pour la fin de nuit</li><li><strong>Photographe :</strong> Studio Lumières du Maroc</li></ul><h2>Le budget</h2><p>Le budget total s'est établi à <strong>180 000 MAD</strong> pour 220 invités, soit environ 820 MAD par personne. Le poste le plus important a été le traiteur (35%), suivi de la location du palais (28%).</p><p>Inspiré par ce mariage ? Retrouvez les prestataires de Fès sur Farah.ma et demandez vos devis en ligne.</p>",
                'featuredImage' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
                'category' => $inspiration,
                'tags' => ['real-wedding', 'fes', 'inspiration', 'palais'],
                'publishedAt' => '2026-03-28',
            ],

            [
                'title' => "Mariage en bord de mer : les plus belles salles d'Agadir et Essaouira",
                'excerpt' => "Pour les couples qui rêvent d'une réception face à l'océan, le Maroc atlantique offre des cadres à couper le souffle — entre villas balnéaires et terrasses contemporaines.",
                'content' => "<p>Le mariage en bord de mer au Maroc a le vent en poupe. Agadir, Essaouira, El-Jadida et Asilah concentrent une nouvelle génération de lieux de réception qui marient architecture contemporaine et cadre naturel exceptionnel.</p><h2>Agadir : le luxe atlantique</h2><p><strong>Villa Mogador :</strong> Une villa de luxe avec piscine à débordement sur l'océan, pour des réceptions jusqu'à 200 personnes. La terrasse panoramique est idéale pour les photos de coucher de soleil. Tarifs à partir de 35 000 MAD la nuit.</p><p><strong>Sofitel Agadir Thalassa :</strong> La plage privée du Sofitel peut être privatisée pour des cérémonies de soirée. Un cadre unique pour une cérémonie fusion moderne-traditionnelle.</p><h2>Essaouira : le romantisme des vents</h2><p>Essaouira, la ville des alizés, offre une atmosphère unique entre enceintes fortifiées et médina blanche et bleue. Le <strong>Riad des Remparts</strong> et le <strong>Villa Gauthier</strong> sont les adresses favorites des mariages bohème.</p><h2>Points d'attention</h2><ul><li>Le vent peut être fort sur la côte — prévoyez des fixations pour les décors et voiles</li><li>Les sunsets au Maroc atlantique sont magnifiques mais les températures chutent vite en soirée</li><li>La logistique transport est complexe — prévoir des navettes pour les invités</li></ul>",
                'featuredImage' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
                'category' => $inspiration,
                'tags' => ['lieux', 'agadir', 'bord-de-mer', 'inspiration'],
                'publishedAt' => '2026-03-20',
            ],

            // ── GASTRONOMIE ───────────────────────────────────────────────────

            [
                'title' => 'Le guide du Hamlou parfait : quantités et astuces de traiteurs vérifiés',
                'excerpt' => 'Thé à la menthe, sellou, chebakia : combien prévoir exactement pour 150 invités ? Nos traiteurs partenaires dévoilent leurs standards.',
                'content' => '<p>Le <strong>Hamlou</strong> — dans sa définition large — désigne tout le service de thé et de pâtisseries traditionnelles qui accompagne les cérémonies marocaines. C\'est souvent la première et la dernière impression gastronomique de vos invités. Le voilà qui mérite toute votre attention.</p><h2>Les quantités de référence</h2><p>Selon les traiteurs marocains les plus expérimentés, voici les quantités standard à prévoir par invité :</p><ul><li><strong>Thé à la menthe :</strong> 0,25 litre par personne (inclut le sucre et la menthe fraîche)</li><li><strong>Sellou :</strong> 100 à 150g par personne</li><li><strong>Chebakia :</strong> 3 à 5 pièces par personne</li><li><strong>Kaab el Ghzal :</strong> 2 à 4 pièces par personne</li><li><strong>Briwats au miel :</strong> 2 à 3 pièces par personne</li><li><strong>Dates farcies :</strong> 2 à 3 pièces par personne</li></ul><h2>Le timing du service</h2><p>Le Hamlou se sert traditionnellement en trois moments clés :</p><ol><li>À l\'arrivée des invités (thé de bienvenue + petits fours)</li><li>Entre le repas et le dessert (service complet de pâtisseries)</li><li>En fin de soirée (thé de congé)</li></ol><h2>Choisir son traiteur</h2><p>Un bon traiteur Hamlou utilise du thé gunpowder de qualité, de la menthe fraîche nana (pas spearmint), et prépare ses pâtisseries en interne plutôt que de les acheter en gros. Demandez toujours à goûter avant de confirmer.</p><p>Utilisez notre calculateur ci-dessous pour estimer les quantités pour votre mariage, puis trouvez un traiteur certifié sur Farah.ma.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80',
                'category' => $gastronomie,
                'tags' => ['catering', 'traiteur', 'hamlou', 'gateau', 'gastronomie'],
                'widgetType' => 'hamlau',
                'titleAry' => 'دليل الحمالو الكامل : الكميات ونصايح الطباخين',
                'excerptAry' => 'أتاي، سلو، شبّاكية : قدّاش تحضر لـ150 ضيف؟ الطباخين المعتمدين عندنا كيشاركو أسرارهم.',
                'publishedAt' => '2026-04-16',
            ],

            [
                'title' => 'Les 7 plats incontournables d\'un mariage marocain traditionnel',
                'excerpt' => "Du bastilla en amuse-bouche au méchoui de minuit, voici les 7 plats qui définissent l'expérience culinaire d'un grand mariage marocain.",
                'content' => '<p>La gastronomie est l\'une des dimensions les plus mémorables d\'un mariage marocain. Voici les sept plats qui ne peuvent manquer sur la table d\'un grand mariage traditionnel.</p><h2>1. La Bastilla (Pastilla)</h2><p>Reine des amuse-bouches, la Bastilla au pigeon (ou au poulet) est un pilier de la gastronomie fassia. Sa pâte feuilletée croustillante, son mélange sucré-salé aux amandes et à la cannelle en font un met inoubliable. Comptez <strong>1/4 de Bastilla par personne</strong> en entrée.</p><h2>2. Le Rfissa</h2><p>Plat traditionnel à base de msemen (crêpe feuilletée marocaine), de poulet fermier et de lentilles en sauce au fenugrec, le Rfissa est associé aux cérémonies familiales et aux moments de célébration. C\'est le plat de l\'abondance par excellence.</p><h2>3. Le Tangia de Marrakech</h2><p>Spécialité marrakchie, le Tangia est une viande d\'agneau confite dans une jarre en terre cuite, cuite lentement dans les braises du hammam. Son arôme de saffran et de citrons confits est incomparable.</p><h2>4. Le Couscous Royal</h2><p>Servi en milieu de soirée, le couscous royal avec ses légumes de saison, ses tfaya d\'oignons caramélisés aux raisins secs et sa viande fondante représente l\'hospitalité marocaine dans toute sa splendeur. Prévoir <strong>200 à 250g de semoule cuite par personne</strong>.</p><h2>5. Le Méchoui de minuit</h2><p>L\'agneau entier rôti à la braise, présenté sur un grand plateau et servi avec du cumin, du sel et du Khobz chaud, est le clou du spectacle gastronomique. Il se sert généralement vers 1h ou 2h du matin pour relancer la fête.</p><h2>6. La Harira et les Dates</h2><p>La soupe Harira, servie chaude avec des dattes et des chebakia, marque traditionnellement la fin du repas avant le service du thé. Elle apporte chaleur et réconfort aux invités en fin de nuit.</p><h2>7. Le Gâteau de mariage</h2><p>Entre le gâteau occidental moderne et le Keneffa traditionnel, les couples marocains optent de plus en plus pour un hybride : un gâteau principal pour la photo, accompagné d\'une table de desserts traditionnels (msemen au miel, sellou, briouates).</p><p>Trouvez les meilleurs traiteurs marocains sur Farah.ma pour proposer ce menu d\'exception à vos invités.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80',
                'category' => $gastronomie,
                'tags' => ['catering', 'traiteur', 'gastronomie', 'plats-marocains'],
                'widgetType' => 'hamlau',
                'titleAry' => '7 أطباق ما تنقصش فزواج مغربي',
                'excerptAry' => 'من البسطيلة على بداية الليلة حتى لمشوي ديال نص الليل — هاد هوما الأطباق الأساسيين ديال زواج مغربي أصيل.',
                'publishedAt' => '2026-04-02',
            ],

            // ── CULTURE & CONSEILS ────────────────────────────────────────────

            [
                'title' => 'Mariage mixte franco-marocain : comment concilier deux cultures',
                'excerpt' => "Quand une famille française rencontre une famille marocaine, l'organisation du mariage peut devenir un exercice d'équilibriste. Nos conseils pour créer une célébration qui honore les deux.",
                'content' => '<p>Les mariages franco-marocains sont de plus en plus fréquents, et avec eux naissent de beaux défis organisationnels. Comment respecter les traditions de chaque famille tout en créant une expérience unifiée et mémorable ? Voici ce que nous avons appris de dizaines de couples qui ont réussi ce pari.</p><h2>Comprendre les différences culturelles</h2><p>Le mariage traditionnel marocain est avant tout un événement <strong>collectif et familial</strong> — la famille élargie est impliquée dans chaque décision, de la date au menu. Le mariage français tend à être plus centré sur le couple et leurs choix personnels. Ni l\'un ni l\'autre n\'est supérieur ; la clé est la communication ouverte entre les deux familles dès le début du projet.</p><h2>Le format : un ou deux jours ?</h2><p>Une solution populaire est d\'organiser deux célébrations distinctes :</p><ul><li><strong>Jour 1 — La nuit marocaine :</strong> Caftans, Negafa, Hamlou, musique andalouse, dans un riad ou une salle traditionnelle</li><li><strong>Jour 2 — La réception française :</strong> Cocktail, repas gastronomique, ambiance plus détendue, ouverte à la danse</li></ul><h2>La langue des discours</h2><p>Prévoyez des discours bilingues (français-darija ou français-arabe). Des sous-titres sur écran pour les moments importants (vœux, discours des parents) sont une attention très appréciée par les invités qui ne maîtrisent pas les deux langues.</p><h2>La nourriture, terrain de rencontre idéal</h2><p>Le repas est souvent le meilleur pont entre les deux cultures. Un menu qui alterne entrées françaises et plats traditionnels marocains (bastilla + foie gras, couscous + plateau de fromages) plaît généralement à toutes les générations.</p><p>Farah.ma peut vous mettre en relation avec des wedding planners spécialisés dans les mariages interculturels au Maroc.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=1200&q=80',
                'category' => $culture,
                'tags' => ['culture', 'conseils', 'mariage-mixte', 'franco-marocain'],
                'publishedAt' => '2026-03-25',
            ],

            [
                'title' => "Planifier son mariage depuis l'étranger : le guide complet pour les MRE",
                'excerpt' => 'Vous vivez à Paris, Bruxelles ou Montréal et organisez votre mariage au Maroc à distance ? Ce guide est fait pour vous.',
                'content' => '<p>Ils sont des milliers chaque année : les Marocains résidant à l\'étranger (MRE) qui souhaitent célébrer leur mariage au pays, mais qui font face au défi logistique d\'organiser un événement à des milliers de kilomètres. Voici un guide pratique construit à partir de leurs expériences.</p><h2>Le défi principal : la distance et la confiance</h2><p>Organiser depuis l\'étranger signifie que vous ne pouvez pas visiter les lieux physiquement, ni rencontrer facilement les prestataires. La relation de confiance devient donc primordiale. Voici comment la construire :</p><ul><li>Exigez des <strong>visites virtuelles</strong> par vidéo des salles et riads</li><li>Demandez des <strong>contrats clairs</strong> avec acompte et conditions d\'annulation écrites</li><li>Lisez les <strong>avis vérifiés</strong> de vraies mariées (disponibles sur Farah.ma)</li><li>Nommez un <strong>représentant local de confiance</strong> (sœur, cousin, ami proche) qui sera vos yeux sur place</li></ul><h2>Le timing idéal</h2><p>Pour un mariage en juillet-août (haute saison MRE), commencez à organiser <strong>18 à 24 mois à l\'avance</strong>. Les salles et traiteurs sont réservés jusqu\'à 2 ans à l\'avance pour les dates estivales.</p><h2>Les pièges à éviter</h2><ul><li>Ne versez jamais d\'acompte sans contrat signé</li><li>Ne faites pas confiance aux prix donnés par téléphone sans devis écrit</li><li>Évitez les prestataires qui refusent la communication en vidéo</li><li>Prévoyez un budget "imprévu" de 15% (non 10%) — les imprévus à distance sont plus fréquents</li></ul><h2>Les outils numériques à adopter</h2><p>Utilisez un Google Drive partagé pour centraliser tous les contrats, devis et confirmations. Un tableau Trello ou Notion pour le suivi des tâches. Et bien sûr, la plateforme Farah.ma pour trouver, comparer et contacter des prestataires vérifiés au Maroc.</p>',
                'featuredImage' => 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80',
                'category' => $culture,
                'tags' => ['conseils', 'mre', 'organisation', 'distance'],
                'publishedAt' => '2026-03-15',
            ],
        ];
    }
}
