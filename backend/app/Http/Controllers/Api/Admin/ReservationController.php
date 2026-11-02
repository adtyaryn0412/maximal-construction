<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['user', 'service'])->latest();

        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['user', 'service', 'testimonial']));
    }

    public function dashboardSummary(Request $request)
    {
        $totalReservasi = Reservation::count();
        $totalPortofolio = Project::count();
        $totalLayanan = Service::count();
        $totalTestimoni = Testimonial::count();

        $reservasiTerbaru = Reservation::with('user', 'service')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'nama_pelanggan' => $r->user->name,
                    'layanan' => $r->service->name,
                    'alamat' => $r->address,
                    'no_hp' => $r->user->phone,
                    'tanggal_diajukan' => $r->created_at->format('d M Y'),
                    'status' => $r->status,
                ];
            });

        $testimoniTerbaru = Testimonial::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'nama_pelanggan' => $t->user->name ?? 'Anonim',
                    'rating' => $t->rating,
                    'pesan' => \Illuminate\Support\Str::limit($t->message, 50),
                    'tanggal' => $t->created_at->setTimezone('Asia/Jakarta')->format('d M Y'),
                ];
            });

        $logTerbaru = ActivityLog::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($l) {
                return [
                    'id' => $l->id,
                    'user' => $l->user->name ?? 'Sistem',
                    'aksi' => $l->action,
                    'waktu' => $l->created_at->setTimezone('Asia/Jakarta')->format('d M Y, H:i'),
                ];
            });

        return response()->json([
            'total_reservasi' => $totalReservasi,
            'total_portofolio' => $totalPortofolio,
            'total_layanan' => $totalLayanan,
            'total_testimoni' => $totalTestimoni,
            'reservasi_terbaru' => $reservasiTerbaru,
            'testimoni_terbaru' => $testimoniTerbaru,
            'log_terbaru' => $logTerbaru,
        ]);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'required|in:survei_dijadwalkan,survei_selesai,proses_pengerjaan,selesai',
            'survey_date' => 'nullable|date',
            'estimated_cost' => 'nullable|numeric',
            'work_start_date' => 'nullable|date',
            'work_end_date' => 'nullable|date',
        ]);

        $reservation->update($validated);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'RESERVATION_STATUS_UPDATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['reservation_id' => $reservation->id, 'new_status' => $validated['status']]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Status reservasi berhasil diperbarui',
            'reservation' => $reservation->load(['user', 'service']),
        ]);
    }

    public function cancel(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string',
        ]);

        $reservation->update([
            'status' => 'dibatalkan',
            'cancellation_reason' => $validated['cancellation_reason'],
        ]);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'RESERVATION_CANCELLED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['reservation_id' => $reservation->id, 'reason' => $validated['cancellation_reason']]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan',
            'reservation' => $reservation->load(['user', 'service']),
        ]);
    }
}