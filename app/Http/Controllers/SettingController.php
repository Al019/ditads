<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function profile()
    {
        return Inertia::render("Settings/Profile");
    }

    public function password()
    {
        return Inertia::render("Settings/Password");
    }

    public function updatePassword(Request $request)
    {
        $user_id = auth()->user()->id;

        $user = User::find($user_id);

        if ($user->is_default === 1) {
            $request->validate([
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            $user->update([
                'password' => Hash::make($request->password),
                'is_default' => 0
            ]);
        } else {
            $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }
    }
}
