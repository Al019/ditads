<?php

use App\Http\Controllers\Journal\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified'])->group(function () {

  Route::get('/admin/services_&_payments/services', [AdminController::class, 'getService'])->name('admin.service&payment.service');
  Route::post('/admin/services_&_payments/services', [AdminController::class, 'addService'])->name('admin.service&payment.add.service');
  Route::patch('/admin/services_&_payments/update/services', [AdminController::class, 'updateService'])->name('admin.service&payment.update.service');
  Route::patch('/admin/services_&_payments/update/services/status', [AdminController::class, 'updateServiceStatus'])->name('admin.service&payment.update.service.status');

  Route::get('/admin/services_&_payments/payment_methods', [AdminController::class, 'getPaymentMethod'])->name('admin.service&payment.payment.method');
  Route::post('/admin/services_&_payments/payment_methods', [AdminController::class, 'addPaymentMethod'])->name('admin.service&payment.add.payment.method');
  Route::patch('/admin/services_&_payments/update/payment_methods', [AdminController::class, 'updatePaymentMethod'])->name('admin.service&payment.update.payment.method');
  Route::patch('/admin/services_&_payments/update/payment_methods/status', [AdminController::class, 'updatePaymentMethodStatus'])->name('admin.service&payment.update.payment.method.status');

});