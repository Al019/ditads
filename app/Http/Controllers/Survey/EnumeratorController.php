<?php

namespace App\Http\Controllers\Survey;

use App\Http\Controllers\Controller;
use App\Models\Survey\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnumeratorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render("Survey/Enumerator/Dashboard");
    }

    public function getSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $search = $request->input('search');

        $surveys = Survey::select('id', 'title')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%');
                });
            })
            ->whereHas('survey_assignment', function ($query) use ($user_id) {
                $query->where('enumerator_id', $user_id);
            })
            ->withCount([
                'response as total_response_count',
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                }
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render("Survey/Enumerator/Survey/List", [
            "surveys" => $surveys
        ]);
    }

    public function viewSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::where('id', $request->survey_id)
            ->whereHas('survey_assignment', function ($query) use ($user_id) {
                $query->where('enumerator_id', $user_id);
            })->exists();

        if (!$survey) {
            abort(404);
        }

        return Inertia::render("Survey/Enumerator/Survey/View", [
            "survey_id" => $request->survey_id
        ]);
    }

    public function apiViewSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::select('id', 'title', 'description')
            ->where('id', $request->survey_id)
            ->whereHas('survey_assignment', function ($query) use ($user_id) {
                $query->where('enumerator_id', $user_id);
            })
            ->withCount([
                'response as total_response_count',
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                }
            ])
            ->with('question', function ($query) {
                $query->select('id', 'survey_id', 'text', 'type', 'required');
                $query->with('option', function ($query) {
                    $query->select('id', 'question_id', 'text');
                });
            })
            ->first();

        return response()->json($survey);
    }
}
