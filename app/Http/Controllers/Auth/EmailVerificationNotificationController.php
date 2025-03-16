<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $role = $request->user()->role;

        if ($request->user()->hasVerifiedEmail()) {
            if ($role === "enumerator") {
                return redirect()->intended(route('enumerator.dashboard', absolute: false));
            } else if ($role === "viewer") {
                return redirect()->intended(route('viewer.dashboard', absolute: false));
            } else if ($role === "editor") {
                return redirect()->intended(route('editor.dashboard', absolute: false));
            } else if ($role === "client") {
                return redirect()->intended(route('client.dashboard', absolute: false));
            }

            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
