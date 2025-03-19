<?php

namespace App\Models\Journal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $table = "services";

    protected $fillable = [
        'name',
        'price',
        'commission_price_rate',
        'status',
    ];

    public function request(): HasMany
    {
        return $this->hasMany(Request::class, 'service_id');
    }
}
