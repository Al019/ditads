<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!Auth::check()) {
        return redirect(route('login'));
    } else if (Auth::user()->role === 'admin') {
        return redirect(route('admin.dashboard'));
    } else if (Auth::user()->role === 'editor') {
        return redirect(route('editor.dashboard'));
    } else if (Auth::user()->role === 'client') {
        return redirect(route('client.dashboard'));
    } else {
        return abort(403);
    }
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'information'])->name('profile.information');
    Route::post('/profile', [ProfileController::class, 'changePassword'])->name('profile.change.password');
});

Route::middleware(['auth', 'admin', 'verified'])->group(function () {

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::get('/admin/users/editors', [AdminController::class, 'getEditor'])->name('admin.user.editor');
    Route::post('/admin/users/editors', [AdminController::class, 'addEditor'])->name('admin.user.add.editor');
    Route::post('/admin/users/editors/update/commission', [AdminController::class, 'updateEditorCommission'])->name('admin.user.update.editor.commission');

    Route::get('/admin/users/clients', [AdminController::class, 'getClient'])->name('admin.user.client');

});

require __DIR__ . '/auth.php';

require __DIR__ . '/journal.php';
