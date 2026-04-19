<?php

namespace App\Service;

use App\Entity\VendorProfile;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Recalculates averageRating and reviewCount on a VendorProfile
 * after a review is created or deleted.
 */
class ReviewAggregationService
{
    public function __construct(
        private readonly ReviewRepository $reviewRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    public function recalculate(VendorProfile $vendorProfile): void
    {
        $stats = $this->reviewRepository->computeStats($vendorProfile);

        $avg = $stats['avg'] > 0 ? number_format($stats['avg'], 2, '.', '') : null;
        $vendorProfile->setAverageRating($avg);
        $vendorProfile->setReviewCount($stats['count']);

        $this->em->flush();
    }
}
