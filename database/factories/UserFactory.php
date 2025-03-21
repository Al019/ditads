<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'last_name' => null,
            'first_name' => null,
            'middle_name' => null,
            'gender' => null,
            'email' => null,
            'email_verified_at' => now(),
            'password' => null,
            'contact_number'=> null,
            'course'=> null,
            'school'=> null,
            'school_type'=> null,
            'remember_token' => Str::random(10),
            'role' => null,
            'status' => null,
            'is_default' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
