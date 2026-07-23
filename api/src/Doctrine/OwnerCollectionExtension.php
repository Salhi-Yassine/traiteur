<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\BudgetItem;
use App\Entity\ChecklistTask;
use App\Entity\Guest;
use App\Entity\QuoteRequest;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Scopes owner-private collections to the authenticated user.
 *
 * The single-item `Get` operations on these resources are voter-protected, but
 * their `GetCollection` operations were gated only by `is_granted('ROLE_USER')`
 * — which let any logged-in user list every tenant's rows (a cross-tenant PII
 * leak). This extension constrains each collection to what the current user may
 * see:
 *
 *   - Guest / BudgetItem / ChecklistTask → rows on a wedding the user owns,
 *     partners on, or is an elder of.
 *   - QuoteRequest → requests the user sent (client) or received on a vendor
 *     profile they own.
 *
 * Admins are unscoped. Resources not listed here are untouched (public
 * catalogues like VendorProfile, Category, City stay fully readable).
 */
final class OwnerCollectionExtension implements QueryCollectionExtensionInterface
{
    /** Resources scoped by their wedding's membership (owner / partner / elder). */
    private const WEDDING_OWNED = [Guest::class, BudgetItem::class, ChecklistTask::class];

    public function __construct(private Security $security)
    {
    }

    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = [],
    ): void {
        if (!in_array($resourceClass, self::WEDDING_OWNED, true) && QuoteRequest::class !== $resourceClass) {
            return;
        }

        $user = $this->security->getUser();

        // The collections are ROLE_USER-guarded, so an anonymous request never
        // reaches here; guard defensively anyway rather than leak on misconfig.
        if (!$user instanceof User) {
            $queryBuilder->andWhere('1 = 0');

            return;
        }

        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $ownerParam = $queryNameGenerator->generateParameterName('owner');

        if (in_array($resourceClass, self::WEDDING_OWNED, true)) {
            $weddingAlias = $queryNameGenerator->generateJoinAlias('wedding');
            $queryBuilder
                ->join(sprintf('%s.weddingProfile', $rootAlias), $weddingAlias)
                ->andWhere($queryBuilder->expr()->orX(
                    sprintf('%s.user = :%s', $weddingAlias, $ownerParam),
                    sprintf('%s.partner = :%s', $weddingAlias, $ownerParam),
                    sprintf(':%s MEMBER OF %s.elders', $ownerParam, $weddingAlias),
                ))
                ->setParameter($ownerParam, $user);

            return;
        }

        // QuoteRequest: sent by the user (client) or received on a vendor profile they own.
        $vendorAlias = $queryNameGenerator->generateJoinAlias('vendorProfile');
        $queryBuilder
            ->leftJoin(sprintf('%s.vendorProfile', $rootAlias), $vendorAlias)
            ->andWhere($queryBuilder->expr()->orX(
                sprintf('%s.client = :%s', $rootAlias, $ownerParam),
                sprintf('%s.owner = :%s', $vendorAlias, $ownerParam),
            ))
            ->setParameter($ownerParam, $user);
    }
}
