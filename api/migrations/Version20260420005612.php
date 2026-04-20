<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260420005612 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article_vendor_profile (article_id INT NOT NULL, vendor_profile_id INT NOT NULL, PRIMARY KEY (article_id, vendor_profile_id))');
        $this->addSql('CREATE INDEX IDX_391B1EE87294869C ON article_vendor_profile (article_id)');
        $this->addSql('CREATE INDEX IDX_391B1EE8568FC6DF ON article_vendor_profile (vendor_profile_id)');
        $this->addSql('ALTER TABLE article_vendor_profile ADD CONSTRAINT FK_391B1EE87294869C FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE article_vendor_profile ADD CONSTRAINT FK_391B1EE8568FC6DF FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE article_category ADD icon_svg TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_vendor_profile DROP CONSTRAINT FK_391B1EE87294869C');
        $this->addSql('ALTER TABLE article_vendor_profile DROP CONSTRAINT FK_391B1EE8568FC6DF');
        $this->addSql('DROP TABLE article_vendor_profile');
        $this->addSql('ALTER TABLE article_category DROP icon_svg');
    }
}
