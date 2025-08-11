<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser)
    {
        // Admin puede ver todos, básico puede acceder a la lista pero verá solo su usuario (controlado en controller)
        return $authUser->hasRole('administrador') || $authUser->hasRole('basico');
    }

    public function view(User $authUser, User $user)
    {
        // Admin puede ver cualquiera, básico sólo su usuario
        return $authUser->hasRole('administrador') || $authUser->id === $user->id;
    }

    public function update(User $authUser, User $user)
    {
        // Admin puede actualizar cualquiera, básico sólo su usuario
        return $authUser->hasRole('administrador') || $authUser->id === $user->id;
    }

    public function delete(User $authUser, User $user)
    {
        // Solo admin puede eliminar usuarios
        return $authUser->hasRole('administrador');
    }

    public function create(User $authUser)
    {
        // Solo admin puede crear usuarios
        return $authUser->hasRole('administrador');
    }
}
