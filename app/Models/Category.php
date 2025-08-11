<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Category extends Model
{
    use LogsActivity;

    protected $fillable = ['name', 'is_active'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('category')
            ->logOnly(['name', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class);
    }

    public function products()
    {
        return $this->hasManyThrough(
            Product::class,
            Subcategory::class,
            'category_id',
            'id',
            'id',
            'id'
        )->distinct();
    }

    public function setActive(bool $active)
    {
        $this->update(['is_active' => $active]);

        foreach ($this->subcategories()->get() as $sub) {
            $sub->setActive($active);
        }

        $productIds = \DB::table('product_subcategory')
            ->whereIn('subcategory_id', $this->subcategories()->pluck('id'))
            ->pluck('product_id')
            ->unique();

        \DB::table('products')
            ->whereIn('id', $productIds)
            ->update(['is_active' => $active]);
    }
}
