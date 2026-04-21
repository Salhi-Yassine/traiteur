import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface Topic {
  name: string;
  slug: string;
  image: string;
}

interface TopicGridProps {
  topics?: Topic[];
  className?: string;
}

const DEFAULT_TOPICS: Topic[] = [
  { name: 'Planning 101', slug: 'planning-101', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400' },
  { name: 'Tradition', slug: 'tradition', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1594553280144-8846c4f74ee4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1481325548572-351aaec5464e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Real Weddings', slug: 'real-weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400' },
  { name: 'Honeymoon', slug: 'honeymoon', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=400' },
];

export default function TopicGrid({ topics = DEFAULT_TOPICS, className }: TopicGridProps) {
  const { t } = useTranslation('common');

  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl text-neutral-900 mb-2">
            {t('magazine.popular_topics')}
          </h2>
          <p className="text-15 text-neutral-500 max-w-lg">
            {t('magazine.popular_topics_desc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 md:gap-12">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
          >
            <Link 
              href={`/magazine?category=${topic.slug}`}
              className="group flex flex-col items-center gap-6 text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05, translateY: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 shadow-sm group-hover:shadow-md"
              >
                <img 
                  src={topic.image} 
                  alt={topic.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </motion.div>
              <span className="font-bold text-14 text-neutral-700 group-hover:text-primary transition-colors">
                {topic.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
