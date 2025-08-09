<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    public function handle($request, Closure $next) {
        if ($request->user() && $request->user()->is_active === false) {
            auth()->logout();
            return response()->json(['message'=>'Usuario inactivo'], 403);
        }
        return $next($request);
    }
}
