<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and assigned to the
| "api" middleware group.
|
*/

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Dashboard stats (single definition, using Api namespace)
Route::middleware(['auth:sanctum', 'check.user.active'])
    ->get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);

// Keep a simple /user route if needed (but note there's already one above)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protected resources (categories, subcategories, products, users)
Route::middleware(['auth:sanctum', 'check.user.active'])->group(function () {

    // API resources
    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);
    Route::apiResource('subcategories', \App\Http\Controllers\Api\SubcategoryController::class);
    Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class);

    // Users - only admin can manage users (full CRUD)
    Route::middleware('role:administrador')->group(function () {
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
    });

    // Allow basic users to update their own account (profile)
    Route::put('profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
});
