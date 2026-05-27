import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, this would save to the database
    console.log("[v0] PHQ-9 submission received:", {
      totalScore: body.totalScore,
      severity: body.severity,
      item9Score: body.item9Score,
      timestamp: new Date().toISOString(),
    });

    // Check for high-risk situation (item 9 score >= 1)
    if (body.item9Score >= 1) {
      console.log("[v0] HIGH RISK ALERT: Item 9 score indicates self-harm ideation");
      // In a real app, this would trigger notification to Puskesmas
    }

    // Check for severe depression
    if (body.totalScore >= 15) {
      console.log("[v0] URGENT: Severe depression detected, notifying Puskesmas");
      // In a real app, this would trigger urgent notification
    }

    return NextResponse.json({ 
      success: true,
      message: "PHQ-9 result saved successfully" 
    });
  } catch (error) {
    console.error("[v0] Error processing PHQ-9:", error);
    return NextResponse.json(
      { error: "Failed to save PHQ-9 result" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In a real app, this would fetch PHQ-9 history from database
  return NextResponse.json({
    history: [],
    nextDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });
}
