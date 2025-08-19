import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  // 1. Read cookie
    const token = cookies().get("token")?.value;
    console.log("Token from cookies:", token);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Verify JWT
    const user = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Return user
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
