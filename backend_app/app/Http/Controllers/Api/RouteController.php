<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RouteController extends Controller
{
    public function getRoute(Request $request)
    {
        $request->validate([
            'from' => 'required|string', // format: lat,lng
            'to' => 'required|string',   // format: lat,lng
            'profile' => 'nullable|string|in:driving,walking,cycling',
        ]);

        $from = explode(',', $request->input('from'));
        $to = explode(',', $request->input('to'));
        $profile = $request->input('profile', 'driving');

        // Map 'walking' to OSRM 'foot' if needed, but 'foot' is standard on demo server usually
        // Actually, the public OSRM server supports: car (driving), bike (cycling), foot (walking)
        $osrmProfile = match ($profile) {
            'walking' => 'foot',
            'cycling' => 'bike',
            default => 'driving', // 'car' on some servers but 'driving' is standard in API v1
        };

        if (count($from) !== 2 || count($to) !== 2) {
            return response()->json(['error' => 'Invalid coordinates format. Use lat,lng'], 400);
        }

        $lat1 = trim($from[0]);
        $lng1 = trim($from[1]);
        $lat2 = trim($to[0]);
        $lng2 = trim($to[1]);

        // OSRM expects: {lon},{lat};{lon},{lat}
        $coords = "{$lng1},{$lat1};{$lng2},{$lat2}";
        $baseUrl = env('OSRM_BASE_URL', 'http://router.project-osrm.org');
        
        $url = "{$baseUrl}/route/v1/{$osrmProfile}/{$coords}?overview=full&geometries=geojson";

        try {
            $response = Http::get($url);
            
            if ($response->failed()) {
                 return response()->json(['error' => 'Failed to fetch route from OSRM'], 502);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
