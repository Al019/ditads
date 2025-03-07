<?php

namespace App\Models\Journal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    protected $table = "payment_methods";

    protected $fillable = [
        'name',
        'account_name',
        'account_number',
        'type',
        'status',
    ];

    public function payment(): HasMany
    {
        return $this->hasMany(Payment::class, 'payment_method_id');
    }
}
