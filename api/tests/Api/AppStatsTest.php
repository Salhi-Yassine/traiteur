<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class AppStatsTest extends ApiTestCase
{
    public function testGetAppStats(): void
    {
        $client = static::createClient();

        // Request AppStats
        $response = $client->request('GET', '/api/app_stats');

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'AppStats',
        ]);

        $data = $response->toArray();
        $this->assertArrayHasKey('vendorCount', $data);
        $this->assertArrayHasKey('cityCount', $data);

        $this->assertArrayHasKey('availableCities', $data);
        $this->assertArrayHasKey('availableCategories', $data);
        $this->assertArrayHasKey('featuredVendors', $data);
        $this->assertIsArray($data['featuredVendors']);
    }
}
