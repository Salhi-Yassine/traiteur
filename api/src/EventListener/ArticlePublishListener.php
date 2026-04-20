<?php

namespace App\EventListener;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsDoctrineListener(event: Events::postPersist)]
#[AsDoctrineListener(event: Events::postUpdate)]
class ArticlePublishListener
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly ?string $pwaBaseUrl,
        private readonly ?string $revalidateSecret,
    ) {
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->revalidate($args->getObject());
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->revalidate($args->getObject());
    }

    private function revalidate(object $entity): void
    {
        if (!$entity instanceof Article || !$entity->isPublished()) {
            return;
        }

        if (empty($this->pwaBaseUrl) || empty($this->revalidateSecret)) {
            return;
        }

        try {
            $this->httpClient->request('GET', $this->pwaBaseUrl.'/api/revalidate', [
                'query' => [
                    'secret' => $this->revalidateSecret,
                    'paths' => ['/magazine', '/magazine/'.$entity->getSlug()],
                ],
                'timeout' => 3,
            ]);
        } catch (\Throwable) {
            // Non-blocking: ISR revalidation failure must never break a write request
        }
    }
}
