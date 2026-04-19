<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260419002303 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE INDEX idx_quote_status ON quote_request (status)');
        $this->addSql('CREATE INDEX idx_quote_created ON quote_request (created_at)');
        $this->addSql('ALTER INDEX idx_d478271b568fc6df RENAME TO idx_quote_vendor_profile');
        $this->addSql('ALTER INDEX idx_d478271b19eb6921 RENAME TO idx_quote_client');
        $this->addSql('CREATE INDEX idx_review_created ON review (created_at)');
        $this->addSql('ALTER TABLE "user" ALTER phone TYPE VARCHAR(20)');
        $this->addSql('ALTER TABLE vendor_profile ALTER min_guests DROP DEFAULT');
        $this->addSql('ALTER TABLE vendor_profile ALTER min_guests TYPE SMALLINT USING min_guests::SMALLINT');
        $this->addSql('ALTER TABLE vendor_profile ALTER max_guests DROP DEFAULT');
        $this->addSql('ALTER TABLE vendor_profile ALTER max_guests TYPE SMALLINT USING max_guests::SMALLINT');
        $this->addSql('ALTER TABLE vendor_profile ALTER whatsapp TYPE VARCHAR(20)');
        $this->addSql('CREATE INDEX idx_vendor_profile_avg_rating ON vendor_profile (average_rating)');
        $this->addSql('CREATE INDEX idx_vendor_profile_review_count ON vendor_profile (review_count)');
        $this->addSql('CREATE INDEX idx_vendor_profile_created ON vendor_profile (created_at)');
        $this->addSql('CREATE INDEX idx_vendor_profile_verified ON vendor_profile (is_verified)');
        $this->addSql('CREATE INDEX idx_wedding_profile_user ON wedding_profile (user_id)');
        $this->addSql('CREATE INDEX idx_wedding_profile_slug ON wedding_profile (slug)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX idx_quote_status');
        $this->addSql('DROP INDEX idx_quote_created');
        $this->addSql('ALTER INDEX idx_quote_client RENAME TO idx_d478271b19eb6921');
        $this->addSql('ALTER INDEX idx_quote_vendor_profile RENAME TO idx_d478271b568fc6df');
        $this->addSql('DROP INDEX idx_review_created');
        $this->addSql('ALTER TABLE "user" ALTER phone TYPE VARCHAR(30)');
        $this->addSql('DROP INDEX idx_vendor_profile_avg_rating');
        $this->addSql('DROP INDEX idx_vendor_profile_review_count');
        $this->addSql('DROP INDEX idx_vendor_profile_created');
        $this->addSql('DROP INDEX idx_vendor_profile_verified');
        $this->addSql('ALTER TABLE vendor_profile ALTER whatsapp TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE vendor_profile ALTER min_guests TYPE VARCHAR(20)');
        $this->addSql('ALTER TABLE vendor_profile ALTER max_guests TYPE VARCHAR(20)');
        $this->addSql('DROP INDEX idx_wedding_profile_user');
        $this->addSql('DROP INDEX idx_wedding_profile_slug');
    }
}
