<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->latest();

        if ($request->filled('category') && $request->category !== 'semua') {
            match ($request->category) {
                'login_gagal' => $query->whereIn('action', ['LOGIN_FAILED', 'ADMIN_LOGIN_FAILED']),
                'login_berhasil' => $query->whereIn('action', ['LOGIN_SUCCESS', 'ADMIN_LOGIN_SUCCESS']),
                'login_ditolak' => $query->whereIn('action', ['LOGIN_BLOCKED_INACTIVE', 'ADMIN_LOGIN_BLOCKED_INACTIVE', 'LOGIN_REJECTED_WRONG_PORTAL', 'ADMIN_LOGIN_REJECTED_NOT_ADMIN']),
                'keamanan' => $query->whereIn('action', ['UNAUTHORIZED_ACCESS_ATTEMPT', 'ADMIN_LOGIN_RATE_LIMITED']),
                'hapus' => $query->where(function ($q) {
                        $q->where('action', 'like', '%DELETED%')
                        ->orWhere('action', 'RESERVATION_CANCELLED')
                        ->orWhere('action', 'SERVICE_DELETE_BLOCKED');
                    }),
                'reservasi' => $query->where('action', 'like', '%RESERVATION%'),
                'testimoni' => $query->where('action', 'like', '%TESTIMONIAL%'),
                'proyek' => $query->where('action', 'like', '%PROJECT%'),
                'layanan' => $query->where('action', 'like', '%SERVICE%'),
                'user' => $query->where(function ($q) {
                        $q->where('action', 'like', '%USER%')
                        ->orWhere('action', 'REGISTER_SUCCESS');
                    }),
                default => null,
            };
        }

        if ($request->filled('start_date')) {
            $start = \Carbon\Carbon::parse($request->start_date, 'Asia/Jakarta')->startOfDay()->utc();
            $query->where('created_at', '>=', $start);
        }

        if ($request->filled('end_date')) {
            $end = \Carbon\Carbon::parse($request->end_date, 'Asia/Jakarta')->endOfDay()->utc();
            $query->where('created_at', '<=', $end);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('email', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $logs = $query->paginate(15);

        $today = \Carbon\Carbon::now('Asia/Jakarta')->startOfDay()->utc();
        $stats = [
            'total_hari_ini' => ActivityLog::where('created_at', '>=', $today)->count(),
            'login_gagal_hari_ini' => ActivityLog::where('created_at', '>=', $today)
                ->whereIn('action', ['LOGIN_FAILED', 'ADMIN_LOGIN_FAILED'])
                ->count(),
            'login_berhasil_hari_ini' => ActivityLog::where('created_at', '>=', $today)
                ->whereIn('action', ['LOGIN_SUCCESS', 'ADMIN_LOGIN_SUCCESS'])
                ->count(),
            'aksi_hapus_hari_ini' => ActivityLog::where('created_at', '>=', $today)
                ->where(function ($q) {
                    $q->where('action', 'like', '%DELETED%')
                        ->orWhere('action', 'RESERVATION_CANCELLED');
                })
                ->count(),
        ];

        return response()->json([
            'logs' => $logs,
            'stats' => $stats,
        ]);
    }
}