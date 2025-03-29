<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'information'])->name('profile.information');
    Route::post('/profile', [ProfileController::class, 'changePassword'])->name('profile.change.password');
});

Route::middleware(['auth', 'admin', 'verified'])->group(function () {

    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::get('/admin/users/editors', [AdminController::class, 'getEditor'])->name('admin.user.editor');
    Route::post('/admin/users/editors', [AdminController::class, 'addEditor'])->name('admin.user.add.editor');

    Route::get('/admin/users/clients', [AdminController::class, 'getClient'])->name('admin.user.client');

});

Route::get('/', [WebController::class, 'welcome'])->name('welcome');

require __DIR__ . '/auth.php';

require __DIR__ . '/journal.php';
