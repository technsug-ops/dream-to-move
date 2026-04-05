"use client";

import { useMemo, useState } from "react";

import {
  HOME_SIZE_LABELS,
  SERVICE_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_VALUES,
  type StatusValue,
} from "@/lib/move-request";

import styles from "./admin-dashboard.module.css";

type MoveRequestItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  homeSize: keyof typeof HOME_SIZE_LABELS;
  serviceType: keyof typeof SERVICE_TYPE_LABELS;
  budget: number | null;
  note: string | null;
  status: StatusValue;
  quoteAmount: number | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

type DraftState = {
  status: StatusValue;
  quoteAmount: string;
  adminNote: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [requests, setRequests] = useState<MoveRequestItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasData = useMemo(() => requests.length > 0, [requests.length]);

  async function loadRequests() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/move-requests", {
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const data = (await response.json()) as {
        items?: MoveRequestItem[];
        isAdmin?: boolean;
        message?: string;
      };

      if (!response.ok || !data.isAdmin || !data.items) {
        setMessage(data.message ?? "Yetkilendirme basarisiz.");
        setRequests([]);
        setDrafts({});
        return;
      }

      setRequests(data.items);
      setDrafts(
        Object.fromEntries(
          data.items.map((item) => [
            item.id,
            {
              status: item.status,
              quoteAmount: item.quoteAmount ? String(item.quoteAmount) : "",
              adminNote: item.adminNote ?? "",
            },
          ]),
        ),
      );
    } catch {
      setMessage("Panel verisi su an alinamiyor.");
    } finally {
      setLoading(false);
    }
  }

  async function updateRequest(id: string) {
    const draft = drafts[id];

    if (!draft) {
      return;
    }

    setMessage(null);

    try {
      const response = await fetch(`/api/move-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          status: draft.status,
          quoteAmount: draft.quoteAmount ? Number(draft.quoteAmount) : null,
          adminNote: draft.adminNote.trim() ? draft.adminNote.trim() : null,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        item?: MoveRequestItem;
      };

      if (!response.ok || !data.item) {
        setMessage(data.message ?? "Guncelleme basarisiz.");
        return;
      }

      setRequests((prev) => prev.map((item) => (item.id === id ? data.item! : item)));
      setMessage(`Talep guncellendi: ${id.slice(0, 8)}`);
    } catch {
      setMessage("Durum guncellenirken hata olustu.");
    }
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span>Admin Anahtari</span>
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder=".env icindeki ADMIN_KEY"
          />
        </label>

        <button className={styles.loadButton} type="button" onClick={loadRequests} disabled={loading || !adminKey}>
          {loading ? "Yukleniyor..." : "Talepleri Getir"}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      {!hasData ? <p className={styles.empty}>Henüz yuklenmis talep yok.</p> : null}

      <div className={styles.list}>
        {requests.map((item) => {
          const draft = drafts[item.id];

          if (!draft) {
            return null;
          }

          return (
            <article className={styles.card} key={item.id}>
              <header className={styles.header}>
                <h3>{item.fullName}</h3>
                <strong>{STATUS_LABELS[item.status]}</strong>
              </header>

              <p>
                <b>Iletisim:</b> {item.phone} / {item.email}
              </p>
              <p>
                <b>Rota:</b> {item.fromAddress} {"->"} {item.toAddress}
              </p>
              <p>
                <b>Detay:</b> {HOME_SIZE_LABELS[item.homeSize]} / {SERVICE_TYPE_LABELS[item.serviceType]}
              </p>
              <p>
                <b>Tarih:</b> {formatDate(item.moveDate)}
              </p>
              <p>
                <b>Butce:</b> {item.budget ? `${item.budget.toLocaleString("tr-TR")} TL` : "Belirtilmedi"}
              </p>
              {item.note ? (
                <p>
                  <b>Not:</b> {item.note}
                </p>
              ) : null}

              <div className={styles.actions}>
                <label className={styles.field}>
                  <span>Durum</span>
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...prev[item.id],
                          status: event.target.value as StatusValue,
                        },
                      }))
                    }
                  >
                    {STATUS_VALUES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Teklif Tutari (TL)</span>
                  <input
                    type="number"
                    min={1}
                    max={1000000}
                    value={draft.quoteAmount}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...prev[item.id],
                          quoteAmount: event.target.value,
                        },
                      }))
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>Admin Notu</span>
                  <textarea
                    rows={3}
                    value={draft.adminNote}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...prev[item.id],
                          adminNote: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
              </div>

              <footer className={styles.footer}>
                <small>Olusturma: {formatDate(item.createdAt)}</small>
                <button type="button" onClick={() => updateRequest(item.id)}>
                  Kaydet
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
