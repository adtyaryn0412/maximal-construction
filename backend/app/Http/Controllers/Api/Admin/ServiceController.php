<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::oldest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_image' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $service = Service::create($validated);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'SERVICE_CREATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => 201,
        ]);

        return response()->json([
            'message' => 'Layanan berhasil ditambahkan',
            'service' => $service,
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'icon_image' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $service->update($validated);

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'SERVICE_UPDATED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['service_id' => $service->id]),
            'status_code' => 200,
        ]);

        return response()->json([
            'message' => 'Layanan berhasil diperbarui',
            'service' => $service,
        ]);
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->reservations()->exists()) {
            ActivityLog::record([
                'user_id' => $request->user()->id,
                'action' => 'SERVICE_DELETE_BLOCKED',
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => json_encode(['service_id' => $service->id]),
                'status_code' => 409,
            ]);

            return response()->json([
                'message' => 'Layanan ini tidak bisa dihapus karena masih memiliki riwayat reservasi. Gunakan opsi nonaktifkan sebagai gantinya.',
            ], 409);
        }

        $serviceId = $service->id;
        $service->delete();

        ActivityLog::record([
            'user_id' => $request->user()->id,
            'action' => 'SERVICE_DELETED',
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => json_encode(['service_id' => $serviceId]),
            'status_code' => 200,
        ]);

        return response()->json(['message' => 'Layanan berhasil dihapus']);
    }
}