<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'location',
        'year',
        'cover_image',
    ];

    public function galleries()
    {
        return $this->hasMany(ProjectGallery::class);
    }
}