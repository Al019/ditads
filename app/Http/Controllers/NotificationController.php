<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getNotification(Request $request)
    {
        $user_id = $request->user()->id;

        $notifications = Notification::where('user_id', $user_id)
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    public function readNotification(Request $request)
    {
        Notification::find($request->id)
            ->update([
                'is_read' => 1
            ]);
    }
}
