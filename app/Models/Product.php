<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
  protected $guarded = [];
  public function subcategories(){ return $this->belongsToMany(Subcategory::class,'product_subcategory'); }
}
