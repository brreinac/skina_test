<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'Usuario inactivo o no autenticado'], 403);
        }

        if ($user->hasRole('administrador')) {
            // Admin: acceso total
            return $next($request);
        }

        if ($user->hasRole('basico')) {
            // Básico: sólo puede consultar todas las secciones y editar sólo su propio usuario

            // Para rutas users.show y users.update validar que sea propio usuario
            $routeName = $request->route()->getName();

            if (in_array($routeName, ['users.show', 'users.update'])) {
                $userIdRoute = $request->route('user'); // clave 'user' por default en apiResource
                if ($userIdRoute == $user->id) {
                    return $next($request);
                }
                return response()->json(['message' => 'No autorizado para acceder a otros usuarios'], 403);
            }

            // Para index (lista), store (crear), destroy (eliminar) usuarios bloquear
            if (in_array($routeName, ['users.index', 'users.store', 'users.destroy'])) {
                return response()->json(['message' => 'No autorizado para esta operación'], 403);
            }

            // Para cualquier otro método HTTP distinto a GET, bloquear
            if ($request->method() !== 'GET') {
                return response()->json(['message' => 'No autorizado para esta operación'], 403);
            }

            // Para consultas GET (ej: ver categorías, productos, etc), permitir
            return $next($request);
        }

        // Rol no reconocido
        return response()->json(['message' => 'Acceso denegado'], 403);
    }
}
