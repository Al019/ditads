<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\Journal\PaymentMethod;
use App\Models\Journal\Service;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function getService(Request $request)
    {
        $search = $request->input('search');

        $services = Service::when($search, function ($query) use ($search) {
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

        $payments = PaymentMethod::when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
                $q->orWhere('account_name', 'like', '%' . $search . '%');
                $q->orWhere('account_number', 'like', '%' . $search . '%');
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
        $rules = [
            'name' => ['required', Rule::unique('payment_methods')],
        ];

        if ($request->type === 'e-wallet') {
            $rules = array_merge($rules, [
                'account_name' => ['required'],
                'account_number' => ['required'],
            ]);
        }

        $request->validate($rules);

        PaymentMethod::create([
            'name' => $request->name,
            'type' => $request->type,
            'account_name' => $request->type === 'e-wallet' ? $request->account_name : null,
            'account_number' => $request->type === 'e-wallet' ? $request->account_number : null,
        ]);
    }

    public function updatePaymentMethod(Request $request)
    {
        $paymentMethod = PaymentMethod::findOrFail($request->id);

        $rules = [
            'name' => [
                'required',
                Rule::unique('payment_methods')->ignore($paymentMethod->id),
            ],
        ];

        if ($request->type === 'e-wallet') {
            $rules = array_merge($rules, [
                'account_name' => ['required'],
                'account_number' => ['required'],
            ]);
        }

        $request->validate($rules);

        $paymentMethod->update([
            'name' => $request->name,
            'type' => $request->type,
            'account_name' => $request->type === 'e-wallet' ? $request->account_name : null,
            'account_number' => $request->type === 'e-wallet' ? $request->account_number : null,
        ]);
    }

    public function updatePaymentMethodStatus(Request $request)
    {
        PaymentMethod::where("id", $request->id)
            ->update([
                "status" => $request->status
            ]);
    }
}
