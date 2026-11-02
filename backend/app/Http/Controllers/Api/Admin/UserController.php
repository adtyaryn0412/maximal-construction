<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'user')
            ->withCount('reservations')
            ->latest();

        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('is_active', $request->status === 'aktif');
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->get());
    }

    public function show(User $user)
    {
        return response()->json(
            $user->loadCount('reservations')->load('reservations.service')
        );
    }

    public function deactivate(Request $request, User $user)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        $user->deactivate();
        $user->tokens()->delete();

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'USER_DEACTIVATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['target_user_id' => $user->id, 'reason' => $validated['reason'] ?? null]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Akun user berhasil dinonaktifkan',
            'user' => $user,
        ]);
    }

    public function activate(Request $request, User $user)
    {
        $user->activate();

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'USER_ACTIVATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['target_user_id' => $user->id]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Akun user berhasil diaktifkan kembali',
            'user' => $user,
        ]);
    }
}