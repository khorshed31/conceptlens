<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analysis extends Model
{
    protected $fillable = [
        'topic',
        'notes',
        'question',
        'student_answer',
        'feedback',
    ];

    protected function casts(): array
    {
        return [
            'feedback' => 'array',
        ];
    }
}
