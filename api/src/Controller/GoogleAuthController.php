<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Handles Google OAuth 2.0 sign-in.
 *
 * Flow:
 *   1. GET /auth/google          → redirect to Google consent screen
 *   2. GET /auth/google/callback → exchange code, find/create user, issue JWT
 *                                  then redirect to {FRONTEND_URL}/auth/callback?token=JWT
 */
class GoogleAuthController extends AbstractController
{
    public function __construct(
        private readonly ClientRegistry $clientRegistry,
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
        private readonly JWTTokenManagerInterface $jwtManager,
        private readonly UserPasswordHasherInterface $hasher,
        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string $frontendUrl,
    ) {
    }

    /** Redirect the browser to Google's OAuth consent screen. */
    #[Route('/auth/google', name: 'auth_google_connect', methods: ['GET'])]
    public function connect(): RedirectResponse
    {
        return $this->clientRegistry
            ->getClient('google')
            ->redirect(['email', 'profile'], []);
    }

    /**
     * Google sends the user back here after consent.
     * We find or create the local User, issue a Lexik JWT, then redirect to the
     * Next.js frontend with the token in the query string so the PWA can store it.
     */
    #[Route('/auth/google/callback', name: 'auth_google_callback', methods: ['GET'])]
    public function callback(Request $request): Response
    {
        try {
            /** @var \League\OAuth2\Client\Provider\GoogleUser $googleUser */
            $googleUser = $this->clientRegistry
                ->getClient('google')
                ->fetchUser();
        } catch (\Exception $e) {
            // Pass the error message to the frontend callback so it's visible during dev
            return new RedirectResponse(
                $this->frontendUrl.'/auth/callback?error='.urlencode($e->getMessage())
            );
        }

        try {
            $googleId = $googleUser->getId();
            $email = $googleUser->getEmail();
            $firstName = $googleUser->getFirstName() ?? explode('@', $email)[0];
            $lastName = $googleUser->getLastName() ?? '';

            // 1. Try to find an existing account by Google ID
            $user = $this->userRepository->findOneBy(['googleId' => $googleId]);

            // 2. Fall back to matching by email (user previously registered with email/password)
            if (null === $user && $email) {
                $user = $this->userRepository->findOneBy(['email' => $email]);
            }

            // 3. No existing account → create one (couple by default)
            if (null === $user) {
                $user = new User();
                $user->setEmail($email ?? throw new \RuntimeException('Google did not return an email.'));
                $user->setFirstName($firstName);
                $user->setLastName($lastName ?: $firstName);
                $user->setUserType(User::TYPE_COUPLE);
                $user->setIsVerified(true);
                // Set a random unguessable password so email/password login is impossible
                $placeholder = $this->hasher->hashPassword($user, bin2hex(random_bytes(32)));
                $user->setPassword($placeholder);
            }

            // Always link the Google ID so future logins use path 1 (faster lookup)
            if (null === $user->getGoogleId()) {
                $user->setGoogleId($googleId);
            }

            $this->em->persist($user);
            $this->em->flush();

            $token = $this->jwtManager->create($user);

            return new RedirectResponse(
                $this->frontendUrl.'/auth/callback?token='.urlencode($token)
            );
        } catch (\Exception $e) {
            return new RedirectResponse(
                $this->frontendUrl.'/auth/callback?error='.urlencode($e->getMessage())
            );
        }
    }
}
