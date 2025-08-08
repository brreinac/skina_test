<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Subcategory;

class ProductSubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $router = Product::where('name','Router X200')->first();
        $switch = Subcategory::where('name','Switches')->first();
        $router->subcategories()->attach($switch->id);
        // Actualizar contador
        $switch->increment('products_count');
    }
}
