<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\CampusBoundaryController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

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

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    
    // Admin Routes
    Route::middleware('can:admin')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/buildings', [BuildingController::class, 'store']);
        Route::put('/buildings/{id}', [BuildingController::class, 'update']);
        Route::delete('/buildings/{id}', [BuildingController::class, 'destroy']);
    });
});

// Public Routes for App
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/buildings', [BuildingController::class, 'index']);
Route::get('/buildings/{id}', [BuildingController::class, 'show']);
Route::get('/campus-boundary', [CampusBoundaryController::class, 'index']);
Route::get('/route', [RouteController::class, 'getRoute']);
