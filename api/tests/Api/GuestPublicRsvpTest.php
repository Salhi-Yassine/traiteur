<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;

/**
 * Security coverage for the no-login RSVP surface.
 *
 * `GET`/`PATCH /api/public/guests/{guestToken}` have no `security:` attribute by
 * design — the unguessable 32-char token *is* the credential. These tests pin
 * that contract: a valid token reads/writes without auth, and a malformed or
 * unknown token is rejected rather than leaking or mutating data.
 */
class GuestPublicRsvpTest extends ApiTestCase
{
    /** Logs in the seeded couple and returns a JWT. */
    private function coupleToken(Client $client): string
    {
        $response = $client->request('POST', '/auth', [
            'json' => ['email' => 'couple@farah.ma', 'password' => 'password'],
        ]);
        $this->assertResponseIsSuccessful();

        return $response->toArray()['token'];
    }

    /** @return array{token: string, iri: string} the first seeded guest */
    private function firstGuest(Client $client, string $jwt): array
    {
        $response = $client->request('GET', '/api/guests', [
            'auth_bearer' => $jwt,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $this->assertResponseIsSuccessful();

        $members = $response->toArray()['member'];
        $this->assertNotEmpty($members, 'Fixtures must seed at least one guest');

        return ['token' => $members[0]['guestToken'], 'iri' => $members[0]['@id']];
    }

    public function testPublicReadWithValidTokenNeedsNoAuth(): void
    {
        $client = static::createClient();
        $guest = $this->firstGuest($client, $this->coupleToken($client));

        // No auth_bearer — the token alone must grant read access
        $response = $client->request('GET', '/api/public/guests/'.$guest['token'], [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('fullName', $data);
        $this->assertArrayHasKey('rsvpStatus', $data);
        // The public projection must NOT expose internal-only fields
        $this->assertArrayNotHasKey('tableNumber', $data);
        $this->assertArrayNotHasKey('invitationSent', $data);
    }

    public function testPublicReadWithUnknownButWellFormedTokenIs404(): void
    {
        $client = static::createClient();

        // 32 hex chars — matches the route requirement but no such guest
        $client->request('GET', '/api/public/guests/'.str_repeat('a', 32), [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseStatusCodeSame(404);
    }

    public function testPublicReadWithMalformedTokenIsNotFound(): void
    {
        $client = static::createClient();

        // Too short for the {16,64} route requirement → route does not match
        $client->request('GET', '/api/public/guests/short', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseStatusCodeSame(404);
    }

    public function testPublicPatchUpdatesRsvpWithoutAuth(): void
    {
        $client = static::createClient();
        $guest = $this->firstGuest($client, $this->coupleToken($client));

        $response = $client->request('PATCH', '/api/public/guests/'.$guest['token'], [
            'headers' => [
                'Accept' => 'application/ld+json',
                'Content-Type' => 'application/merge-patch+json',
            ],
            'json' => ['rsvpStatus' => 'confirmed', 'mealPreference' => 'vegetarian'],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'rsvpStatus' => 'confirmed',
            'mealPreference' => 'vegetarian',
        ]);
    }

    public function testPublicPatchRejectsInvalidRsvpStatus(): void
    {
        $client = static::createClient();
        $guest = $this->firstGuest($client, $this->coupleToken($client));

        $client->request('PATCH', '/api/public/guests/'.$guest['token'], [
            'headers' => [
                'Accept' => 'application/ld+json',
                'Content-Type' => 'application/merge-patch+json',
            ],
            'json' => ['rsvpStatus' => 'not-a-real-status'],
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testAuthenticatedGuestCollectionRequiresAuth(): void
    {
        static::createClient()->request('GET', '/api/guests', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseStatusCodeSame(401);
    }

    /**
     * Cross-tenant isolation: a freshly-registered couple (no wedding of their
     * own) must NOT see the seeded couple's guests. Before owner-scoping was
     * added, GET /api/guests returned every tenant's rows.
     */
    public function testGuestCollectionIsScopedToOwner(): void
    {
        $client = static::createClient();

        // The seeded couple has guests → their own collection is non-empty.
        $seededCount = $client->request('GET', '/api/guests', [
            'auth_bearer' => $this->coupleToken($client),
            'headers' => ['Accept' => 'application/ld+json'],
        ])->toArray()['totalItems'];
        $this->assertGreaterThan(0, $seededCount);

        // A brand-new couple owns no wedding → must see zero guests, not the
        // seeded couple's.
        $email = 'tenant'.uniqid().'@example.com';
        $client->request('POST', '/api/users', [
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => $email,
                'firstName' => 'New',
                'lastName' => 'Tenant',
                'plainPassword' => 'password123',
                'userType' => 'couple',
            ],
        ]);
        $this->assertResponseStatusCodeSame(201);

        $token = $client->request('POST', '/auth', [
            'json' => ['email' => $email, 'password' => 'password123'],
        ])->toArray()['token'];

        $response = $client->request('GET', '/api/guests', [
            'auth_bearer' => $token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertSame(0, $response->toArray()['totalItems']);
    }
}
