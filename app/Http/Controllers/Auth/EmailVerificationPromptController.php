<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
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
        
        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
