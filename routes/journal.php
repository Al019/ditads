<?php

use App\Http\Controllers\Journal\AdminController;
use App\Http\Controllers\Journal\ClientController;
use App\Http\Controllers\Journal\EditorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified'])->group(function () {

  Route::get('/admin/services_&_payments/services', [AdminController::class, 'getService'])->name('admin.service&payment.service');
  Route::post('/admin/services_&_payments/add/services', [AdminController::class, 'addService'])->name('admin.service&payment.add.service');
  Route::post('/admin/services_&_payments/update/services', [AdminController::class, 'updateService'])->name('admin.service&payment.update.service');
  Route::post('/admin/services_&_payments/update/services/status', [AdminController::class, 'updateServiceStatus'])->name('admin.service&payment.update.service.status');

  Route::get('/admin/services_&_payments/payment_methods', [AdminController::class, 'getPaymentMethod'])->name('admin.service&payment.payment.method');
  Route::post('/admin/services_&_payments/add/payment_methods', [AdminController::class, 'addPaymentMethod'])->name('admin.service&payment.add.payment.method');
  Route::post('/admin/services_&_payments/update/payment_methods', [AdminController::class, 'updatePaymentMethod'])->name('admin.service&payment.update.payment.method');
  Route::post('/admin/services_&_payments/update/payment_methods/status', [AdminController::class, 'updatePaymentMethodStatus'])->name('admin.service&payment.update.payment.method.status');

  Route::get('/admin/requests/pending', [AdminController::class, 'getPendingRequest'])->name('admin.request.pending');
  Route::post('/admin/requests/approved/request', [AdminController::class, 'approvedRequest'])->name('admin.approved.request');
  Route::post('/admin/requests/rejected/request', [AdminController::class, 'rejectedRequest'])->name('admin.rejected.request');
  Route::get('/admin/requests/approved', [AdminController::class, 'getApprovedRequest'])->name('admin.request.approved');
  Route::get('/admin/requests/rejected', [AdminController::class, 'getRejectedRequest'])->name('admin.request.rejected');

  Route::get('/admin/assigned/editors/pending', [AdminController::class, 'assignEditorPending'])->name('admin.assigned.editor.pending');
  Route::post('/admin/assigned/editors/update/editor', [AdminController::class, 'changeEditor'])->name('admin.assigned.editor.update.editor');
  Route::get('/admin/assigned/editors/approved', [AdminController::class, 'assignEditorApproved'])->name('admin.assigned.editor.approved');
  Route::get('/admin/assigned/editors/rejected', [AdminController::class, 'assignEditorRejected'])->name('admin.assigned.editor.rejected');

  Route::get('/admin/published/documents/unpaid', [AdminController::class, 'publishDocumentUnpaid'])->name('admin.published.document.unpaid');
  Route::post('/admin/published/documents/pay', [AdminController::class, 'publishDocumentPay'])->name('admin.published.document.pay');
  Route::get('/admin/published/documents/paid', [AdminController::class, 'publishDocumentPaid'])->name('admin.published.document.paid');

  Route::get('/admin/payments/transactions/pending', [AdminController::class, 'paymentPending'])->name('admin.payment.transaction.pending');
  Route::post('/admin/payments/transactions/update/status', [AdminController::class, 'updatePaymentStatus'])->name('admin.payment.transaction.update.status');
  Route::get('/admin/payments/transactions/approved', [AdminController::class, 'paymentApproved'])->name('admin.payment.transaction.approved');
  Route::get('/admin/payments/transactions/rejected', [AdminController::class, 'paymentRejected'])->name('admin.payment.transaction.rejected');

});

Route::middleware(['auth', 'editor', 'verified'])->group(function () {

  Route::get('/editor/dashboard', [EditorController::class, 'dashboard'])->name('editor.dashboard');

  Route::get('/editor/assigned/documents/pending', [EditorController::class, 'assignDocumentPending'])->name('editor.assigned.document.pending');
  Route::post('/editor/assigned/documents/update/status', [EditorController::class, 'updateAssignDocument'])->name('editor.assigned.document.update.status');
  Route::get('/editor/assigned/documents/approved', [EditorController::class, 'assignDocumentApproved'])->name('editor.assigned.document.approved');
  Route::get('/editor/assigned/documents/rejected', [EditorController::class, 'assignDocumentRejected'])->name('editor.assigned.document.rejected');

  Route::get('/editor/published/documents/pending', [EditorController::class, 'pendingPublishDocument'])->name('editor.published.document.pending');
  Route::post('/editor/published/documents/publish', [EditorController::class, 'publishDocument'])->name('editor.published.document.publish');
  Route::get('/editor/published/documents/reports', [EditorController::class, 'reportPublishDocument'])->name('editor.published.document.report');

});

Route::middleware(['auth', 'client', 'verified'])->group(function () {

  Route::get('/client/dashboard', [ClientController::class, 'dashboard'])->name('client.dashboard');

  Route::get('/client/my-requests/pending', [ClientController::class, 'getPendingRequest'])->name('client.my.request.pending');
  Route::post('/client/my-requests/submit/request', [ClientController::class, 'submitRequest'])->name('client.my.request.submit.request');
  Route::post('/client/my-requests/resubmit/request', [ClientController::class, 'resubmitRequest'])->name('client.my.request.resubmit.request');
  Route::get('/client/my-requests/approved', [ClientController::class, 'getApprovedRequest'])->name('client.my.request.approved');
  Route::get('/client/my-requests/rejected', [ClientController::class, 'getRejectedRequest'])->name('client.my.request.rejected');

  Route::get('/client/progress/requests', [ClientController::class, 'getProgressRequest'])->name('client.progress.request');

  Route::get('/client/published/documents/unpaid', [ClientController::class, 'publishDocumentUnpaid'])->name('client.published.document.unpaid');
  Route::post('/client/published/documents/pay', [ClientController::class, 'payPublishDocument'])->name('client.published.document.pay');
  Route::post('/client/published/documents/repay', [ClientController::class, 'repayPublishDocument'])->name('client.published.document.repay');
  Route::get('/client/published/documents/paid', [ClientController::class, 'publishDocumentPaid'])->name('client.published.document.paid');

  Route::get('/client/payments/transactions/pending', [ClientController::class, 'paymentPending'])->name('client.payment.transaction.pending');
  Route::get('/client/payments/transactions/approved', [ClientController::class, 'paymentApproved'])->name('client.payment.transaction.approved');
  Route::get('/client/payments/transactions/rejected', [ClientController::class, 'paymentRejected'])->name('client.payment.transaction.rejected');

});

Route::middleware(['auth'])->group(function () {

  Route::get('/journal/download', function () {
    $file = request('file');
    $filePath = storage_path("app/public/journal/{$file}");
    return response()->download($filePath);
  })->name('journal.download');

});