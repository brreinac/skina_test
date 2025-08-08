<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrador
        $admin = User::updateOrCreate(
            ['email' => 'admin@skinatech.test'],
            [
                'username'   => 'admin',
                'name'       => 'Administrador SkinaTech',
                'password'   => Hash::make('secret123'), // cámbialo por uno seguro
                'is_active'  => true,
            ]
        );
        $admin->assignRole('administrador');

        // Invitado
        $guest = User::updateOrCreate(
            ['email' => 'guest@skinatech.test'],
            [
                'username'   => 'guest',
                'name'       => 'Invitado SkinaTech',
                'password'   => Hash::make('guest123'),
                'is_active'  => true,
            ]
        );
        $guest->assignRole('invitado');
    }
}
