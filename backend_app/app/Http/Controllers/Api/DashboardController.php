<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'buildings_count' => Building::count(),
            'users_count' => User::where('role', 'student')->count(),
            'admins_count' => User::where('role', 'admin')->count(),
        ]);
    }
}
