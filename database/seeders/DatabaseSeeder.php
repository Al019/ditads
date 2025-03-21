<?php

namespace Database\Seeders;

use App\Models\Journal\PaymentMethod;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'last_name' => 'Admin',
            'first_name' => 'User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'is_default' => 0,
        ]);

        PaymentMethod::factory()->create([
            'name' => 'Cash',
            'type' => 'cash',
            'status' => 1,
        ]);
    }
}
