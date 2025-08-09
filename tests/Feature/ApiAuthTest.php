<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear un usuario administrador activo
        $this->admin = User::factory()->create([
            'username' => 'admin',
            'password' => Hash::make('password123'),
            'rol' => 'administrador',
            'is_active' => true
        ]);

        // Usuario básico inactivo
        $this->inactiveUser = User::factory()->create([
            'username' => 'inactive',
            'password' => Hash::make('password123'),
            'rol' => 'basico',
            'is_active' => false
        ]);
    }

    public function test_login_with_valid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id', 'username', 'rol', 'is_active'
                 ]);
    }

    public function test_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'wrongpass'
        ]);

        $response->assertStatus(422);
    }

    public function test_inactive_user_cannot_login()
    {
        $response = $this->postJson('/api/login', [
            'username' => 'inactive',
            'password' => 'password123'
        ]);

        $response->assertStatus(403);
    }

    public function test_logout()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200);
    }

    public function test_load_user_authenticated()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJson([
                     'username' => 'admin',
                     'rol' => 'administrador',
                     'is_active' => true
                 ]);
    }

    public function test_load_user_unauthenticated()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}
