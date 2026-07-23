<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;

class SavedVendorTest extends ApiTestCase
{
    private function registerAndLogin(Client $client): string
    {
        $email = 'saved'.uniqid().'@example.com';

        $client->request('POST', '/api/users', [
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => $email,
                'firstName' => 'Saved',
                'lastName' => 'Vendor',
                'plainPassword' => 'password123',
                'userType' => 'couple',
            ],
        ]);
        $this->assertResponseStatusCodeSame(201);

        $response = $client->request('POST', '/auth', [
            'json' => ['email' => $email, 'password' => 'password123'],
        ]);

        return $response->toArray()['token'];
    }

    private function firstVendorProfileIri(Client $client): string
    {
        $response = $client->request('GET', '/api/vendor_profiles', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $members = $response->toArray()['member'];
        $this->assertNotEmpty($members, 'Fixtures must provide at least one vendor profile');

        return $members[0]['@id'];
    }

    public function testCollectionRequiresAuthentication(): void
    {
        static::createClient()->request('GET', '/api/saved_vendors', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testSaveListAndDeleteOwnVendor(): void
    {
        $client = static::createClient();
        $token = $this->registerAndLogin($client);
        $vendorIri = $this->firstVendorProfileIri($client);

        // Save
        $response = $client->request('POST', '/api/saved_vendors', [
            'auth_bearer' => $token,
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => ['vendorProfile' => $vendorIri],
        ]);
        $this->assertResponseStatusCodeSame(201);
        $savedIri = $response->toArray()['@id'];
        $this->assertSame($vendorIri, $response->toArray()['vendorProfile']['@id']);

        // Duplicate save is rejected by the unique constraint
        $client->request('POST', '/api/saved_vendors', [
            'auth_bearer' => $token,
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => ['vendorProfile' => $vendorIri],
        ]);
        $this->assertResponseStatusCodeSame(422);

        // Collection contains it
        $response = $client->request('GET', '/api/saved_vendors', [
            'auth_bearer' => $token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $this->assertResponseIsSuccessful();
        $ids = array_column($response->toArray()['member'], '@id');
        $this->assertContains($savedIri, $ids);

        // Delete
        $client->request('DELETE', $savedIri, ['auth_bearer' => $token]);
        $this->assertResponseStatusCodeSame(204);
    }

    public function testCannotSeeOrDeleteAnotherUsersSavedVendor(): void
    {
        $client = static::createClient();
        $ownerToken = $this->registerAndLogin($client);
        $vendorIri = $this->firstVendorProfileIri($client);

        $response = $client->request('POST', '/api/saved_vendors', [
            'auth_bearer' => $ownerToken,
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => ['vendorProfile' => $vendorIri],
        ]);
        $this->assertResponseStatusCodeSame(201);
        $savedIri = $response->toArray()['@id'];

        $intruderToken = $this->registerAndLogin($client);

        // Collection of another user must not leak the item
        $response = $client->request('GET', '/api/saved_vendors', [
            'auth_bearer' => $intruderToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $this->assertResponseIsSuccessful();
        $ids = array_column($response->toArray()['member'], '@id');
        $this->assertNotContains($savedIri, $ids);

        // Direct GET and DELETE are forbidden
        $client->request('GET', $savedIri, [
            'auth_bearer' => $intruderToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $this->assertResponseStatusCodeSame(403);

        $client->request('DELETE', $savedIri, ['auth_bearer' => $intruderToken]);
        $this->assertResponseStatusCodeSame(403);

        // Cleanup so the test is repeatable against the shared dev database
        $client->request('DELETE', $savedIri, ['auth_bearer' => $ownerToken]);
        $this->assertResponseStatusCodeSame(204);
    }
}
