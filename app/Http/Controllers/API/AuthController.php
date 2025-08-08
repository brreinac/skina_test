<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Login via username + password (uses session cookie provided by Sanctum)
    public function login(Request $r) {
        $r->validate(['username'=>'required','password'=>'required']);
        if (!Auth::attempt(['username'=>$r->username,'password'=>$r->password,'is_active'=>true])) {
            return response()->json(['message'=>'Credenciales inválidas'],401);
        }
        $r->session()->regenerate();
        return response()->json(Auth::user());
    }

    public function logout(Request $r) {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();
        return response()->json(['message'=>'ok']);
    }
    public function user(Request $r) {
        return response()->json($r->user());
    }
}
