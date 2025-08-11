<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subcategory;

class SubcategoryController extends Controller
{
    public function index()
    {
        return Subcategory::with('category')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $subcategory = Subcategory::create($data);
        return response()->json($subcategory, 201);
    }

    public function show($id)
    {
        return Subcategory::with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $subcategory = Subcategory::findOrFail($id);
        $subcategory->update($data);

        return response()->json($subcategory);
    }

    public function destroy($id)
    {
        Subcategory::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }
}
