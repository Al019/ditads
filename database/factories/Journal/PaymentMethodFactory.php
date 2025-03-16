<?php

namespace Database\Factories\Journal;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Journal\PaymentMethod>
 */
class PaymentMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => null,
            'account_name' => null,
            'account_number' => null,
            'qr_code' => null,
            'type' => null,
            'status' => null,
        ];
    }
}
