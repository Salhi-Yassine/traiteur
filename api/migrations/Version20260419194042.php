<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260419194042 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD is_featured BOOLEAN DEFAULT FALSE NOT NULL');
        $this->addSql('ALTER TABLE article ADD featured_order INT DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD tags JSON DEFAULT \'[]\' NOT NULL');
        $this->addSql('ALTER TABLE wedding_story ADD is_featured BOOLEAN DEFAULT FALSE NOT NULL');
        $this->addSql('ALTER TABLE wedding_story ADD style VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_story ADD season VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_story ADD color_palette JSON DEFAULT \'[]\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article DROP is_featured');
        $this->addSql('ALTER TABLE article DROP featured_order');
        $this->addSql('ALTER TABLE article DROP tags');
        $this->addSql('ALTER TABLE wedding_story DROP is_featured');
        $this->addSql('ALTER TABLE wedding_story DROP style');
        $this->addSql('ALTER TABLE wedding_story DROP season');
        $this->addSql('ALTER TABLE wedding_story DROP color_palette');
    }
}
