<?php

namespace App\Models\Journal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $table = "payments";

    protected $fillable = [
        'request_id',
        'payment_method_id',
        'message',
        'status',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id');
    }

    public function payment_method(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function receipt(): HasMany
    {
        return $this->hasMany(Receipt::class,'payment_id');
    }
}
