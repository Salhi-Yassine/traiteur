<?php

namespace App\Service;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class PasswordResetService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
        private readonly MailerInterface $mailer,
        private readonly Environment $twig,
        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string $frontendUrl,
    ) {
    }

    /**
     * Initiates a password reset for the given email.
     * Always returns silently — never reveals whether the email is registered.
     */
    public function initiateReset(string $email): void
    {
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (null === $user) {
            return;
        }

        $token = bin2hex(random_bytes(32));
        $user->setPasswordResetToken($token);
        $user->setPasswordResetTokenExpiresAt(new \DateTimeImmutable('+1 hour'));
        $this->em->flush();

        $resetUrl = $this->frontendUrl.'/auth/reset-password?token='.$token;

        $html = $this->twig->render('emails/reset_password.html.twig', [
            'firstName' => $user->getFirstName(),
            'resetUrl' => $resetUrl,
        ]);

        $message = (new Email())
            ->from(new Address('noreply@farah.ma', 'Farah.ma'))
            ->to($user->getEmail())
            ->subject('Réinitialisation de votre mot de passe — Farah.ma')
            ->html($html);

        $this->mailer->send($message);
    }

    /**
     * Applies a password reset using the provided token and new password.
     *
     * @throws \InvalidArgumentException if the token is invalid or expired
     */
    public function resetPassword(string $token, string $newPassword): void
    {
        $user = $this->userRepository->findOneByResetToken($token);

        if (null === $user || $user->getPasswordResetTokenExpiresAt() < new \DateTimeImmutable()) {
            throw new \InvalidArgumentException('Invalid or expired token.');
        }

        $user->setPlainPassword($newPassword);
        $user->setPasswordResetToken(null);
        $user->setPasswordResetTokenExpiresAt(null);
        $this->em->flush();
    }
}
