<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;

/**
 * Cross-tenant scoping for the QuoteRequest collection.
 *
 * `GET /api/quote_requests` must return only requests the caller sent (as the
 * client) or received (as the owner of the target vendor profile) — never
 * another tenant's. Verifies both viewer roles and isolation.
 */
class QuoteRequestScopeTest extends ApiTestCase
{
    private function registerCouple(Client $client): string
    {
        $email = 'quote'.uniqid().'@example.com';
        $client->request('POST', '/api/users', [
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => $email,
                'firstName' => 'Quote',
                'lastName' => 'Client',
                'plainPassword' => 'password123',
                'userType' => 'couple',
            ],
        ]);
        $this->assertResponseStatusCodeSame(201);

        return $client->request('POST', '/auth', [
            'json' => ['email' => $email, 'password' => 'password123'],
        ])->toArray()['token'];
    }

    private function login(Client $client, string $email, string $password): string
    {
        return $client->request('POST', '/auth', [
            'json' => ['email' => $email, 'password' => $password],
        ])->toArray()['token'];
    }

    public function testCollectionShowsClientAndVendorButNotOtherTenants(): void
    {
        $client = static::createClient();

        // Seeded vendor account + the profile it owns.
        $vendorToken = $this->login($client, 'traiteur.royal@farah.ma', 'password');
        $me = $client->request('GET', '/api/me', [
            'auth_bearer' => $vendorToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ])->toArray();
        // /api/me serialises vendorProfile as an IRI string (or an object with @id)
        $vendorProfileIri = is_array($me['vendorProfile']) ? $me['vendorProfile']['@id'] : $me['vendorProfile'];

        // Couple A sends a request to that vendor.
        $coupleA = $this->registerCouple($client);
        $created = $client->request('POST', '/api/quote_requests', [
            'auth_bearer' => $coupleA,
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'eventType' => 'Wedding',
                'eventDate' => '2027-06-15T00:00:00+00:00',
                'guestCount' => 120,
                'message' => 'Bonjour, nous aimerions un devis pour notre mariage.',
                'vendorProfile' => $vendorProfileIri,
            ],
        ]);
        $this->assertResponseStatusCodeSame(201);
        $requestIri = $created->toArray()['@id'];

        // Client (couple A) sees their own request.
        $idsA = array_column(
            $client->request('GET', '/api/quote_requests', [
                'auth_bearer' => $coupleA,
                'headers' => ['Accept' => 'application/ld+json'],
            ])->toArray()['member'],
            '@id',
        );
        $this->assertContains($requestIri, $idsA);

        // Vendor (owner of the target profile) sees the received request.
        $idsVendor = array_column(
            $client->request('GET', '/api/quote_requests', [
                'auth_bearer' => $vendorToken,
                'headers' => ['Accept' => 'application/ld+json'],
            ])->toArray()['member'],
            '@id',
        );
        $this->assertContains($requestIri, $idsVendor);

        // An unrelated couple sees nothing of it.
        $coupleB = $this->registerCouple($client);
        $idsB = array_column(
            $client->request('GET', '/api/quote_requests', [
                'auth_bearer' => $coupleB,
                'headers' => ['Accept' => 'application/ld+json'],
            ])->toArray()['member'],
            '@id',
        );
        $this->assertNotContains($requestIri, $idsB);
    }
}
