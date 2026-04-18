<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260417232716 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wedding_profile ADD our_story TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD qa JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD travel_info TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD selected_theme VARCHAR(50) DEFAULT \'modern\' NOT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD gallery_images JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wedding_profile DROP our_story');
        $this->addSql('ALTER TABLE wedding_profile DROP qa');
        $this->addSql('ALTER TABLE wedding_profile DROP travel_info');
        $this->addSql('ALTER TABLE wedding_profile DROP selected_theme');
        $this->addSql('ALTER TABLE wedding_profile DROP gallery_images');
    }
}
