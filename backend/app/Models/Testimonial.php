<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'user_id',
        'rating',
        'message',
        'is_flagged',
        'admin_reply',
        'replied_at',
    ];

    protected $casts = [
        'is_flagged' => 'boolean',
        'replied_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}