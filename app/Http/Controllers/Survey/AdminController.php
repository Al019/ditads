<?php

namespace App\Http\Controllers\Survey;

use App\Http\Controllers\Controller;
use App\Models\Survey\Option;
use App\Models\Survey\Question;
use App\Models\Survey\Survey;
use App\Models\Survey\SurveyAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
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

    public function apiPublishSurvey(Request $request)
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

    public function viewSurvey(Request $request, $survey_id)
    {
        $survey = Survey::find($survey_id);

        if (!$survey) {
            abort(404);
        }

        $notAssignEnumeratorSearch = $request->input('notAssignEnumeratorSearch');

        $assignEnumeratorSearch = $request->input('assignEnumeratorSearch');

        $notAssignEnumerators = User::select('id', 'last_name', 'first_name')
            ->where('role', operator: 'enumerator')
            ->when($notAssignEnumeratorSearch, function ($query) use ($notAssignEnumeratorSearch) {
                $query->where(function ($q) use ($notAssignEnumeratorSearch) {
                    $q->orWhere('last_name', 'like', '%' . $notAssignEnumeratorSearch . '%');
                    $q->orWhere('first_name', 'like', '%' . $notAssignEnumeratorSearch . '%');
                });
            })
            ->whereDoesntHave('survey_assignment', function ($query) use ($survey) {
                $query->where('survey_id', $survey->id);
            })
            ->paginate(10);

        $assignEnumerators = User::select('id', 'last_name', 'first_name')
            ->where('role', 'enumerator')
            ->when($assignEnumeratorSearch, function ($query) use ($assignEnumeratorSearch) {
                $query->where(function ($q) use ($assignEnumeratorSearch) {
                    $q->orWhere('last_name', 'like', '%' . $assignEnumeratorSearch . '%');
                    $q->orWhere('first_name', 'like', '%' . $assignEnumeratorSearch . '%');
                });
            })
            ->whereHas('survey_assignment', function ($query) use ($survey) {
                $query->where('survey_id', $survey->id);
            })
            ->withCount([
                'response' => function ($query) use ($survey) {
                    $query->where('survey_id', $survey->id);
                    $query->whereHas('answer');
                }
            ])
            ->paginate(10);

        return Inertia::render("Survey/Admin/Survey/View", [
            'survey_id' => $survey_id,
            'notAssignEnumerators' => $notAssignEnumerators,
            'assignEnumerators' => $assignEnumerators,
        ]);
    }

    public function assignEnumerator(Request $request)
    {
        SurveyAssignment::create([
            'survey_id' => $request->survey_id,
            'enumerator_id' => $request->enumerator_id,
        ]);
    }

    public function removeAssignEnumerator(Request $request)
    {
        SurveyAssignment::where('survey_id', $request->survey_id)
            ->where('enumerator_id', $request->enumerator_id)
            ->delete();
    }
}
