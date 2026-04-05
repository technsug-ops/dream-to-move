"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  HOME_SIZE_LABELS,
  HOME_SIZE_VALUES,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_VALUES,
} from "@/lib/move-request";

import styles from "./move-request-form.module.css";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  homeSize: (typeof HOME_SIZE_VALUES)[number];
  serviceType: (typeof SERVICE_TYPE_VALUES)[number];
  budget: string;
  note: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  fromAddress: "",
  toAddress: "",
  moveDate: "",
  homeSize: "TWO_PLUS_ONE",
  serviceType: "PACKING_AND_TRANSPORT",
  budget: "",
  note: "",
};

function getTodayInputDate() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function MoveRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const minMoveDate = useMemo(() => getTodayInputDate(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        note: form.note.trim() ? form.note.trim() : null,
      };

      const response = await fetch("/api/move-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setIsSuccess(false);
        setMessage(data.message ?? "Talep gonderilemedi.");
        return;
      }

      setIsSuccess(true);
      setMessage(data.message ?? "Talebiniz alindi.");
      setForm(initialState);
      router.refresh();
    } catch {
      setIsSuccess(false);
      setMessage("Beklenmeyen bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Ad Soyad</span>
          <input
            required
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            placeholder="Ornek: Sinan Yilmaz"
          />
        </label>

        <label className={styles.field}>
          <span>E-posta</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="ornek@mail.com"
          />
        </label>

        <label className={styles.field}>
          <span>Telefon</span>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="+90 5xx xxx xx xx"
          />
        </label>

        <label className={styles.field}>
          <span>Tasinma Tarihi</span>
          <input
            required
            type="date"
            min={minMoveDate}
            value={form.moveDate}
            onChange={(event) => setForm((prev) => ({ ...prev, moveDate: event.target.value }))}
          />
        </label>

        <label className={styles.field}>
          <span>Ev Buyuklugu</span>
          <select
            value={form.homeSize}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                homeSize: event.target.value as FormState["homeSize"],
              }))
            }
          >
            {HOME_SIZE_VALUES.map((value) => (
              <option key={value} value={value}>
                {HOME_SIZE_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Hizmet Tipi</span>
          <select
            value={form.serviceType}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                serviceType: event.target.value as FormState["serviceType"],
              }))
            }
          >
            {SERVICE_TYPE_VALUES.map((value) => (
              <option key={value} value={value}>
                {SERVICE_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>Cikis Adresi</span>
        <input
          required
          value={form.fromAddress}
          onChange={(event) => setForm((prev) => ({ ...prev, fromAddress: event.target.value }))}
          placeholder="Ilce, il, site/mahalle"
        />
      </label>

      <label className={styles.field}>
        <span>Varis Adresi</span>
        <input
          required
          value={form.toAddress}
          onChange={(event) => setForm((prev) => ({ ...prev, toAddress: event.target.value }))}
          placeholder="Ilce, il, site/mahalle"
        />
      </label>

      <label className={styles.field}>
        <span>Butce (Opsiyonel)</span>
        <input
          type="number"
          min={1}
          max={1000000}
          value={form.budget}
          onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
          placeholder="Ornek: 45000"
        />
      </label>

      <label className={styles.field}>
        <span>Not (Opsiyonel)</span>
        <textarea
          rows={4}
          value={form.note}
          onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
          placeholder="Kirilabilir esya, otopark, kat bilgisi vb."
        />
      </label>

      <button className={styles.submit} disabled={pending} type="submit">
        {pending ? "Gonderiliyor..." : "Teklif Talebi Gonder"}
      </button>

      {message ? (
        <p className={isSuccess ? styles.success : styles.error}>{message}</p>
      ) : null}
    </form>
  );
}
