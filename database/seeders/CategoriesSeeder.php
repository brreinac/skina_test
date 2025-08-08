<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['name'=>'Redes','is_active'=>true]);
        Category::create(['name'=>'Computación','is_active'=>true]);
        Category::create(['name'=>'Móvil','is_active'=>true]);
    }
}
