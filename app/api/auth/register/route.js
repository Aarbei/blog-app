import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { nickname, email, password } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Подключаем базу
    await connectDB();

    // Проверяем пользователя
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём нового пользователя
    await User.create({
      nickname,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Your profile was created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
