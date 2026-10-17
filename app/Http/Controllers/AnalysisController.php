<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Services\GeminiMisconceptionService;
use Illuminate\Http\Request;
use Throwable;

class AnalysisController extends Controller
{
    public function store(
        Request $request,
        GeminiMisconceptionService $gemini
    ) {
        
        $input = $request->validate([
            'topic' => 'required|string|max:120',
            'notes' => 'required|string|min:50|max:10000',
            'question' => 'required|string|min:10|max:1000',
            'student_answer' =>
                'required|string|min:3|max:2000',
        ]);

        try {
            
            $feedback = $gemini->analyze($input);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => app()->environment('local')
                    ? $e->getMessage()
                    : 'Could not analyze the answer.',
            ], 502);
        }

        $analysis = Analysis::create([
            'topic' => $input['topic'],
            'notes' => $input['notes'],
            'question' => $input['question'],
            'student_answer' => $input['student_answer'],
            'feedback' => $feedback,
        ]);

        return response()->json([
            'message' => 'Analysis completed successfully',
            'data' => $analysis,
        ], 201);
    }

    public function index()
    {
        return response()->json(
            Analysis::latest()->limit(20)->get()
        );
    }

    public function show(Analysis $analysis)
    {
        return response()->json($analysis);
    }

    public function destroy(Analysis $analysis)
    {
        $analysis->delete();

        return response()->json([
            'message' => 'Analysis deleted successfully',
        ]);
    }
}
