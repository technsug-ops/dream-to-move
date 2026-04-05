import { z } from "zod";

export const STATUS_VALUES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;
export const HOME_SIZE_VALUES = [
  "STUDIO",
  "ONE_PLUS_ONE",
  "TWO_PLUS_ONE",
  "THREE_PLUS_ONE",
  "FOUR_PLUS_ONE_PLUS",
] as const;
export const SERVICE_TYPE_VALUES = [
  "ONLY_TRANSPORT",
  "PACKING_AND_TRANSPORT",
  "FULL_SERVICE",
] as const;

export const STATUS_LABELS: Record<(typeof STATUS_VALUES)[number], string> = {
  NEW: "Yeni",
  CONTACTED: "Iletisime Gecildi",
  QUOTED: "Teklif Verildi",
  WON: "Onaylandi",
  LOST: "Iptal",
};

export const HOME_SIZE_LABELS: Record<(typeof HOME_SIZE_VALUES)[number], string> = {
  STUDIO: "Studio",
  ONE_PLUS_ONE: "1+1",
  TWO_PLUS_ONE: "2+1",
  THREE_PLUS_ONE: "3+1",
  FOUR_PLUS_ONE_PLUS: "4+1 ve ustu",
};

export const SERVICE_TYPE_LABELS: Record<(typeof SERVICE_TYPE_VALUES)[number], string> = {
  ONLY_TRANSPORT: "Sadece tasima",
  PACKING_AND_TRANSPORT: "Paketleme + tasima",
  FULL_SERVICE: "Tam hizmet",
};

const optionalPositiveInt = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value;
}, z.number().int().positive().max(1_000_000).nullable());

const baseSchema = z.object({
  fullName: z.string().trim().min(3, "Ad soyad en az 3 karakter olmali").max(80),
  email: z.string().trim().email("Gecerli bir e-posta girin"),
  phone: z.string().trim().min(8, "Telefon numarasi kisa"),
  fromAddress: z.string().trim().min(5, "Cikis adresi gerekli").max(180),
  toAddress: z.string().trim().min(5, "Varis adresi gerekli").max(180),
  moveDate: z.coerce.date().refine((date) => date.getTime() > Date.now() - 86_400_000, {
    message: "Tasinma tarihi bugun veya daha ileri olmali",
  }),
  homeSize: z.enum(HOME_SIZE_VALUES),
  serviceType: z.enum(SERVICE_TYPE_VALUES),
  budget: optionalPositiveInt,
  note: z.string().trim().max(500).optional().nullable(),
});

export const createMoveRequestSchema = baseSchema.transform((input) => ({
  ...input,
  note: input.note && input.note.length > 0 ? input.note : null,
}));

export const updateMoveRequestStatusSchema = z
  .object({
    status: z.enum(STATUS_VALUES),
    quoteAmount: optionalPositiveInt,
    adminNote: z.string().trim().max(500).optional().nullable(),
  })
  .transform((input) => ({
    ...input,
    adminNote: input.adminNote && input.adminNote.length > 0 ? input.adminNote : null,
  }));

export type StatusValue = (typeof STATUS_VALUES)[number];
export type HomeSizeValue = (typeof HOME_SIZE_VALUES)[number];
export type ServiceTypeValue = (typeof SERVICE_TYPE_VALUES)[number];
