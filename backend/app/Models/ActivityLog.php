<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'method',
        'url',
        'ip_address',
        'user_agent',
        'payload',
        'status_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function record(array $data): self
    {
        return self::create($data);
    }
}