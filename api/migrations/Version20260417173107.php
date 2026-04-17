<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260417173107 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // guest_token logic
        $this->addSql('ALTER TABLE guest ADD guest_token VARCHAR(64) DEFAULT NULL');
        $this->addSql('UPDATE guest SET guest_token = md5(id::text || random()::text) WHERE guest_token IS NULL');
        $this->addSql('ALTER TABLE guest ALTER COLUMN guest_token SET NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_ACB79A354AC9362F ON guest (guest_token)');

        // slug logic
        $this->addSql('ALTER TABLE wedding_profile ADD slug VARCHAR(255) DEFAULT NULL');
        $this->addSql('UPDATE wedding_profile SET slug = LOWER(bride_name || \'-\' || groom_name || \'-\' || id) WHERE slug IS NULL');
        $this->addSql('ALTER TABLE wedding_profile ALTER COLUMN slug SET NOT NULL');
        
        $this->addSql('ALTER TABLE wedding_profile ADD venue_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD venue_address VARCHAR(500) DEFAULT NULL');
        $this->addSql('ALTER TABLE wedding_profile ADD cover_image VARCHAR(255) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_EB6634A2989D9B62 ON wedding_profile (slug)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_ACB79A354AC9362F');
        $this->addSql('ALTER TABLE guest DROP guest_token');
        $this->addSql('DROP INDEX UNIQ_EB6634A2989D9B62');
        $this->addSql('ALTER TABLE wedding_profile DROP slug');
        $this->addSql('ALTER TABLE wedding_profile DROP venue_name');
        $this->addSql('ALTER TABLE wedding_profile DROP venue_address');
        $this->addSql('ALTER TABLE wedding_profile DROP cover_image');
    }
}
