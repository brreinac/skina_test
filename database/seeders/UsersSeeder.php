<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder {
  public function run(): void {
    $adminRole = Role::where('name','administrador')->first();
    $guestRole = Role::where('name','basico')->first();

    $admin = User::firstOrCreate(
      ['email' => 'admin@skina.test'],
      ['username' => 'admin', 'password' => Hash::make('password'), 'is_active' => true, 'name' => 'Admin Skina']
    );
    $admin->assignRole($adminRole);

    $guest = User::firstOrCreate(
      ['email' => 'guest@skina.test'],
      ['username' => 'invitado', 'password' => Hash::make('password'), 'is_active' => true, 'name' => 'Invitado']
    );
    $guest->assignRole($guestRole);
  }
}
