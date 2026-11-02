<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservations = Reservation::with('service')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'address' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'service_id' => $validated['service_id'],
            'address' => $validated['address'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'menunggu',
        ]);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'RESERVATION_CREATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => 201,
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil diajukan',
            'reservation' => $reservation->load('service'),
        ], 201);
    }

    public function show(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id) {
            ActivityLog::record([
                'user_id' => $request->user()->id,
                'action' => 'UNAUTHORIZED_ACCESS_ATTEMPT',
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => json_encode(['reservation_id' => $reservation->id]),
                'status_code' => 403,
            ]);

            return response()->json([
                'message' => 'Anda tidak memiliki akses ke reservasi ini.',
            ], 403);
        }

        return response()->json($reservation->load(['service', 'testimonial']));
    }
}