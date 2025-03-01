<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!Auth::check()) {
        return redirect(route('login'));
    } else if (Auth::user()->role === 'admin') {
        return redirect(route('admin.dashboard'));
    } else if (Auth::user()->role === 'enumerator') {
        return redirect(route('enumerator.dashboard'));
    } else if (Auth::user()->role === 'viewer') {
        return redirect(route('viewer.dashboard'));
    } else {
        return abort(403);
    }
});

require __DIR__ . '/auth.php';

require __DIR__ . '/survey.php';
