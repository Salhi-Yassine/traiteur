<?php

namespace App\Service;

use App\Entity\WeddingProfile;

class ConsensusMatchService
{
    /**
     * Calculates a consensus match score (0-100) between two partners.
     * In V1, this compares the 'stylePersona' string and 'quizResults' JSON.
     */
    public function calculateMatchScore(WeddingProfile $wp): int
    {
        // If only one partner has answered the quiz, we can't calculate a consensus
        // For now, let's assume quizResults stores an array of preferences
        $quizResults = $wp->getQuizResults();

        if (!$quizResults || !isset($quizResults['partner1']) || !isset($quizResults['partner2'])) {
            return 85; // Default "high compatibility" placeholder for demo if partial data
        }

        $p1 = $quizResults['partner1'];
        $p2 = $quizResults['partner2'];

        $totalQuestions = count($p1);
        if (0 === $totalQuestions) {
            return 0;
        }

        $matches = 0;
        foreach ($p1 as $key => $value) {
            if (isset($p2[$key]) && $p2[$key] === $value) {
                ++$matches;
            }
        }

        return (int) (($matches / $totalQuestions) * 100);
    }

    /**
     * Identifies "Golden Match" categories where both partners agree.
     */
    public function getConsensusStyles(WeddingProfile $wp): array
    {
        $quizResults = $wp->getQuizResults();
        if (!$quizResults || !isset($quizResults['partner1']) || !isset($quizResults['partner2'])) {
            return [$wp->getStylePersona() ?? 'Traditional'];
        }

        $p1 = $quizResults['partner1'];
        $p2 = $quizResults['partner2'];

        $styles = [];
        foreach ($p1 as $key => $value) {
            if (isset($p2[$key]) && $p2[$key] === $value) {
                $styles[] = $value;
            }
        }

        return array_unique($styles);
    }
}
