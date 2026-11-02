<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Reservation;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    protected array $bannedWords = [
        'anjing',
        'anjir',
        'bangsat',
        'bajingan',
        'brengsek',
        'sialan',
        'keparat',
        'kontol',
        'memek',
        'pepek',
        'ngentot',
        'jancok',
        'jancuk',
        'goblok',
        'tolol',
        'idiot',
        'bodoh',
        'bego',
        'dungu',
        'asu',
        'diancuk',
        'coeg',
        'matamu',
        'cok',
    ];

    public function store(Request $request, Reservation $reservation)
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

            return response()->json(['message' => 'Anda tidak memiliki akses ke reservasi ini.'], 403);
        }

        if ($reservation->status !== 'selesai') {
            return response()->json([
                'message' => 'Testimoni hanya bisa diberikan untuk reservasi yang sudah selesai.',
            ], 422);
        }

        if ($reservation->testimonial()->exists()) {
            return response()->json([
                'message' => 'Anda sudah memberikan testimoni untuk reservasi ini.',
            ], 422);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string|max:1000',
        ]);

        $isFlagged = $this->containsSpamOrBannedWords($validated['message']);

        $testimonial = Testimonial::create([
            'reservation_id' => $reservation->id,
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'message' => $validated['message'],
            'is_flagged' => $isFlagged,
        ]);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => $isFlagged ? 'TESTIMONIAL_FLAGGED' : 'TESTIMONIAL_CREATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => $isFlagged ? json_encode(['reason' => 'banned_word_detected']) : null,
            'status_code' => 201,
        ]);

        return response()->json([
            'message' => $isFlagged
                ? 'Testimoni berhasil dikirim, namun sedang ditinjau karena terdeteksi konten tidak pantas.'
                : 'Testimoni berhasil dikirim',
            'testimonial' => $testimonial,
        ], 201);
    }

    protected function containsSpamOrBannedWords(string $text): bool
    {
        $lowerText = strtolower($text);

        foreach ($this->bannedWords as $word) {
            if (preg_match('/\b' . preg_quote($word, '/') . '\b/i', $lowerText)) {
                return true;
            }
        }

        if (preg_match('/(.)\1{6,}/', $text)) {
            return true;
        }

        if (preg_match('#https?://#i', $text)) {
            return true;
        }

        return false;
    }

    public function index()
    {
        $testimonials = Testimonial::with(['user', 'reservation.service'])
            ->where('is_flagged', false)
            ->latest()
            ->get();

        return response()->json($testimonials);
    }
}