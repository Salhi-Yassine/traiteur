<?php

namespace App\Story;

use Zenstruck\Foundry\Story;
use App\Factory\ReviewFactory;

final class DefaultReviewsStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        ReviewFactory::createMany(200);
    }
}
