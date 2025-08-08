<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;

class SubcategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $redes = Category::where('name','Redes')->first();
        Subcategory::create([
        'category_id'=> $redes->id,
        'name'       => 'Switches',
        'is_active'  => true,
        'products_count'=> 0
        ]);
    }
}
