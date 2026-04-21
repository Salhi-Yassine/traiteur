// Mock data for magazine testing — Enhanced for Premium UI/UX
import { Article, ArticleCategory, RelatedVendor } from "@/types/magazine";

export const mockArticleCategories: ArticleCategory[] = [
    {
        id: 1,
        name: "Traditions",
        slug: "traditions",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M20 3a4 4 0 0 1-4 4"/><circle cx="18" cy="5" r="1.5" fill="currentColor"/></svg>`,
    },
    {
        id: 2,
        name: "Mode & Beauté",
        slug: "mode-beaute",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    },
    {
        id: 3,
        name: "Budget & Planning",
        slug: "budget-planning",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    },
    {
        id: 4,
        name: "Gastronomie",
        slug: "gastronomie",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>`,
    },
    {
        id: 5,
        name: "Voyages",
        slug: "voyages",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`,
    },
    {
        id: 6,
        name: "Fleurs & Déco",
        slug: "decoration",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 16.5c0-4.5 4.5-4.5 4.5-4.5s0-4.5-4.5-4.5-4.5 4.5-4.5 4.5 4.5 4.5 4.5 4.5Z"/><path d="M12 16.5c0 4.5-4.5 4.5-4.5 4.5s-4.5 0-4.5-4.5 4.5-4.5 4.5-4.5-4.5-4.5-4.5-4.5"/><path d="M7.5 12c-4.5 0-4.5-4.5-4.5-4.5s4.5-4.5 4.5-4.5 4.5 0 4.5 4.5-4.5 4.5-4.5 4.5Z"/></svg>`,
    },
];

export const mockVendors: RelatedVendor[] = [
    {
        id: 101,
        slug: "negafa-dar-el-makhzen",
        businessName: "Négafa Dar El Makhzen",
        category: { name: "Négafa", slug: "negafa" },
        coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400",
        isVerified: true,
        averageRating: 4.9,
    },
    {
        id: 102,
        slug: "traiteur-el-bahia",
        businessName: "Traiteur El Bahia",
        category: { name: "Traiteur", slug: "catering" },
        coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400",
        isVerified: true,
        averageRating: 4.8,
    },
    {
        id: 103,
        slug: "palais-namaskar",
        businessName: "Palais Namaskar",
        category: { name: "Salles", slug: "salles" },
        coverImageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400",
        isVerified: true,
        averageRating: 5.0,
    },
];

const CONTENT_PLACEHOLDER = `
    <p>L'organisation d'un mariage au Maroc est une symphonie de traditions séculaires et de modernité éclatante. De la cérémonie du henné au défilé des caftans, chaque détail compte pour faire de cette journée un moment inoubliable.</p>
    <h2>Pourquoi c'est un choix crucial</h2>
    <p>Le secret d'une célébration réussie réside dans l'harmonie entre vos envies et l'expertise de vos artisans. Qu'il s'agisse du traiteur qui ravira vos convives ou de la Négafa qui sublimera votre allure, chaque choix doit être mûrement réfléchi.</p>
    <blockquote>« Le mariage n'est pas seulement l'union de deux personnes, c'est la fusion de deux familles et l'expression d'un patrimoine vivant. »</blockquote>
    <p>Dans ce guide, nous explorons les tendances 2026 qui redéfinissent le luxe et l'authenticité pour les futurs mariés.</p>
    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" alt="Mariage Marocain" />
    <h2>Les critères essentiels à vérifier</h2>
    <h3>L'expérience et le portefeuille</h3>
    <p>Une expérience d'au moins 5 ans est recommandée. Demandez systématiquement un portfolio complet avec des références vérifiables. Les avis Google et les recommandations de bouche-à-oreille restent les meilleurs indicateurs.</p>
    <h3>La disponibilité et le réseau</h3>
    <p>Une bonne prestataire bien connectée collabore avec les meilleurs fournisseurs et peut vous négocier des tarifs préférentiels pour les accessoires, caftans et bijoux.</p>
    <h2>Les étapes clés du planning</h2>
    <ul>
        <li>Définition de la vision et du budget (12 mois avant)</li>
        <li>Réservation du lieu et du traiteur d'exception (10 mois avant)</li>
        <li>Sélection de la Négafa et création des caftans sur mesure (8 mois avant)</li>
        <li>Organisation du voyage de noces (6 mois avant)</li>
    </ul>
    <h2>Tarifs et budgets en 2026</h2>
    <p>Les tarifs varient entre 3 000 et 15 000 MAD selon l'expérience, la région et le standing. Voici une grille indicative basée sur nos sondages auprès de 40 Négafas vérifiées sur Farah.ma.</p>
`;

