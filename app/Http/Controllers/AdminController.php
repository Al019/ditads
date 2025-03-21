<?php

namespace App\Http\Controllers;

use App\Models\Journal\AssignEditor;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mail;
use Str;
use Hash;
use App\Mail\PasswordMail;

class AdminController extends Controller
{
    public function dashboard()
    {
        $editor = User::where('role', 'editor')
            ->count();
        $client = User::where('role', 'client')
            ->count();
        $userCount = [$editor, $client];

        $pendingRequest = \App\Models\Journal\Request::where('status', 'pending')
            ->count();
        $publishedDocument = AssignEditor::whereNotNull('published_at')
            ->count();
        $requestCount = [$pendingRequest, $publishedDocument];

        $sales = \App\Models\Journal\Request::select(
            DB::raw("DATE_FORMAT(payments.created_at, '%Y-%m') as month"),
            DB::raw("SUM(amount) as total_amount")
        )
            ->join('payments', 'requests.id', '=', 'payments.request_id')
            ->where('payments.status', 'approved')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return Inertia::render("Dashboard", [
            "userCount" => $userCount,
            "requestCount" => $requestCount,
            "sales" => $sales,
        ]);
    }

    public function getEditor(Request $request)
    {
        $search = $request->input('search');

        $editors = User::select('id', 'first_name', 'last_name', 'email', 'status', 'commission_price_rate')
            ->where('role', 'editor')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('last_name', 'like', '%' . $search . '%')
                        ->orWhere('first_name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('status', 'like', '%' . $search . '%');
                });
            })
            ->paginate(10);

        return Inertia::render("Users/Editor/List", [
            "editors" => $editors,
        ]);
    }

    public function addEditor(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'last_name' => ['required'],
            'first_name' => ['required'],
        ]);

        try {
            $password = Str::random(8);

            Mail::to($request->email)->send(new PasswordMail($password, $request->first_name . ' ' . $request->last_name));

            User::create([
                'last_name' => $request->last_name,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'gender' => $request->gender,
                'email' => $request->email,
                'email_verified_at' => now(),
                'password' => Hash::make($password),
                'role' => 'editor',
                'commission_price_rate' => $request->commission_price_rate ? $request->commission_price_rate : null
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateEditorCommission(Request $request)
    {
        User::findOrFail($request->id)
            ->update([
                'commission_price_rate' => $request->commission_price_rate ? $request->commission_price_rate : null
            ]);
    }

    public function getClient(Request $request)
    {
        $search = $request->input('search');

        $clients = User::select('id', 'first_name', 'last_name', 'email', 'status')
            ->where('role', 'client')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('last_name', 'like', '%' . $search . '%')
                        ->orWhere('first_name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('status', 'like', '%' . $search . '%');
                });
            })
            ->paginate(10);

        return Inertia::render("Users/Client/List", [
            "clients" => $clients,
        ]);
    }
}
