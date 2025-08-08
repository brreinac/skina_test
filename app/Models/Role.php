<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    /**
     * Puedes ajustar $guarded / $fillable si lo deseas.
     * Dejar vacío para heredar comportamiento de Spatie y permitir extensiones.
     */
    protected $guarded = [];
}