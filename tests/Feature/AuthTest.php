<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_login_active_user() {
        $user = User::factory()->create(['username'=>'u','password'=>bcrypt('pw'),'is_active'=>true]);
        $response = $this->postJson('/api/login',['username'=>'u','password'=>'pw']);
        $response->assertStatus(200)->assertJsonStructure(['id','username']);
    }
}
