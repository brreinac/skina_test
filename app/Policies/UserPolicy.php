<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser)
    {
        return $authUser->hasRole('administrador') || $authUser->hasRole('basico');
    }

    public function view(User $authUser, User $user)
    {
        return $authUser->hasRole('administrador') || $authUser->id === $user->id;
    }

    public function update(User $authUser, User $user)
    {
        return $authUser->hasRole('administrador') || $authUser->id === $user->id;
    }

    public function delete(User $authUser, User $user)
    {
        return $authUser->hasRole('administrador');
    }

    public function create(User $authUser)
    {
        return $authUser->hasRole('administrador');
    }
}
