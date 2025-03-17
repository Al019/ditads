<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\Journal\Payment;
use App\Models\Journal\PaymentMethod;
use App\Models\Journal\Service;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;
use Str;
use function Laravel\Prompts\select;

class ClientController extends Controller
{
    public function dashboard()
    {
        return Inertia::render("Journal/Client/Dashboard");
    }

    public function getPendingRequest(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('service_id', 'request_number', 'uploaded_file', 'amount', 'status', 'created_at')
            ->where('client_id', $user_id)
            ->where('status', 'pending')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        $services = Service::select('id', 'name', 'price')
            ->where('status', 1)
            ->latest()
            ->get();

        return Inertia::render("Journal/Client/MyRequest/Pending", [
            'services' => $services,
            'requests' => $requests
        ]);
    }

    private function generateUniqueRequestNumber()
    {
        do {
            $randomNumber = mt_rand(100000000000, 999999999999);
        } while (\App\Models\Journal\Request::where('request_number', $randomNumber)->exists());

        return $randomNumber;
    }

    public function submitRequest(Request $request)
    {
        $service = Service::findOrFail($request->service_id);

        $request->validate([
            'uploaded_file' => ['required', 'mimes:docx', 'max:2048'],
        ]);

        $user_id = $request->user()->id;

        $file = $request->file('uploaded_file');

        $filename = Str::uuid() . '/' . $file->getClientOriginalName();

        $file->storeAs('journal/uploaded_files', $filename, 'public');

        $requestNumber = $this->generateUniqueRequestNumber();

        \App\Models\Journal\Request::create([
            'client_id' => $user_id,
            'service_id' => $service->id,
            'request_number' => $requestNumber,
            'uploaded_file' => $filename,
            'amount' => $service->price
        ]);
    }

    public function resubmitRequest(Request $request)
    {
        $req = \App\Models\Journal\Request::findOrFail($request->id);

        $request->validate([
            'uploaded_file' => ['required', 'mimes:docx', 'max:2048'],
        ]);

        if ($req->uploaded_file && Storage::disk('public')->exists('journal/uploaded_files/' . $req->uploaded_file)) {
            Storage::disk('public')->delete('journal/uploaded_files/' . $req->uploaded_file);
        }

        $file = $request->file('uploaded_file');

        $filename = Str::uuid() . '/' . $file->getClientOriginalName();

        $file->storeAs('journal/uploaded_files', $filename, 'public');

        $req->update([
            'uploaded_file' => $filename,
            'message' => null,
            'status' => 'pending'
        ]);
    }

    public function getApprovedRequest(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('service_id', 'request_number', 'uploaded_file', 'amount', 'status', 'created_at')
            ->where('client_id', $user_id)
            ->where('status', 'approved')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Client/MyRequest/Approved", [
            "requests" => $requests,
        ]);
    }

    public function getRejectedRequest(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'uploaded_file', 'amount', 'message', 'status', 'created_at')
            ->where('client_id', $user_id)
            ->where('status', 'rejected')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Client/MyRequest/Rejected", [
            "requests" => $requests,
        ]);
    }

    public function getProgressRequest(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'uploaded_file', 'status')
            ->where('client_id', $user_id)
            ->where('status', 'approved')
            ->with([
                'assign_editor' => function ($query) {
                    $query->select('editor_id', 'request_id', 'published_at', 'status');
                    $query->where('status', 'approved');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        }
                    ]);
                },
                'payment' => function ($query) {
                    $query->select('request_id', 'status');
                    $query->where('status', 'approved');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%');
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Client/ProgressRequest/List", [
            "requests" => $requests,
        ]);
    }

    public function publishDocumentUnpaid(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'amount')
            ->where('client_id', $user_id)
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereDoesntHave('payment')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'assign_editor' => function ($query) {
                    $query->select('request_id', 'published_file', 'published_at');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor', function ($q) use ($search) {
                            $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        $payments = PaymentMethod::select('id', 'name', 'account_name', 'account_number', 'qr_code', 'type', 'status')
            ->where('type', 'e-wallet')
            ->where('status', 1)
            ->latest()
            ->get();

        return Inertia::render("Journal/Client/PublishDocument/Unpaid", [
            'requests' => $requests,
            'payments' => $payments
        ]);
    }

    public function payPublishDocument(Request $request)
    {
        $request->validate([
            'reference_number' => ['required'],
            'receipt' => ['required', 'mimes:jpeg,jpg,png', 'max:2048'],
        ]);

        $file = $request->file('receipt');

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $file->storeAs('journal/receipts', $filename, 'public');

        Payment::create([
            'request_id' => $request->id,
            'payment_method_id' => $request->payment_method_id,
            'reference_number' => $request->reference_number,
            'receipt' => $filename,
        ]);
    }

    public function publishDocumentPaid(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'amount')
            ->where('client_id', $user_id)
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'approved');
            })
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'assign_editor' => function ($query) {
                    $query->select('request_id', 'published_file', 'published_at');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor', function ($q) use ($search) {
                            $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Client/PublishDocument/Paid", [
            'requests' => $requests
        ]);
    }

    public function paymentPending(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'amount')
            ->where('client_id', $user_id)
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'pending');
            })
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('request_id', 'payment_method_id', 'reference_number', 'receipt', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment', function ($q) use ($search) {
                            $q->where('reference_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Client/PaymentTransaction/Pending", [
            'requests' => $requests
        ]);
    }

    public function paymentApproved(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'amount')
            ->where('client_id', $user_id)
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'approved');
            })
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('request_id', 'payment_method_id', 'reference_number', 'receipt', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name', 'type');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment', function ($q) use ($search) {
                            $q->where('reference_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Client/PaymentTransaction/Approved", [
            "requests" => $requests,
        ]);
    }

    public function paymentRejected(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'service_id', 'request_number', 'amount')
            ->where('client_id', $user_id)
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'rejected');
            })
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('request_id', 'payment_method_id', 'reference_number', 'receipt', 'message', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment', function ($q) use ($search) {
                            $q->where('reference_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Client/PaymentTransaction/Rejected", [
            'requests' => $requests
        ]);
    }
}
