<?php

namespace App\Providers;

use App\Models\ActivityLog;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    ActivityLog::record([
                        'user_id' => null,
                        'action' => 'LOGIN_RATE_LIMITED',
                        'method' => $request->method(),
                        'url' => $request->fullUrl(),
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'payload' => json_encode($request->only('email')),
                        'status_code' => 429,
                    ]);

                    return response()->json([
                        'message' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa saat.',
                    ], 429, $headers);
                });
        });

        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinute(3)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    ActivityLog::record([
                        'user_id' => null,
                        'action' => 'ADMIN_LOGIN_RATE_LIMITED',
                        'method' => $request->method(),
                        'url' => $request->fullUrl(),
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'payload' => json_encode($request->only('email')),
                        'status_code' => 429,
                    ]);

                    return response()->json([
                        'message' => 'Terlalu banyak percobaan login admin. Silakan coba lagi dalam beberapa saat.',
                    ], 429, $headers);
                });
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    ActivityLog::record([
                        'user_id' => null,
                        'action' => 'REGISTER_RATE_LIMITED',
                        'method' => $request->method(),
                        'url' => $request->fullUrl(),
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'status_code' => 429,
                    ]);

                    return response()->json([
                        'message' => 'Terlalu banyak percobaan registrasi. Silakan coba lagi dalam beberapa saat.',
                    ], 429, $headers);
                });
        });

        RateLimiter::for('reservation-create', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function (Request $request, array $headers) {
                    ActivityLog::record([
                        'user_id' => $request->user()?->id,
                        'action' => 'RESERVATION_RATE_LIMITED',
                        'method' => $request->method(),
                        'url' => $request->fullUrl(),
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'status_code' => 429,
                    ]);

                    return response()->json([
                        'message' => 'Terlalu banyak permintaan reservasi. Silakan coba lagi dalam beberapa saat.',
                    ], 429, $headers);
                });
        });
    }
}