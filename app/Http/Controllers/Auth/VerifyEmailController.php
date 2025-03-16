<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
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

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

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
}
