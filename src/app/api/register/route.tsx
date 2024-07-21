import { NextRequest, NextResponse } from "next/server";

import { FormDataSchema } from "@/lib/schemas/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = FormDataSchema.safeParse(data);

  if (parsed.success) {
    // Add parsed.data to the database
    return NextResponse.json({
      message: "Form submitted!",
      data: parsed.data,
      success: true,
    });
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
