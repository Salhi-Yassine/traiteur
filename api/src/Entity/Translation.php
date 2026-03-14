<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Translatable\Entity\MappedSuperclass\AbstractTranslation;
use Gedmo\Translatable\Entity\Repository\TranslationRepository;

/**
 * @ORM\Table(
 *     name="ext_translations",
 *     indexes={
 *         @ORM\Index(name="translations_lookup_idx", columns={"locale", "object_class", "foreign_key"}),
 *         @ORM\Index(name="translations_field_idx", columns={"field", "object_class", "foreign_key"})
 *     }
 * )
 * @ORM\Entity(repositoryClass="Gedmo\Translatable\Entity\Repository\TranslationRepository")
 */
#[ORM\Table(name: 'ext_translations')]
#[ORM\Index(name: 'translations_lookup_idx', columns: ['locale', 'object_class', 'foreign_key'])]
#[ORM\Index(name: 'translations_field_idx', columns: ['field', 'object_class', 'foreign_key'])]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class Translation extends AbstractTranslation
{
    /**
     * All required columns are inherited from the abstract class.
     */
}
