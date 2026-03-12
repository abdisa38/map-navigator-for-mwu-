<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function index(Request $request)
    {
        $query = Building::with('category');

        if ($request->has('category')) {
            $slug = $request->input('category');
            $query->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        if ($request->has('q')) {
            $search = $request->input('q');
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $building = Building::with('category')->findOrFail($id);
        return response()->json($building);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $building = Building::create($request->all());

        return response()->json($building, 201);
    }

    public function update(Request $request, $id)
    {
        $building = Building::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $building->update($request->all());

        return response()->json($building);
    }

    public function destroy($id)
    {
        $building = Building::findOrFail($id);
        $building->delete();

        return response()->json(['message' => 'Building deleted successfully']);
    }
}
