<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    public function welcome()
    {
        return Inertia::render("Web/Welcome");
    }
}
