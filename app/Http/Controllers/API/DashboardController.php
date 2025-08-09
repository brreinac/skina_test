<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        // cache por 30 segundos (ajusta según necesidad)
        $data = Cache::remember('dashboard_stats', 30, function () {
            $users = User::count();
            $categories = Category::count();
            $subcategories = Subcategory::count();
            $products = Product::count();

            $recentProducts = Product::with('subcategories')
                ->latest()
                ->take(5)
                ->get(['id','name','created_at']);

            return [
                'counts' => [
                    'users' => $users,
                    'categories' => $categories,
                    'subcategories' => $subcategories,
                    'products' => $products,
                ],
                'recent_products' => $recentProducts,
                'generated_at' => now()->toDateTimeString(),
            ];
        });

        return response()->json($data);
    }
}
