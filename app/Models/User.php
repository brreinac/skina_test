<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, LogsActivity;

    protected $fillable = ['name','email','username','password','is_active'];

    protected $hidden = ['password','remember_token'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('user')
            ->logOnly(['name','email','username','is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
