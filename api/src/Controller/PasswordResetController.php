<?php

namespace App\Controller;

use App\Service\PasswordResetService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
class PasswordResetController extends AbstractController
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService,
    ) {
    }

    /**
     * Initiates a password reset by sending a reset link to the given email.
     * Always returns 200 — never reveals whether the email is registered.
     */
    #[Route('/forgot-password', name: 'auth_forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $email = $data['email'] ?? null;

        if (empty($email)) {
            return $this->json(['error' => 'Email is required.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->passwordResetService->initiateReset((string) $email);

        return $this->json(['message' => 'Si ce compte existe, un email de réinitialisation a été envoyé.']);
    }

    /**
     * Resets the user password using a valid reset token.
     */
    #[Route('/reset-password', name: 'auth_reset_password', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;

        if (empty($token) || empty($password)) {
            return $this->json(['error' => 'Token and password are required.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $this->passwordResetService->resetPassword((string) $token, (string) $password);
        } catch (\InvalidArgumentException) {
            return $this->json(['error' => 'Lien invalide ou expiré.'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}
