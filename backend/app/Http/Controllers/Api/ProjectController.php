<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('galleries')->latest();

        if ($request->has('category') && $request->category !== 'semua') {
            $query->where('category', $request->category);
        }

        return response()->json($query->paginate(9));
    }

    public function show(Project $project)
    {
        return response()->json($project->load('galleries'));
    }
}