export const mockArticles: Article[] = [
    {
        id: 1,
        slug: "guide-complet-de-la-negafa",
        title: "Guide complet de la Negafa : rôle, timing et tarifs en 2026",
        excerpt: "La Negafa est l'âme du mariage marocain. Découvrez tout ce que vous devez savoir pour bien choisir la vôtre en 2026.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[0],
        publishedAt: "2026-04-10T10:00:00Z",
        createdAt: "2026-04-10T10:00:00Z",
        tags: ["negafa", "traditions", "planning"],
        readingTimeMinutes: 5,
        widgetType: null,
        isFeatured: true,
        featuredOrder: 1,
        author: { id: 1, firstName: "Sarah", lastName: "Bennani", email: "sarah@farah.ma" },
        relatedVendors: [mockVendors[0]],
        hotspotImages: [
            {
                imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
                alt: "Négafa traditionnelle lors d'un mariage marocain",
                hotspots: [
                    { x: 25, y: 35, label: "Diadème traditionnel en or", vendorSlug: "negafa-dar-el-makhzen", vendorName: "Négafa Dar El Makhzen", category: "Négafa" },
                    { x: 60, y: 55, label: "Caftan brodé en soie", vendorSlug: "negafa-dar-el-makhzen", vendorName: "Négafa Dar El Makhzen", category: "Négafa" },
                ]
            }
        ],
        expertData: {
            name: "Mme Hassania El Moussaoui",
            title: "Grande Négafa",
            yearsExperience: 22,
            avatarUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=200",
            quote: "Une vraie Négafa ne se contentera jamais de vous habiller. Elle vous préparera à porter votre histoire.",
            qa: [
                { question: "Quand faut-il réserver sa Négafa ?", answer: "Idéalement 8 à 12 mois avant la date. Les bonnes Négafas sont réservées très tôt, surtout pour les mois de juin et septembre." },
                { question: "Combien de caftans prévoit-on en général ?", answer: "La tradition veut 3 à 7 caftans selon la durée de la cérémonie. La mariée change généralement toutes les 45 minutes à 1 heure." },
                { question: "La Négafa s'occupe-t-elle aussi de la coiffure ?", answer: "La plupart des Négafas travaillent avec une équipe dédiée incluant une coiffeuse et une maquilleuse. Vérifiez toujours si ce service est inclus dans le forfait." },
            ],
        },
        sponsorData: {
            vendorName: "Négafa Dar El Makhzen",
            vendorSlug: "negafa-dar-el-makhzen",
            tagline: "L'art du mariage marocain depuis 1998. Casablanca, Rabat & Marrakech.",
            coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
            category: "Négafa Certifiée Farah",
            ctaLabel: "Voir les disponibilités",
        },
    },
    {
        id: 2,
        slug: "le-guide-du-hamlou-parfait",
        title: "Le guide du Hamlou parfait : quantités et astuces de traiteurs",
        excerpt: "Thé à la menthe, sellou, chebakia : combien prévoir exactement ? Nos experts dévoilent leurs standards.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[3],
        publishedAt: "2026-04-16T10:00:00Z",
        createdAt: "2026-04-16T10:00:00Z",
        tags: ["catering", "traiteur", "hamlou", "gastronomie"],
        readingTimeMinutes: 6,
        widgetType: "hamlau",
        isFeatured: true,
        featuredOrder: 2,
        author: { id: 2, firstName: "Ahmed", lastName: "El Ouali", email: "ahmed@farah.ma" },
        relatedVendors: [mockVendors[1]],
    },
    {
        id: 3,
        slug: "tendances-caftan-mariee-2026",
        title: "Les 5 tendances Caftan qui vont dominer 2026",
        excerpt: "Du minimalisme chic au retour du brocart impérial, découvrez les silhouettes de demain.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1594553280144-8846c4f74ee4?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[1],
        publishedAt: "2026-04-18T09:00:00Z",
        createdAt: "2026-04-18T09:00:00Z",
        tags: ["fashion", "caftan", "style"],
        readingTimeMinutes: 4,
        widgetType: null,
        isFeatured: true,
        featuredOrder: 3,
        author: { id: 1, firstName: "Sarah", lastName: "Bennani", email: "sarah@farah.ma" },
        relatedVendors: [],
        hotspotImages: [
            {
                imageUrl: "https://images.unsplash.com/photo-1594553280144-8846c4f74ee4?auto=format&fit=crop&q=80&w=1200",
                alt: "Caftan mariée tendance 2026",
                hotspots: [
                    { x: 40, y: 20, label: "Broderie dorée à la main", vendorSlug: "negafa-dar-el-makhzen", vendorName: "Atelier Meriem", category: "Créatrice" },
                    { x: 70, y: 60, label: "Ceinture Mdamma en soie", vendorSlug: "negafa-dar-el-makhzen", vendorName: "Maison Bennani", category: "Accessoires" },
                ]
            }
        ],
    },
    {
        id: 4,
        slug: "budget-mariage-au-maroc",
        title: "Budget mariage au Maroc : répartition type pour 150 invités",
        excerpt: "Combien coûte vraiment un mariage au Maroc ? On détaille poste par poste pour vous aider à planifier.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[2],
        publishedAt: "2026-04-15T11:00:00Z",
        createdAt: "2026-04-15T11:00:00Z",
        tags: ["budget", "planning", "finance"],
        readingTimeMinutes: 7,
        widgetType: null,
        isFeatured: false,
        author: null,
        relatedVendors: [],
    },
    {
        id: 5,
        slug: "lune-de-miel-merzouga-desert",
        title: "Lune de miel à Merzouga : 48h magiques dans le Sahara",
        excerpt: "Dormir sous les étoiles dans un camp de luxe : le guide ultime pour un voyage de noces inoubliable.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[4],
        publishedAt: "2026-04-19T14:30:00Z",
        createdAt: "2026-04-19T14:30:00Z",
        tags: ["travel", "honeymoon", "merzouga"],
        readingTimeMinutes: 8,
        widgetType: null,
        isFeatured: false,
        author: { id: 3, firstName: "Yassine", lastName: "Salhi", email: "yassine@farah.ma" },
        relatedVendors: [],
    },
    {
        id: 6,
        slug: "choisir-son-photographe-mariage",
        title: "Comment choisir le photographe qui saura capturer votre émotion ?",
        excerpt: "Style artistique, portfolio, feeling : les 10 questions à poser impérativement avant de signer.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[1],
        publishedAt: "2026-04-17T16:00:00Z",
        createdAt: "2026-04-17T16:00:00Z",
        tags: ["photography", "planning", "memories"],
        readingTimeMinutes: 6,
        widgetType: null,
        isFeatured: false,
        author: null,
        relatedVendors: [],
    },
    {
        id: 7,
        slug: "decoration-florale-marocaine",
        title: "Art floral : Réinventer le mariage marocain avec des fleurs locales",
        excerpt: "De la fleur d'oranger aux roses de Damas, comment intégrer notre flore dans une déco moderne.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[5],
        publishedAt: "2026-04-14T08:00:00Z",
        createdAt: "2026-04-14T08:00:00Z",
        tags: ["decoration", "flowers", "art"],
        readingTimeMinutes: 5,
        widgetType: null,
        isFeatured: false,
        author: { id: 1, firstName: "Sarah", lastName: "Bennani", email: "sarah@farah.ma" },
        relatedVendors: [],
    },
    {
        id: 8,
        slug: "faire-part-digitaux-maroc",
        title: "Le boom des faire-part digitaux au Maroc : Simple, écolo et chic",
        excerpt: "Pourquoi de plus en plus de couples abandonnent le papier pour des invitations connectées.",
        content: CONTENT_PLACEHOLDER,
        featuredImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200",
        category: mockArticleCategories[2],
        publishedAt: "2026-04-12T12:00:00Z",
        createdAt: "2026-04-12T12:00:00Z",
        tags: ["invitations", "tech", "planning"],
        readingTimeMinutes: 4,
        widgetType: null,
        isFeatured: false,
        author: null,
        relatedVendors: [],
    },
];

export const mockMagazinePageProps = {
    featuredArticle: mockArticles[0],
    initialArticles: mockArticles,
};

export const mockArticleDetailPageProps = {
    article: mockArticles[1],
    relatedArticles: [mockArticles[0], mockArticles[2], mockArticles[3]],
};
