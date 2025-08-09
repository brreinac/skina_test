<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ejecutar seeders para roles y usuarios
        $this->artisan('db:seed', ['--class' => 'RolesSeeder']);
        $this->artisan('db:seed', ['--class' => 'UsersSeeder']);
    }

    /** @test */
    public function una_persona_no_autenticada_no_puede_ver_el_dashboard()
    {
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(401);
    }

    /** @test */
    public function un_usuario_basico_puede_ver_el_dashboard()
    {
        $user = User::where('email', 'guest@skina.test')->first();

        $response = $this->actingAs($user)->getJson('/api/dashboard');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'categorias',
                     'subcategorias',
                     'productos',
                     'usuario'
                 ]);
    }

    /** @test */
    public function un_usuario_admin_puede_ver_el_dashboard()
    {
        $user = User::where('email', 'admin@skina.test')->first();

        $response = $this->actingAs($user)->getJson('/api/dashboard');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'categorias',
                     'subcategorias',
                     'productos',
                     'usuarios',
                     'usuario'
                 ]);
    }
}
