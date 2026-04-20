<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\ArticleCategory;
use App\Entity\Category;
use App\Entity\City;
use App\Entity\InspirationPhoto;
use App\Entity\User;
use App\Entity\WeddingStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class InspirationFixtures extends Fixture implements FixtureGroupInterface
{
    public static function getGroups(): array
    {
        return ['inspiration'];
    }

    public function load(ObjectManager $manager): void
    {
        // 0. Get the master user
        $author = $manager->getRepository(User::class)->findOneBy(['email' => 'masterbrains4ai@gmail.com']);

        // 1. Create Article Categories
        $planningCat = new ArticleCategory();
        $planningCat->setName('Planning Tips');
        $manager->persist($planningCat);

        $styleCat = new ArticleCategory();
        $styleCat->setName('Beauty & Style');
        $manager->persist($styleCat);

        $traditionCat = new ArticleCategory();
        $traditionCat->setName('Moroccan Traditions');
        $manager->persist($traditionCat);

        // 2. Load existing vendor categories and cities (or create if missing)
        $catSalles = $manager->getRepository(Category::class)->findOneBy(['slug' => 'salles']);
        $catNegrafa = $manager->getRepository(Category::class)->findOneBy(['slug' => 'negrafa']);
        $catDecoration = $manager->getRepository(Category::class)->findOneBy(['slug' => 'decoration']);
        $catCatering = $manager->getRepository(Category::class)->findOneBy(['slug' => 'catering']);

        $cityCasablanca = $manager->getRepository(City::class)->findOneBy(['slug' => 'casablanca']);
        $cityMarrakech = $manager->getRepository(City::class)->findOneBy(['slug' => 'marrakech']);

        // 3. Create Articles
        $article1 = new Article();
        $article1->setTitle('Top 5 Tips for Choosing Your Riad Venue');
        $article1->setExcerpt('Planning a wedding in a Riad requires special attention to guest count and acoustics.');
        $article1->setContent('Riads offer an intimate and authentic Moroccan experience. However, when choosing one for your wedding, consider the layout, the central patio capacity, and the noise regulations in the Médina...');
        $article1->setCategory($planningCat);
        if ($author) $article1->setAuthor($author);
        $article1->setIsPublished(true);
        $article1->setPublishedAt(new \DateTimeImmutable());
        $article1->setFeaturedImage('moroccan_wedding_centerpiece'); 
        $article1->setIsFeatured(true);
        $article1->setFeaturedOrder(1);
        $article1->setTags(['#RiadWedding', '#Casablanca', '#Planning101']);
        $manager->persist($article1);

        $article2 = new Article();
        $article2->setTitle('The Art of the Negrafa: What to Expect');
        $article2->setExcerpt('Understand the pivotal role of the Negrafa in a traditional Moroccan wedding.');
        $article2->setContent('The Negrafa is more than just a stylist; she is the guardian of tradition. From the Lebssa Mezgouda to the Amariya entrance, she ensures every moment is majestic...');
        $article2->setCategory($traditionCat);
        if ($author) $article2->setAuthor($author);
        $article2->setIsPublished(true);
        $article2->setPublishedAt(new \DateTimeImmutable());
        $article2->setFeaturedImage('moroccan_bride_negafa');
        $article2->setTags(['#Traditions', '#Negafa', '#Culture']);
        $manager->persist($article2);

        // 4. Create Wedding Stories
        $story1 = new WeddingStory();
        $story1->setCoupleNames('Layla & Mehdi');
        $story1->setLocation('Marrakech');
        $story1->setVibe('Boho Chic Riad');
        $story1->setCoverImage('riad_sunset_wedding');
        $story1->setDescription('An intimate sunset celebration in the heart of the Marrakech Médina. The couple wanted a mix of traditional hospitality and modern bohemian aesthetics.');
        $story1->setGallery([
            'riad_sunset_wedding',
            'moroccan_table_setting',
            'moroccan_wedding_cake'
        ]);
        $story1->setVendorCredits([
            ['role' => 'Venue', 'name' => 'El Fenn Marrakech', 'slug' => 'el-fenn'],
            ['role' => 'Catering', 'name' => 'Gourmet Morocco', 'slug' => 'catering-gourmet'],
        ]);
        $story1->setIsFeatured(true);
        $story1->setStyle('Bohème');
        $story1->setSeason('Autumn');
        $story1->setColorPalette(['#A7D7C5', '#F5F5F5', '#E8472A']);
        $story1->setCelebrationTimeline([
            ['time' => '16:00', 'event' => 'Bridal Preparation', 'description' => 'The Zahra (stylist) begins the intricate hair and makeup in the riad courtyard.'],
            ['time' => '19:30', 'event' => 'Initial Reception', 'description' => 'Guests arrive to the sounds of traditional Dekka Marrakchia and mint tea service.'],
            ['time' => '21:00', 'event' => 'The First Entrance', 'description' => 'The couple enters on the Amaria, heralded by negafa songs and high-energy drumming.'],
            ['time' => '00:00', 'event' => 'Dinner Service', 'description' => 'A traditional three-course Moroccan feast served under the stars.'],
            ['time' => '02:00', 'event' => 'Last Dress (Labssa)', 'description' => 'The bride appears in her final, most grand Lebssa before the couple departs.']
        ]);
        $manager->persist($story1);

        // 5. Create Inspiration Photos
        $images = [
            ['path' => 'moroccan_wedding_centerpiece', 'caption' => 'Golden lanterns and white florals', 'style' => 'Modern'],
            ['path' => 'moroccan_bride_negafa', 'caption' => 'Traditional Fassi bridal set', 'style' => 'Traditional'],
            ['path' => 'moroccan_table_setting', 'caption' => 'Zellige patterned table styling', 'style' => 'Andalou'],
            ['path' => 'moroccan_caftan_detail', 'caption' => 'Handmade Aakad details', 'style' => 'Traditional'],
            ['path' => 'riad_sunset_wedding', 'caption' => 'Floating candles in the riad pool', 'style' => 'Bohème'],
            ['path' => 'moroccan_wedding_cake', 'caption' => 'Arabesque patterned wedding cake', 'style' => 'Modern'],
        ];

        foreach ($images as $img) {
            $photo = new InspirationPhoto();
            $photo->setImagePath($img['path']);
            $photo->setCaption($img['caption']);
            $photo->setStyle($img['style']);
            $photo->setIsApproved(true);
            
            if ($catDecoration && str_contains($img['caption'], 'table')) {
                $photo->setCategory($catDecoration);
            }
            if ($catNegrafa && str_contains($img['caption'], 'bride')) {
                $photo->setCategory($catNegrafa);
            }
            
            $photo->setCity($cityMarrakech);
            $manager->persist($photo);
        }

        $manager->flush();
    }
}
