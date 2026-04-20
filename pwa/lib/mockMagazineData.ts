// Mock data for magazine testing

export const mockArticleCategories = [
    {
        id: 1,
        name: "Traditions",
        slug: "traditions",
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M20 3a4 4 0 0 1-4 4"/><circle cx="18" cy="5" r="1.5" fill="currentColor"/></svg>',
    },
    {
        id: 2,
        name: "Mode & Beauté",
        slug: "mode-beaute",
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    },
    {
        id: 3,
        name: "Budget & Planning",
        slug: "budget-planning",
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
    },
    {
        id: 4,
        name: "Gastronomie",
        slug: "gastronomie",
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>',
    },
];

export const mockVendors = [
    {
        id: 101,
        slug: "negafa-dar-el-makhzen",
        businessName: "Négafa Dar El Makhzen",
        category: { name: "Négafa", slug: "negafa" },
        coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=60",
        isVerified: true,
        averageRating: 4.9,
    },
    {
        id: 102,
        slug: "traiteur-el-bahia",
        businessName: "Traiteur El Bahia",
        category: { name: "Catering", slug: "catering" },
        coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&q=60",
        isVerified: true,
        averageRating: 4.8,
    },
];

const LONG_CONTENT = `<p>Au cœur de chaque mariage marocain se trouve une figure incontournable : <strong>la Negafa</strong>. Plus qu'une simple habilleuse, elle est la gardienne des traditions, l'architecte de l'image de la mariée et la chef d'orchestre des changements de tenues.</p><h2>Le rôle de la Negafa</h2><p>La Negafa est responsable de l'ensemble du parcours de la mariée lors de la nuit du mariage. Elle gère les transitions entre les différentes <em>lbssat</em> (tenues), supervise les accessoires comme la <em>taaj</em> (couronne) et le <em>ceinturon</em>, et s'assure que chaque entrée est mémorable.</p><p>Ce rôle ancestral demande une expertise exceptionnelle, transmise de génération en génération dans les familles de Négafas reconnues.</p><h2>Timing typique d'une nuit de mariage</h2><p>La Negafa coordonne généralement ses interventions selon un timing précis. L'habillage commence en général 3 à 4 heures avant l'arrivée des invités. Les changements de tenues se font toutes les 45 à 90 minutes pendant la soirée.</p><h2>Tarifs en 2026</h2><p>Les tarifs varient selon la ville et la renommée de la Negafa :</p><ul><li><strong>Casablanca / Rabat :</strong> 4 000 à 12 000 MAD pour la nuit</li><li><strong>Marrakech :</strong> 5 000 à 15 000 MAD</li><li><strong>Fès :</strong> 3 500 à 9 000 MAD</li></ul><p>Ces tarifs incluent généralement l'habillage, les accessoires de cérémonie (couronne, ceinturon, éventail) et la coordination des entrées.</p>`;

export const mockArticles = [
    {
        id: 1,
        slug: "guide-complet-de-la-negafa",
        title: "Guide complet de la Negafa : rôle, timing et tarifs en 2026",
        excerpt: "La Negafa est l'âme du mariage marocain. Découvrez tout ce que vous devez savoir pour bien choisir la vôtre.",
        content: LONG_CONTENT,
        featuredImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        category: mockArticleCategories[0],
        publishedAt: "2026-04-10T10:00:00Z",
        createdAt: "2026-04-10T10:00:00Z",
        tags: ["negafa", "traditions"],
        readingTimeMinutes: 5,
        widgetType: null,
        isFeatured: true,
        featuredOrder: 1,
        author: { id: 1, firstName: "Sarah", lastName: "Bennani", email: "sarah@farah.ma" },
        relatedVendors: [mockVendors[0]],
    },
    {
        id: 2,
        slug: "le-guide-du-hamlou-parfait",
        title: "Le guide du Hamlou parfait : quantités et astuces de traiteurs vérifiés",
        excerpt: "Thé à la menthe, sellou, chebakia : combien prévoir exactement ? Nos traiteurs dévoilent leurs standards.",
        content: `<p>Le <strong>Hamlou</strong> — dans sa définition large — désigne tout le service de thé et de pâtisseries traditionnelles qui accompagne les cérémonies marocaines.</p>${LONG_CONTENT}`,
        featuredImage: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80",
        category: mockArticleCategories[3],
        publishedAt: "2026-04-16T10:00:00Z",
        createdAt: "2026-04-16T10:00:00Z",
        tags: ["catering", "traiteur", "hamlou"],
        readingTimeMinutes: 6,
        widgetType: "hamlau",
        isFeatured: true,
        featuredOrder: 2,
        author: { id: 2, firstName: "Ahmed", lastName: "El Ouali", email: "ahmed@farah.ma" },
        relatedVendors: [mockVendors[1]],
    },
    {
        id: 3,
        slug: "budget-mariage-au-maroc",
        title: "Budget mariage au Maroc : répartition type pour 150 invités",
        excerpt: "Combien coûte vraiment un mariage au Maroc ? On détaille poste par poste.",
        content: LONG_CONTENT,
        featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
        category: mockArticleCategories[2],
        publishedAt: "2026-04-15T10:00:00Z",
        createdAt: "2026-04-15T10:00:00Z",
        tags: ["budget", "planning"],
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
    relatedArticles: [mockArticles[0], mockArticles[2]],
};
