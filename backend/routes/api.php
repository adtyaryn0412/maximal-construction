<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\ActivityLogController as AdminActivityLogController;


Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:register');
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');
Route::post('/admin/login', [AuthController::class, 'adminLogin'])
    ->middleware('throttle:admin-login');
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);


Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'updatePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store'])
        ->middleware('throttle:reservation-create');
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::post('/reservations/{reservation}/testimonial', [TestimonialController::class, 'store']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/test', function () {
            return response()->json(['message' => 'Selamat datang, Admin!']);
        });

        Route::get('/admin/reservations', [AdminReservationController::class, 'index']);
        Route::get('/admin/reservations/{reservation}', [AdminReservationController::class, 'show']);
        Route::patch('/admin/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus']);
        Route::patch('/admin/reservations/{reservation}/cancel', [AdminReservationController::class, 'cancel']);

        Route::get('/admin/projects', [AdminProjectController::class, 'index']);
        Route::post('/admin/projects', [AdminProjectController::class, 'store']);
        Route::post('/admin/projects/{project}', [AdminProjectController::class, 'update']);
        Route::delete('/admin/projects/{project}', [AdminProjectController::class, 'destroy']);

        Route::get('/admin/services', [AdminServiceController::class, 'index']);
        Route::post('/admin/services', [AdminServiceController::class, 'store']);
        Route::post('/admin/services/{service}', [AdminServiceController::class, 'update']);
        Route::delete('/admin/services/{service}', [AdminServiceController::class, 'destroy']);

        Route::get('/admin/dashboard-summary', [AdminReservationController::class, 'dashboardSummary']);
        Route::get('/admin/reservations', [AdminReservationController::class, 'index']);
        Route::get('/admin/reservations/{reservation}', [AdminReservationController::class, 'show']);
        Route::patch('/admin/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus']);
        Route::patch('/admin/reservations/{reservation}/cancel', [AdminReservationController::class, 'cancel']);

        Route::get('/admin/testimonials', [AdminTestimonialController::class, 'index']);
        Route::post('/admin/testimonials/{testimonial}/reply', [AdminTestimonialController::class, 'reply']);
        Route::delete('/admin/testimonials/{testimonial}', [AdminTestimonialController::class, 'destroy']);

        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::get('/admin/users/{user}', [AdminUserController::class, 'show']);
        Route::patch('/admin/users/{user}/deactivate', [AdminUserController::class, 'deactivate']);
        Route::patch('/admin/users/{user}/activate', [AdminUserController::class, 'activate']);

        Route::get('/admin/activity-logs', [AdminActivityLogController::class, 'index']);
    });
});