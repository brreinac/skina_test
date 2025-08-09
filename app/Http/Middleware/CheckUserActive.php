<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    /**
     * Handle an incoming request.
     *
     * Asegura que el usuario autenticado exista y esté activo.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si no hay usuario autenticado, devolvemos 401 (aunque normalmente auth:sanctum debe ejecutarse antes)
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Si el usuario está marcado como inactivo
        if (isset($user->is_active) && $user->is_active == false) {
            return response()->json(['message' => 'Usuario inactivo. Contacta al administrador.'], 403);
        }

        return $next($request);
    }
}
