<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model {
  protected $guarded = [];
  public function category(){ return $this->belongsTo(Category::class); }
  public function products(){ return $this->belongsToMany(Product::class,'product_subcategory'); }

  public function setActive(bool $active){
    $this->update(['is_active'=>$active]);
    $this->products()->update(['is_active'=>$active]);
  }
}