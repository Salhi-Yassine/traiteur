<?php

namespace App\Story;

use Zenstruck\Foundry\Story;
use App\Factory\BookFactory;

final class DefaultBooksStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        BookFactory::createMany(100);
    }
}
