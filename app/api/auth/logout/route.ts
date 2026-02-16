import { NextResponse } from "next/server";

// to handle user logout
export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, 
  });
  return response;
}