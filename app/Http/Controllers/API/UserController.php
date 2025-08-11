<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('basico')) {
            // Mostrar sólo su usuario
            $users = User::with('roles')->where('id', $user->id)->get();
        } else {
            // Admin y otros roles ven todos
            $users = User::with('roles')->get();
        }

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $authUser = $request->user();
        $this->authorize('create', User::class);

        $validRoles = Role::pluck('name')->toArray();

        $data = $request->validate([
            'username' => 'required|string|max:100|unique:users,username',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', 'string', Rule::in($validRoles)],
            'is_active' => 'nullable|boolean'
        ]);

        $user = User::create([
            'username' => $data['username'],
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'password' => Hash::make($data['password']),
            'is_active' => $data['is_active'] ?? true
        ]);

        if ($authUser->hasRole('administrador') && !empty($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->assignRole($role);
            }
        }

        return response()->json($user->load('roles'), 201);
    }

    // ** Corregido: usar route model binding para $user **
    public function show(User $user, Request $request)
    {
        $authUser = $request->user();

        if ($authUser->hasRole('basico') && $authUser->id != $user->id) {
            return response()->json(['message' => 'No autorizado para ver otros usuarios'], 403);
        }

        return response()->json($user->load('roles'));
    }

    // ** Corregido: usar route model binding para $user **
    public function update(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->hasRole('basico') && $authUser->id != $user->id) {
            return response()->json(['message' => 'No autorizado para editar otros usuarios'], 403);
        }

        $validRoles = Role::pluck('name')->toArray();

        $data = $request->validate([
            'username' => ['required', 'string', 'max:100', Rule::unique('users', 'username')->ignore($user->id)],
            'name' => 'nullable|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => ['nullable', 'string', Rule::in($validRoles)],
            'is_active' => 'nullable|boolean'
        ]);

        $user->username = $data['username'];
        $user->name = $data['name'] ?? $user->name;
        $user->email = $data['email'] ?? $user->email;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if (isset($data['is_active'])) {
            $user->is_active = $data['is_active'];
        }

        $user->save();

        if ($authUser->hasRole('administrador') && !empty($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->syncRoles([$role]);
            }
        }

        return response()->json($user->load('roles'));
    }

    public function destroy(User $user, Request $request)
    {
        $authUser = $request->user();

        if (!$authUser->hasRole('administrador')) {
            return response()->json(['message' => 'No autorizado para eliminar usuarios'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    // Método para que el usuario actual pueda editar su propio perfil en /profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validRoles = Role::pluck('name')->toArray();

        $data = $request->validate([
            'username' => ['required', 'string', 'max:100', Rule::unique('users', 'username')->ignore($user->id)],
            'name' => 'nullable|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
            'role' => ['prohibited'],    // No puede cambiar rol aquí
            'is_active' => ['prohibited'] // No puede cambiar estado aquí
        ]);

        $user->username = $data['username'];
        $user->name = $data['name'] ?? $user->name;
        $user->email = $data['email'] ?? $user->email;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json($user->load('roles'));
    }
}
