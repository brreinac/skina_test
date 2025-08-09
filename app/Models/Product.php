<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Product extends Model
{
    use LogsActivity;

    protected $fillable = ['nombre', 'is_active'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('product')
            ->logOnly(['nombre', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function subcategories() { return $this->belongsToMany(Subcategory::class, 'product_subcategory'); }
}
