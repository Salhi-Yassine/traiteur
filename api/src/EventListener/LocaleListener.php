<?php

declare(strict_types=1);

namespace App\EventListener;

use Gedmo\Translatable\TranslatableListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Sets the Gedmo Translatable locale from the request's Accept-Language header.
 *
 * Supported locales: fr (default), ar, ary (Moroccan Darija), en.
 * Falls back to 'fr' for any unrecognised locale.
 *
 * The frontend passes the active Next.js router.locale as the Accept-Language header.
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 100)]
class LocaleListener
{
    private const SUPPORTED_LOCALES = ['fr', 'ar', 'ary', 'en'];
    private const DEFAULT_LOCALE    = 'fr';

    public function __construct(private TranslatableListener $translatableListener) {}

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        // Accept-Language: ary, ar;q=0.9, fr;q=0.8
        // Symfony's getPreferredLanguage finds the best match from supported list.
        $locale = $request->getPreferredLanguage(self::SUPPORTED_LOCALES) ?? self::DEFAULT_LOCALE;

        // Tell Symfony about the locale
        $request->setLocale($locale);

        // Tell Gedmo which locale to use when hydrating entities
        $this->translatableListener->setTranslatableLocale($locale);

        // Always fall back to the value in the main table if a translation is missing
        $this->translatableListener->setTranslationFallback(true);
        $this->translatableListener->setDefaultLocale(self::DEFAULT_LOCALE);

        error_log(sprintf(
            '[LocaleListener] Request: %s %s | Locale set to: %s | Accept-Language: %s | Listener Hash: %s',
            $request->getMethod(),
            $request->getRequestUri(),
            $locale,
            $request->headers->get('Accept-Language', 'NONE'),
            spl_object_hash($this->translatableListener)
        ));
    }

    #[AsEventListener(event: KernelEvents::RESPONSE)]
    public function onKernelResponse(\Symfony\Component\HttpKernel\Event\ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $response->setVary('Accept-Language', false); // false means 'don't replace, just add'
    }
}
