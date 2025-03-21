<?php

namespace App\Models;

use App\Models\Journal\AssignEditor;
use App\Models\Journal\Commission;
use App\Models\Journal\Request;
use App\Models\Survey\Response;
use App\Models\Survey\Survey;
use App\Models\Survey\SurveyAssignment;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = "users";

    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'gender',
        'email',
        'email_verified_at',
        'password',
        'contact_number',
        'course',
        'school',
        'school_type',
        'role',
        'status',
        'is_default',
        'commission_price_rate',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function request(): HasMany
    {
        return $this->hasMany(Request::class, 'client_id');
    }

    public function assign_editor(): HasOne
    {
        return $this->hasOne(AssignEditor::class, 'editor_id');
    }

    public function commission(): HasMany
    {
        return $this->hasMany(Commission::class, 'editor_id');
    }
}
