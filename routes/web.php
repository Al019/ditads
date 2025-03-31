<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/settings/profile', [SettingController::class, 'profile'])->name('setting.profile');
    Route::get('/settings/password', [SettingController::class, 'password'])->name('setting.password');
    Route::post('/settings/password/update', [SettingController::class, 'updatePassword'])->name('setting.password.update');

    Route::get('/notifications', [NotificationController::class, 'getNotification'])->name('notification');
    Route::post('/notifications/read', [NotificationController::class, 'readNotification'])->name('notification.read');

    Route::get('/users/profile/{id}', [AdminController::class, 'getUserProfile'])->name('user.profile');

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
