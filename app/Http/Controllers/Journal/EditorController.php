<?php

namespace App\Http\Controllers\Journal;

use App\Http\Controllers\Controller;
use App\Models\Journal\AssignEditor;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class EditorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render("Journal/Editor/Dashboard");
    }

    public function assignDocumentPending(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('editor_id', $user_id)
            ->where('status', 'pending')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                        'service' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })->orWhereHas('request.service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Editor/AssignDocument/Pending", [
            'assigns' => $assigns
        ]);
    }

    public function updateAssignDocument(Request $request)
    {
        $assign = AssignEditor::findOrFail($request->id);

        $assign->update([
            'edited_at' => $request->status === 'approved' ? now() : null,
            'status' => $request->status
        ]);
    }

    public function assignDocumentApproved(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('editor_id', $user_id)
            ->where('status', 'approved')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                        'service' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })->orWhereHas('request.service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Editor/AssignDocument/Approved", [
            'assigns' => $assigns
        ]);
    }

    public function assignDocumentRejected(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file', 'status')
            ->where('editor_id', $user_id)
            ->where('status', 'rejected')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                        'service' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })->orWhereHas('request.service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Editor/AssignDocument/Rejected", [
            'assigns' => $assigns
        ]);
    }

    public function pendingPublishDocument(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'edited_file')
            ->where('editor_id', $user_id)
            ->where('status', 'approved')
            ->whereNull('published_at')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                        'service' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(edited_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })->orWhereHas('request.service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Editor/PublishDocument/Pending", [
            "assigns" => $assigns,
        ]);
    }

    public function publishDocument(Request $request)
    {
        $assign = AssignEditor::findOrFail($request->id);

        $request->validate([
            'published_file' => ['required', 'mimes:pdf', 'max:2048']
        ]);

        $file = $request->file('published_file');

        $filename = Str::uuid() . '/' . $file->getClientOriginalName();

        $file->storeAs('journal/published_files', $filename, 'public');

        $assign->update([
            'published_file' => $filename,
            'published_at' => now(),
        ]);
    }

    public function reportPublishDocument(Request $request)
    {
        $user_id = $request->user()->id;

        $search = $request->input('search');

        $assigns = AssignEditor::select('id', 'request_id', 'editor_id', 'published_file', 'published_at')
            ->where('editor_id', $user_id)
            ->where('status', 'approved')
            ->whereNotNull('published_at')
            ->with([
                'request' => function ($query) {
                    $query->select('id', 'client_id', 'service_id');
                    $query->with([
                        'user' => function ($query) {
                            $query->select('id', 'last_name', 'first_name');
                        },
                        'service' => function ($query) {
                            $query->select('id', 'name');
                        }
                    ]);
                }
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(DB::raw("SUBSTRING_INDEX(published_file, '/', -1)"), 'like', '%' . $search . '%')
                        ->orWhereHas('request.user', function ($q) use ($search) {
                            $q->where('last_name', 'like', '%' . $search . '%')
                                ->orWhere('first_name', 'like', '%' . $search . '%');
                        })->orWhereHas('request.service', function ($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->paginate(10);

        return Inertia::render("Journal/Editor/PublishDocument/Published", [
            "assigns" => $assigns,
        ]);
    }
}
