
import { NextResponse } from 'next/server';
import { generateWeeklyReport } from '@/ai/genkit';

// Force the API route to use the full Node.js runtime.
// This is required for Genkit's tracing and context management (async_hooks).
export const runtime = 'nodejs';

// This function handles POST requests to /api/generate-report
export async function POST(request: Request) {
  try {
    // Get the data snapshot from the request body
    const firestoreData = await request.json();

    // Call the server-side Genkit function
    const report = await generateWeeklyReport(firestoreData);

    // Return the generated report in the response
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error in /api/generate-report:', error);
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
