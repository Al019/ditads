<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        return Inertia::render("Dashboard");
    }

    public function getEnumerator(Request $request)
    {
        $search = $request->input('search');

        $enumerators = User::select('id', 'first_name', 'last_name', 'email', 'status')
            ->where('role', 'enumerator')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('last_name', 'like', '%' . $search . '%')
                        ->orWhere('first_name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('status', 'like', '%' . $search . '%');
                });
            })
            ->paginate(10);

        return Inertia::render("Users/Enumerator/List", [
            'enumerators' => $enumerators
        ]);
    }

    public function addEnumerator(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'last_name' => ['required'],
            'first_name' => ['required'],
        ]);

        $password = Str::random(8);

        User::create([
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'gender' => $request->gender,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
            'role' => 'enumerator',
        ]);

        Mail::to($request->email)->send(new PasswordMail($password));
    }

    public function getViewer(Request $request)
    {
        $search = $request->input('search');

        $viewers = User::select('id', 'first_name', 'last_name', 'email', 'status')
            ->where('role', 'viewer')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('last_name', 'like', '%' . $search . '%')
                        ->orWhere('first_name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('status', 'like', '%' . $search . '%');
                });
            })
            ->paginate(10);

        return Inertia::render("Users/Viewer/List", [
            'viewers' => $viewers,
        ]);
    }

    public function addViewer(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'unique:users'],
            'last_name' => ['required'],
            'first_name' => ['required'],
        ]);

        $password = Str::random(8);

        User::create([
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'gender' => $request->gender,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
            'role' => 'viewer',
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

        User::create([
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'gender' => $request->gender,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
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
}
