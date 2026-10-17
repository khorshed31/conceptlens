<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalysisController;


Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'ConceptLens API is working!',
    ]);
});

// Generate AI feedback
Route::post('/analyses',[AnalysisController::class, 'store'])->middleware('throttle:5,1');

// Get saved analyses
Route::get('/analyses',[AnalysisController::class, 'index']);

// Get a specific analysis
Route::get('/analyses/{analysis}',[AnalysisController::class, 'show']);

// Delete an analysis
Route::delete('/analyses/{analysis}',[AnalysisController::class, 'destroy']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
