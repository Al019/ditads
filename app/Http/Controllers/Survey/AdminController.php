<?php

namespace App\Http\Controllers\Survey;

use App\Http\Controllers\Controller;
use App\Models\Survey\Option;
use App\Models\Survey\Question;
use App\Models\Survey\Survey;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render("Survey/Admin/Dashboard");
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

        return Inertia::render("Survey/Admin/User/Enumerator/List", [
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
            'password' => Hash::make($password),
            'role' => 'enumerator',
        ]);
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

        return Inertia::render("Survey/Admin/User/Viewer/List", [
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
            'password' => Hash::make($password),
            'role' => 'viewer',
        ]);
    }

    public function getSurvey(Request $request)
    {
        $search = $request->input('search');

        $surveys = Survey::select('id', 'title', 'created_at')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%');
                });
            })
            ->withCount([
                'survey_assignment',
                'response'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render("Survey/Admin/Survey/List", [
            'surveys' => $surveys
        ]);
    }

    public function createSurvey()
    {
        return Inertia::render("Survey/Admin/Survey/Create");
    }

    public function publishSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::create([
            "admin_id" => $user_id,
            "title" => $request["title"] ?? "Untitled form",
            "description" => $request["description"],
        ]);

        foreach ($request["questions"] as $questionData) {
            $question = Question::create([
                'survey_id' => $survey->id,
                'text' => $questionData['text'],
                'type' => $questionData['type'],
                'required' => $questionData['required'],
            ]);

            foreach ($questionData["options"] as $optionData) {
                Option::create([
                    'question_id' => $question->id,
                    'text' => $optionData['text'],
                ]);
            }
        }
    }
}
