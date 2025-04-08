<?php

namespace App\Http\Controllers;

use App\Models\Journal\AssignEditor;
use App\Models\Journal\ResearchJournal;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    public function getResearchJournal(Request $request)
    {
        $search = $request->input('search');

        $journals = ResearchJournal::select('assign_editor_id', 'title')
            ->with([
                'assign_editor' => function ($query) {
                    $query->select('id', 'published_file');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhereHas('assign_editor', function ($q) use ($search) {
                            $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->paginate(10);

        $documents = AssignEditor::select("id", "published_file")
            ->whereDoesntHave('research_journal')
            ->whereHas('request.payment', function ($query) {
                $query->where('status', 'approved');
            })
            ->latest('published_at')
            ->get()
            ->map(function ($document) {
                $document->published_file = basename($document->published_file);
                return $document;
            });

        return Inertia::render("Web/Admin/ResearchJournal", [
            "journals" => $journals,
            "documents" => $documents
        ]);
    }

    public function uploadResearchJournal(Request $request)
    {
        $request->validate([
            'id' => ['required'],
            'title' => ['required'],
            'author' => ['required']
        ], [
            'id.required' => 'The document field is required.'
        ]);

        ResearchJournal::create([
            'assign_editor_id' => $request->id,
            'title' => $request->title,
            'author' => $request->author,
        ]);
    }

    public function welcome()
    {
        return Inertia::render("Web/Welcome");
    }

    public function researchJournal(Request $request)
    {
        $search = $request->input('search');

        $journals = ResearchJournal::select('assign_editor_id', 'title', 'author')
            ->with([
                'assign_editor' => function ($query) {
                    $query->select('id', 'published_file');
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%');
                });
            })
            ->latest()
            ->paginate(50);

        return Inertia::render("Web/ResearchJournal", [
            "journals" => $journals
        ]);
    }
}
