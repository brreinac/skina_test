<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubcategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'check.user.active'])->group(function () {

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('subcategories', SubcategoryController::class);
    Route::apiResource('products', ProductController::class);

    // Admin: CRUD completo usuarios (index, show, update, delete)
    Route::middleware('role:administrador')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // Perfil propio para todos los usuarios (básicos y admin)
    Route::put('/profile', [UserController::class, 'updateProfile']);
});
