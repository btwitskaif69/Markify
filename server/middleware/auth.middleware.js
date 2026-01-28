import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient";

const ADMIN_EMAILS = ["mohdkaif18th@gmail.com"];

const getAuthToken = (headers = {}) => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) return null;
  return authHeader.split(" ")[1];
};

export const requireAuth = async (req) => {
  const token = getAuthToken(req.headers);

  if (!token) {
    return NextResponse.json(
      { message: "Not authorized, no token" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, avatar: true, geminiUsage: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Not authorized, user not found" },
        { status: 401 }
      );
    }

    req.user = user;
    return null;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 }
    );
  }
};

export const requireAdmin = async (req) => {
  if (!req.user || !ADMIN_EMAILS.includes(req.user.email)) {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }

  return null;
};
