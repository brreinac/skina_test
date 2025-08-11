<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Subcategory extends Model
{
    use LogsActivity;

    // Cambiamos 'nombre' por 'name'
    protected $fillable = ['category_id', 'name', 'is_active', 'products_count'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('subcategory')
            ->logOnly(['category_id', 'name', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function products() {
        return $this->belongsToMany(Product::class, 'product_subcategory');
    }

    public function setActive(bool $active)
    {
        $this->update(['is_active' => $active]);
        $productIds = $this->products()->pluck('products.id')->unique();
        \DB::table('products')->whereIn('id', $productIds)->update(['is_active' => $active]);
    }
}
