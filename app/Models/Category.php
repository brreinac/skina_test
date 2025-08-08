<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
  protected $guarded = [];
  public function subcategories(){ return $this->hasMany(Subcategory::class); }
  public function products(){ return $this->hasManyThrough(Product::class, Subcategory::class); }

  public function setActive(bool $active){
    $this->update(['is_active'=>$active]);
    $this->subcategories()->each->setActive($active);
    $this->products()->update(['is_active'=>$active]);
  }
}