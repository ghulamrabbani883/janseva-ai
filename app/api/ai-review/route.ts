import { NextResponse } from "next/server";
import { generateRuleBasedReview } from "@/lib/review-engine";
import type { Application } from "@/types/application";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { application?: Application };
    const application = body.application;

    if (!application) {
      return NextResponse.json({ error: "Application payload required" }, { status: 400 });
    }

    const review = generateRuleBasedReview(application);
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Unable to generate review" }, { status: 500 });
  }
}
