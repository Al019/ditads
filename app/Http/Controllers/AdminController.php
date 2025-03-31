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
        $requests = \App\Models\Journal\Request::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw("COUNT(id) as total_requests")
        )
            ->where('status', 'approved')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $sales = \App\Models\Journal\Request::select(
            DB::raw("DATE_FORMAT(payments.created_at, '%Y-%m') as month"),
            DB::raw("SUM(amount) as total_amount")
        )
            ->join('payments', 'requests.id', '=', 'payments.request_id')
            ->where('payments.status', 'approved')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $published = AssignEditor::select(
            DB::raw("DATE_FORMAT(published_at, '%Y-%m') as month"),
            DB::raw("COUNT(id) as total_published")
        )
            ->whereNotNull('published_at')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return Inertia::render("Dashboard", [
            "requests" => $requests,
            "sales" => $sales,
            "published" => $published
        ]);
    }

    public function getEditor(Request $request)
    {
        $search = $request->input('search');

        $editors = User::select('id', 'first_name', 'last_name', 'email', 'status')
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
            'is_default' => 1,
            'role' => 'editor',
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

    public function getUserProfile($id)
    {
        $information = User::findOrFail($id);

        return Inertia::render("Users/Profile", [
            "information" => $information
        ]);
    }
}
