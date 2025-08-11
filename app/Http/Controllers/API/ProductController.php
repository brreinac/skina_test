<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('subcategories.category')->get();
    }

    public function show($id)
    {
        return Product::with('subcategories.category')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
            'subcategory_ids' => 'required|array',
            'subcategory_ids.*' => 'exists:subcategories,id',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'is_active' => $request->is_active ?? 1,
        ]);

        $product->subcategories()->sync($request->subcategory_ids);

        return response()->json($product->load('subcategories.category'), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'nullable|boolean',
            'subcategory_ids' => 'required|array',
            'subcategory_ids.*' => 'exists:subcategories,id',
        ]);

        $product = Product::findOrFail($id);

        // Actualiza campos básicos
        $product->update([
            'name' => $request->name,
            'is_active' => $request->is_active ?? 1,
        ]);

        // Actualiza relación de subcategorías
        $product->subcategories()->sync($request->subcategory_ids);

        return response()->json($product->load('subcategories.category'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->subcategories()->detach();
        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
