import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


interface CategoryFromApi {
  name: string;
  slug: string;
  emoji: string | null;
  vendorCount: number;
}

interface CategoriesPageProps {
  categories: CategoryFromApi[];
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("categories_page.title")} | Farah.ma</title>
        <meta name="description" content={t("categories_page.subtitle")} />
      </Head>

      <div className="bg-[#FEF0ED] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-[40px] md:text-[52px] text-[#1A1A1A] mb-4">
            {t("categories_page.title")}
          </h1>
          <p className="text-[18px] text-[#717171] max-w-2xl mx-auto">
            {t("categories_page.subtitle")}
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/vendors?category.slug=${cat.slug}`}
                className="group relative bg-white border border-[#DDDDDD] rounded-[24px] flex flex-col items-center justify-center gap-4 p-8 min-h-[180px]
                  shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.10)]
                  hover:-translate-y-[2px] transition-all duration-200 ease-out overflow-hidden"
                aria-label={`${cat.name} — ${cat.vendorCount} ${t("home.categories.count_suffix")}`}
              >
                {/* Subtle 6% star pattern bg */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 3l2.5 7.5H30l-6 4.5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6-4.5h7.5z' fill='%23F47C65'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                  }}
                  aria-hidden="true"
                />
                <span className="text-[40px] group-hover:scale-110 transition-transform duration-200 relative z-10" aria-hidden="true">
                  {cat.emoji || '📋'}
                </span>
                <div className="text-center relative z-10">
                  <span className="block text-[16px] font-semibold text-[#1A1A1A] group-hover:text-[#E8472A] transition-colors">
                    {cat.name}
                  </span>
                  <span className="block text-[13px] text-[#717171] mt-1">
                    {cat.vendorCount} {t("home.categories.count_suffix")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ENTRYPOINT || "https://localhost";

    const statsRes = await fetch(`${baseUrl}/api/app_stats`, {
      headers: { 
        Accept: "application/ld+json",
        "Accept-Language": locale || 'fr' 
      }
    });

    let categories: CategoryFromApi[] = [];
    if (statsRes.ok) {
      const stats = await statsRes.json();
      categories = stats.availableCategories || [];
    }

    return {
      props: {
        categories,
        ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
      },
      revalidate: 300
    };
  } catch (err) {
    console.error("Error fetching categories:", err);
    return {
      props: {
        categories: [],
        ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
      },
      revalidate: 60
    };
  }
};
