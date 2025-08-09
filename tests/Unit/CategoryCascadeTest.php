<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Product;

class CategoryCascadeTest extends TestCase {
  use RefreshDatabase;

  public function test_deactivating_category_deactivates_subcategories_and_products()
  {
    $cat = Category::factory()->create(['is_active'=>true]);
    $sub = Subcategory::factory()->create(['category_id'=>$cat->id,'is_active'=>true]);
    $prod = Product::factory()->create(['is_active'=>true]);
    $prod->subcategories()->attach($sub->id);

    $cat->setActive(false);

    $this->assertFalse($cat->fresh()->is_active);
    $this->assertFalse($sub->fresh()->is_active);
    $this->assertFalse($prod->fresh()->is_active);
  }
}
