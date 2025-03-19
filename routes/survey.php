<?php

use App\Http\Controllers\Survey\AdminController;
use App\Http\Controllers\Survey\EnumeratorController;
use App\Http\Controllers\Survey\ViewerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified'])->group(function () {

  Route::get('/admin/surveys', [AdminController::class, 'getSurvey'])->name('admin.survey');
  Route::get('/admin/surveys/create', [AdminController::class, 'createSurvey'])->name('admin.survey.create');
  Route::post('/api/admin/surveys/create', [AdminController::class, 'apiPublishSurvey'])->name('api.admin.survey.publish');
  Route::get('/admin/surveys/{survey_id}/view', [AdminController::class, 'viewSurvey'])->name('admin.survey.view');
  Route::post('/admin/surveys/{survey_id}/view', [AdminController::class, 'assignEnumerator'])->name('admin.survey.assign.enumerator');
  Route::delete('/admin/surveys/{survey_id}/view', [AdminController::class, 'removeAssignEnumerator'])->name('admin.survey.remove.assign.enumerator');

});

Route::middleware(['auth', 'enumerator', 'verified'])->group(function () {

  Route::get('/enumerator/dashboard', [EnumeratorController::class, 'dashboard'])->name('enumerator.dashboard');

  Route::get('/enumerator/surveys', [EnumeratorController::class, 'getSurvey'])->name('enumerator.survey');
  Route::get('/enumerator/surveys/view', [EnumeratorController::class, 'viewSurvey'])->name('enumerator.survey.view');
  Route::get('/api/enumerator/surveys/view', [EnumeratorController::class, 'apiViewSurvey'])->name('api.enumerator.survey.view');
  Route::post('/api/enumerator/surveys/submit/response', [EnumeratorController::class, 'submitResponse'])->name('api.enumerator.submit.response');

});

Route::middleware(['auth', 'viewer', 'verified'])->group(function () {

  Route::get('/viewer/dashboard', [ViewerController::class, 'dashboard'])->name('viewer.dashboard');

});