<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::with(['user', 'reservation.service'])->latest();

        if ($request->status === 'belum_dibalas') {
            $query->whereNull('admin_reply');
        } elseif ($request->status === 'sudah_dibalas') {
            $query->whereNotNull('admin_reply');
        } elseif ($request->status === 'ditandai') {
            $query->where('is_flagged', true);
        }

        return response()->json($query->get());
    }

    public function reply(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:1000',
        ]);

        $testimonial->update([
            'admin_reply' => $validated['admin_reply'],
            'replied_at' => now(),
        ]);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'TESTIMONIAL_REPLIED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['testimonial_id' => $testimonial->id]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Balasan berhasil dikirim',
            'testimonial' => $testimonial,
        ]);
    }

    public function destroy(Request $request, Testimonial $testimonial)
    {
        $testimonialId = $testimonial->id;
        $testimonial->delete();

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'TESTIMONIAL_DELETED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['testimonial_id' => $testimonialId]),
            'status_code' => 200,
        ]);

        return response()->json(['message' => 'Testimoni berhasil dihapus']);
    }
}