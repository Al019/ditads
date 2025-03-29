<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\Journal\AssignEditor;
use App\Models\Journal\Payment;
use App\Models\Journal\PaymentMethod;
use App\Models\Journal\Receipt;
use App\Models\Journal\Service;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Storage;
use Str;

class AdminController extends Controller
{
    public function getService(Request $request)
    {
        $search = $request->input('search');

        $services = Service::select('id', 'name', 'price', 'status')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Admin/Service/List", [
            "services" => $services
        ]);
    }

    public function addService(Request $request)
    {
        $request->validate([
            'name' => ['required', Rule::unique('services')],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        Service::create([
            'name' => $request->name,
            'price' => $request->price,
        ]);
    }

    public function updateService(Request $request)
    {
        $request->validate([
            'name' => ['required', Rule::unique('services')->ignore($request->id)],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        Service::where('id', $request->id)->update([
            'name' => $request->name,
            'price' => $request->price,
        ]);
    }

    public function updateServiceStatus(Request $request)
    {
        Service::where("id", $request->id)
            ->update([
                "status" => $request->status
            ]);
    }

    public function getPaymentMethod(Request $request)
    {
        $search = $request->input('search');

        $payments = PaymentMethod::select('id', 'name', 'account_name', 'account_number', 'qr_code', 'status')
            ->where('type', 'e-wallet')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('account_name', 'like', '%' . $search . '%')
                        ->orWhere('account_number', 'like', '%' . $search . '%');
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Admin/PaymentMethod/List", [
            "payments" => $payments
        ]);
    }

    public function addPaymentMethod(Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:payment_methods'],
            'account_name' => ['required'],
            'account_number' => ['required'],
            'qr_code' => $request->have_qr === 'yes' ? ['required', 'mimes:jpeg,jpg,png', 'max:2048'] : ['nullable']
        ]);

        $payment = PaymentMethod::create([
            'name' => $request->name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
        ]);

        if ($request->have_qr === 'yes') {
            $file = $request->file('qr_code');

            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            $file->storeAs('journal/qr_codes', $filename, 'public');

            PaymentMethod::find($payment->id)
                ->update([
                    'qr_code' => $filename,
                ]);
        }
    }

    public function updatePaymentMethod(Request $request)
    {
        $payment = PaymentMethod::findOrFail($request->id);

        $request->validate([
            'name' => ['required', 'unique:payment_methods,name,' . $payment->id],
            'account_name' => ['required'],
            'account_number' => ['required'],
        ]);

        $payment->update([
            'name' => $request->name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
        ]);

        if ($request->have_qr === 'yes') {
            $request->validate([
                'qr_code' => ['required']
            ]);

            if ($request->hasFile('qr_code')) {
                $request->validate([
                    'qr_code' => ['mimes:jpeg,jpg,png', 'max:2048']
                ]);

                if ($payment->qr_code && Storage::disk('public')->exists('journal/qr_codes/' . $payment->qr_code)) {
                    Storage::disk(name: 'public')->delete('journal/qr_codes/' . $payment->qr_code);
                }

                $file = $request->file('qr_code');

                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

                $file->storeAs('journal/qr_codes', $filename, 'public');

                $payment->update([
                    'qr_code' => $filename,
                ]);
            }
        } else {
            if ($payment->qr_code && Storage::disk('public')->exists('journal/qr_codes/' . $payment->qr_code)) {
                Storage::disk(name: 'public')->delete('journal/qr_codes/' . $payment->qr_code);

                $payment->update([
                    'qr_code' => null,
                ]);
            }
        }
    }

    public function updatePaymentMethodStatus(Request $request)
    {
        PaymentMethod::where("id", $request->id)
            ->update([
                "status" => $request->status
            ]);
    }

    public function getPendingRequest(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'request_number', 'service_id', 'client_id', 'uploaded_file', 'amount', 'status', 'created_at')
            ->where('status', 'pending')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        $editors = User::select('id', 'last_name', 'first_name')
            ->where('role', 'editor')
            ->where('status', 'active')
            ->get();

        return Inertia::render("Journal/Admin/Request/Pending", [
            'requests' => $requests,
            'editors' => $editors
        ]);
    }

    public function approvedRequest(Request $request)
    {
        $req = \App\Models\Journal\Request::findOrFail($request->request_id);

        $request->validate([
            'editor_id' => ['required'],
            'edited_file' => ['required', 'mimes:docx', 'max:2048']
        ], [
            'editor_id.required' => 'The editor field is required.',
        ]);

        $req->update([
            'status' => $request->status
        ]);

        $file = $request->file('edited_file');

        $filename = Str::uuid() . '/' . $file->getClientOriginalName();

        $file->storeAs('journal/edited_files', $filename, 'public');

        AssignEditor::create([
            'request_id' => $req->id,
            'editor_id' => $request->editor_id,
            'edited_file' => $filename
        ]);
    }

    public function rejectedRequest(Request $request)
    {
        $req = \App\Models\Journal\Request::findOrFail($request->request_id);

        $request->validate([
            'message' => ['required'],
        ]);

        $req->update([
            'message' => $request->message,
            'status' => $request->status
        ]);
    }

    public function getApprovedRequest(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'request_number', 'service_id', 'client_id', 'uploaded_file', 'amount', 'status', 'created_at')
            ->where('status', 'approved')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Admin/Request/Approved", [
            'requests' => $requests
        ]);
    }

    public function getRejectedRequest(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'request_number', 'service_id', 'client_id', 'uploaded_file', 'amount', 'message', 'status', 'created_at')
            ->where('status', 'rejected')
            ->with([
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(uploaded_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhere('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Admin/Request/Rejected", [
            'requests' => $requests
        ]);
    }

    public function assignEditorPending(Request $request)
    {
        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('status', 'pending')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id', 'request_number');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                    ]);
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request', function ($q) use ($search) {
                            $q->where('request_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        $editors = User::select('id', 'last_name', 'first_name')
            ->where('role', 'editor')
            ->get();

        return Inertia::render("Journal/Admin/AssignEditor/Pending", [
            "assigns" => $assigns,
            "editors" => $editors
        ]);
    }

    public function changeEditor(Request $request)
    {
        $request->validate([
            'editor_id' => ['required']
        ], [
            'editor_id.required' => 'The editor field is required.'
        ]);

        AssignEditor::findOrFail($request->id)
            ->update([
                'editor_id' => $request->editor_id,
                'status' => 'pending'
            ]);
    }

    public function assignEditorApproved(Request $request)
    {
        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('status', 'approved')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id', 'request_number');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                    ]);
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request', function ($q) use ($search) {
                            $q->where('request_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Journal/Admin/AssignEditor/Approved", [
            "assigns" => $assigns
        ]);
    }

    public function assignEditorRejected(Request $request)
    {
        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('status', 'rejected')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id', 'request_number');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                    ]);
                },
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request', function ($q) use ($search) {
                            $q->where('request_number', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        $editors = User::select('id', 'last_name', 'first_name')
            ->where('role', 'editor')
            ->get();

        return Inertia::render("Journal/Admin/AssignEditor/Rejected", [
            "assigns" => $assigns,
            "editors" => $editors,
        ]);
    }

    public function publishDocumentUnpaid(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'client_id', 'service_id', 'request_number', 'amount')
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereDoesntHave('payment')
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'assign_editor' => function ($query) {
                    $query->select('editor_id', 'request_id', 'published_file', 'published_at');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor', function ($q) use ($search) {
                            $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Admin/PublishDocument/Unpaid", [
            "requests" => $requests
        ]);
    }

    public function publishDocumentPay(Request $request)
    {
        $request->validate([
            'reference_number' => ['required'],
        ]);

        $payment_method_id = PaymentMethod::where('type', 'cash')
            ->first()->id;

        $payment = Payment::create([
            'request_id' => $request->request_id,
            'payment_method_id' => $payment_method_id,
            'status' => 'approved',
        ]);

        Receipt::create([
            'payment_id' => $payment->id,
            'reference_number' => $request->reference_number,
        ]);
    }

    public function publishDocumentPaid(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'client_id', 'service_id', 'request_number', 'amount')
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'approved');
            })
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'assign_editor' => function ($query) {
                    $query->select('editor_id', 'request_id', 'published_file', 'published_at');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor', function ($q) use ($search) {
                            $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('assign_editor.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->orderBy(
                DB::raw('(SELECT published_at FROM assign_editors WHERE assign_editors.request_id = requests.id ORDER BY published_at DESC LIMIT 1)'),
                'desc'
            )
            ->paginate(10);

        return Inertia::render("Journal/Admin/PublishDocument/Paid", [
            "requests" => $requests
        ]);
    }

    public function paymentPending(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'client_id', 'service_id', 'request_number', 'amount')
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'pending');
            })
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('id', 'request_id', 'payment_method_id', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'receipt' => function ($query) {
                            $query->select('payment_id', 'reference_number', 'receipt_image');
                        },
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Admin/PaymentTransaction/Pending", [
            'requests' => $requests
        ]);
    }

    public function updatePaymentStatus(Request $request)
    {
        $payment = Payment::where('request_id', $request->id)->first();

        if (!$payment) {
            abort(404);
        }

        if ($request->status === 'approved') {
            $payment->update([
                'status' => $request->status
            ]);
        } else if ($request->status === 'rejected') {
            $request->validate([
                'message' => ['required'],
            ]);

            $payment->update([
                'message' => $request->message,
                'status' => $request->status
            ]);
        }
    }

    public function paymentApproved(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'client_id', 'service_id', 'request_number', 'amount')
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'approved');
            })
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('id', 'request_id', 'payment_method_id', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name', 'type');
                        },
                        'receipt' => function ($query) {
                            $query->select('payment_id', 'reference_number', 'receipt_image');
                        },
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Admin/PaymentTransaction/Approved", [
            'requests' => $requests
        ]);
    }

    public function paymentRejected(Request $request)
    {
        $search = $request->input('search');

        $requests = \App\Models\Journal\Request::select('id', 'client_id', 'service_id', 'request_number', 'amount')
            ->whereHas('assign_editor', function ($query) {
                $query->whereNotNull('published_at');
            })
            ->whereHas('payment', function ($query) {
                $query->where('status', 'rejected');
            })
            ->with([
                'user' => function ($query) {
                    $query->select('id', 'last_name', 'first_name');
                },
                'service' => function ($query) {
                    $query->select('id', 'name');
                },
                'payment' => function ($query) {
                    $query->select('id', 'request_id', 'payment_method_id', 'message', 'status', 'created_at');
                    $query->with([
                        'payment_method' => function ($query) {
                            $query->select('id', 'name');
                        },
                        'receipt' => function ($query) {
                            $query->select('payment_id', 'reference_number', 'receipt_image');
                        },
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', '%' . $search . '%')
                        ->orWhere('amount', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('payment.payment_method', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Admin/PaymentTransaction/Rejected", [
            'requests' => $requests
        ]);
    }
}
