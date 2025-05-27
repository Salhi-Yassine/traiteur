<?php

namespace App\Entity;

use ApiPlatform\Elasticsearch\State\CollectionProvider;
use ApiPlatform\Elasticsearch\State\ItemProvider;
use ApiPlatform\Elasticsearch\State\Options;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(provider: CollectionProvider::class, stateOptions: new Options(index: 'user')),
        new Get(provider: ItemProvider::class, stateOptions: new Options(index: 'user')),
    ],
)]
class User
{
    
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'SEQUENCE')]
    #[ApiProperty(identifier: true)]
    public string $id = '';


    #[ORM\Column]
    #[Assert\NotBlank]
    public string $firstName;

    #[ORM\Column]
    #[Assert\NotBlank]
    public string $lastName;
}