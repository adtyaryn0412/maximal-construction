<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'address',
        'notes',
        'status',
        'survey_date',
        'estimated_cost',
        'work_start_date',
        'work_end_date',
        'cancellation_reason',
    ];

    protected $casts = [
        'survey_date' => 'date',
        'work_start_date' => 'date',
        'work_end_date' => 'date',
        'estimated_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function testimonial()
    {
        return $this->hasOne(Testimonial::class);
    }
}