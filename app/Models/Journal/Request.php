<?php

namespace App\Models\Journal;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Request extends Model
{
    protected $table = "requests";

    protected $fillable = [
        'client_id',
        'service_id',
        'upload_file',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function payment(): HasMany
    {
        return $this->hasMany(Payment::class, 'request_id');
    }

    public function assign_editor(): HasMany
    {
        return $this->hasMany(AssignEditor::class, 'request_id');
    }
}
