<?php

use App\Http\Controllers\Survey\AdminController;
use App\Http\Controllers\Survey\EnumeratorController;
use App\Http\Controllers\Survey\ViewerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {

  Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

  Route::get('/admin/users/enumerators', [AdminController::class, 'getEnumerator'])->name('admin.user.enumerator');
  Route::post('/admin/users/enumerators', [AdminController::class, 'addEnumerator'])->name('admin.user.add.enumerator');

  Route::get('/admin/users/viewers', [AdminController::class, 'getViewer'])->name('admin.user.viewer');
  Route::post('/admin/users/viewers', [AdminController::class, 'addViewer'])->name('admin.user.add.viewer');

  Route::get('/admin/surveys', [AdminController::class, 'getSurvey'])->name('admin.survey');
  Route::get('/admin/surveys/create', [AdminController::class, 'createSurvey'])->name('admin.survey.create');
  Route::post('/admin/surveys/create', [AdminController::class, 'publishSurvey'])->name('admin.survey.publish');

});

Route::middleware(['auth', 'enumerator'])->group(function () {

  Route::get('/enumerator/dashboard', [EnumeratorController::class, 'dashboard'])->name('enumerator.dashboard');

});

Route::middleware(['auth', 'viewer'])->group(function () {

  Route::get('/viewer/dashboard', [ViewerController::class, 'dashboard'])->name('viewer.dashboard');

});