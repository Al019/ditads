<?php

namespace App\Models\Journal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    protected $table = "receipts";

    protected $fillable = [
        'payment_id',
        'reference_number',
        'receipt_image',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
