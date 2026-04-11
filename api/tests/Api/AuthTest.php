<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class AuthTest extends ApiTestCase
{
    public function testRegister(): void
    {
        $email = 'test'.uniqid().'@example.com';
        $response = static::createClient()->request('POST', '/users', [
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => $email,
                'firstName' => 'Test',
                'lastName' => 'User',
                'plainPassword' => 'password123',
                'userType' => 'client',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains([
            '@type' => 'User',
            'email' => $email,
            'firstName' => 'Test',
            'lastName' => 'User',
        ]);
    }

    public function testLogin(): void
    {
        $client = static::createClient();
        $email = 'login'.uniqid().'@example.com';

        $client->request('POST', '/users', [
            'headers' => ['Accept' => 'application/ld+json', 'Content-Type' => 'application/ld+json'],
            'json' => [
                'email' => $email,
                'firstName' => 'Login',
                'lastName' => 'User',
                'plainPassword' => 'password123',
                'userType' => 'client',
            ],
        ]);

        $response = $client->request('POST', '/auth', [
            'json' => [
                'email' => $email,
                'password' => 'password123',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $response->toArray());
        $token = $response->toArray()['token'];

        $response = $client->request('GET', '/me', [
            'auth_bearer' => $token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            'email' => $email,
            'firstName' => 'Login',
        ]);
    }
}
