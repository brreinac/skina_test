<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Note: Sanctum exposes /sanctum/csrf-cookie route, so no need to implement CSRF route manually.
    // We'll provide login, logout and user endpoints.

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = [
            'username' => $request->username,
            'password' => $request->password,
            'is_active' => true,
        ];

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales inválidas o usuario inactivo'], 401);
        }

        // Regenerate session to prevent fixation
        $request->session()->regenerate();

        return response()->json(Auth::user());
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Sesión finalizada']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
