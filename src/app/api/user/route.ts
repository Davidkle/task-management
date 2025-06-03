import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<void> },
) {
  return NextResponse.json({ message: `Hello all!` });
}
