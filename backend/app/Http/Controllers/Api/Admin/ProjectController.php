<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\ProjectGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::with('galleries')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'location' => 'required|string',
            'year' => 'required|string',
            'cover_image' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery_images' => 'nullable|array|max:10',
            'gallery_images.*' => 'image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $coverPath = $request->file('cover_image')->store('projects', 'public');

        $project = Project::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'year' => $validated['year'],
            'cover_image' => $coverPath,
        ]);

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');
                ProjectGallery::create([
                    'project_id' => $project->id,
                    'image_url' => $path,
                ]);
            }
        }

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'PROJECT_CREATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => 201,
        ]);

        return response()->json([
            'message' => 'Proyek berhasil ditambahkan',
            'project' => $project->load('galleries'),
        ], 201);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'year' => 'sometimes|string',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery_images' => 'nullable|array|max:10',
            'gallery_images.*' => 'image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($project->cover_image) {
                Storage::disk('public')->delete($project->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('projects', 'public');
        }

        $project->update($validated);

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');
                ProjectGallery::create([
                    'project_id' => $project->id,
                    'image_url' => $path,
                ]);
            }
        }

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'PROJECT_UPDATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['project_id' => $project->id]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Proyek berhasil diperbarui',
            'project' => $project->load('galleries'),
        ]);
    }

    public function destroy(Request $request, Project $project)
    {
        foreach ($project->galleries as $gallery) {
            Storage::disk('public')->delete($gallery->image_url);
        }
        Storage::disk('public')->delete($project->cover_image);

        $projectId = $project->id;
        $project->delete();

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'PROJECT_DELETED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['project_id' => $projectId]),
            'status_code' => 200,
        ]);

        return response()->json(['message' => 'Proyek berhasil dihapus']);
    }
}