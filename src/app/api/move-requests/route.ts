import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/auth";
import { createMoveRequestSchema } from "@/lib/move-request";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const isAdmin = isAdminAuthorized(request.headers.get("x-admin-key"));

    if (isAdmin) {
      const items = await prisma.moveRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json({ items, isAdmin: true });
    }

    const items = await prisma.moveRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        fromAddress: true,
        toAddress: true,
        moveDate: true,
        homeSize: true,
        serviceType: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ items, isAdmin: false });
  } catch (error) {
    console.error("GET /api/move-requests failed", error);

    return NextResponse.json(
      { message: "Tasima talepleri su an getirilemiyor." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createMoveRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Gecersiz veri" },
        { status: 400 },
      );
    }

    const moveRequest = await prisma.moveRequest.create({
      data: parsed.data,
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Talebiniz alindi. En kisa surede size ulasacagiz.",
        item: moveRequest,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/move-requests failed", error);

    return NextResponse.json(
      { message: "Talep olusturulamadi, lutfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
