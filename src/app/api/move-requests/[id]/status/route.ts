import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { isAdminAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMoveRequestStatusSchema } from "@/lib/move-request";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request.headers.get("x-admin-key"))) {
    return NextResponse.json({ message: "Yetkisiz istek" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateMoveRequestStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Gecersiz veri" },
        { status: 400 },
      );
    }

    const updated = await prisma.moveRequest.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      message: "Talep guncellendi.",
      item: updated,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ message: "Talep bulunamadi" }, { status: 404 });
    }

    console.error(`PATCH /api/move-requests/${id}/status failed`, error);

    return NextResponse.json(
      { message: "Durum guncellenemedi" },
      { status: 500 },
    );
  }
}
