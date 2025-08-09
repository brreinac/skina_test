<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware('auth:sanctum');
Route::get('/user',[AuthController::class,'user'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum','check.user.active'])->get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum','check.user.active'])->group(function(){
  Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);
  Route::apiResource('subcategories', \App\Http\Controllers\Api\SubcategoryController::class);
  Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class);

  // Users only admin for most operations
  Route::middleware('role:administrador')->group(function(){
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
  });

  // Allow basic users to see users/:id update own account - create route for profile update and protect accordingly
  Route::put('profile', [\App\Http\Controllers\Api\UserController::class,'updateProfile']);
});