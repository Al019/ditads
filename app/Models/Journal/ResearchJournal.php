<?php

namespace App\Models\Journal;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchJournal extends Model
{
    protected $table = "research_journals";

    protected $fillable = [
        'assign_editor_id',
        'title',
        'author',
    ];

    public function assign_editor(): BelongsTo
    {
        return $this->belongsTo(AssignEditor::class, 'assign_editor_id');
    }
}
