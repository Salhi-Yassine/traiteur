<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260419194246 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ALTER is_featured DROP DEFAULT');
        $this->addSql('ALTER TABLE article ALTER tags DROP DEFAULT');
        $this->addSql('ALTER TABLE wedding_story ALTER is_featured DROP DEFAULT');
        $this->addSql('ALTER TABLE wedding_story ALTER color_palette DROP DEFAULT');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ALTER is_featured SET DEFAULT false');
        $this->addSql('ALTER TABLE article ALTER tags SET DEFAULT \'[]\'');
        $this->addSql('ALTER TABLE wedding_story ALTER is_featured SET DEFAULT false');
        $this->addSql('ALTER TABLE wedding_story ALTER color_palette SET DEFAULT \'[]\'');
    }
}
