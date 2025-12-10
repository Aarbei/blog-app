import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  let jsonData;
  try {
    jsonData = await req.json();
  } catch (err) {
    console.error("Failed to parse JSON body:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = jsonData || {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      console.error("User not found for email:", emailClean);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isPasswordCorrect) {
      console.error("Wrong password for user:", emailClean);
      return NextResponse.json({ error: "Wrong credentials" }, { status: 401 });
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      nickname: user.nickname,
    });

    // Возвращаем объект пользователя вместе с ok: true
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        nickname: user.nickname,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
