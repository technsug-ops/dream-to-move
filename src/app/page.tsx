import Link from "next/link";

import { MoveRequestForm } from "@/components/move-request-form";
import {
  HOME_SIZE_LABELS,
  SERVICE_TYPE_LABELS,
  STATUS_LABELS,
  type HomeSizeValue,
  type ServiceTypeValue,
  type StatusValue,
} from "@/lib/move-request";
import { prisma } from "@/lib/prisma";

import styles from "./page.module.css";

export const revalidate = 0;

type PublicMoveRequest = {
  id: string;
  fromAddress: string;
  toAddress: string;
  moveDate: Date;
  homeSize: HomeSizeValue;
  serviceType: ServiceTypeValue;
  status: StatusValue;
  createdAt: Date;
};

async function getRecentRequests(): Promise<PublicMoveRequest[]> {
  return prisma.moveRequest.findMany({
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
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
  }).format(date);
}

export default async function Home() {
  const recentRequests = await getRecentRequests();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>dream to move</p>
          <h1>Ev tasima tekliflerini tek ekrandan topla, hizli donus yap.</h1>
          <p>
            Bu MVP, musteri talebi olusturma ve ekip tarafinda durum takibi icin tasarlandi.
            Fazlalik yok: form, API, DB ve admin paneli.
          </p>
          <div className={styles.heroActions}>
            <a href="#talep-formu" className={styles.primaryAction}>
              Teklif Talebi Ac
            </a>
            <Link href="/admin" className={styles.secondaryAction}>
              Admin Paneli
            </Link>
          </div>
        </section>

        <section id="talep-formu" className={styles.formSection}>
          <h2>Yeni Tasima Talebi</h2>
          <MoveRequestForm />
        </section>

        <section className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h2>Son Talepler</h2>
            <span>{recentRequests.length} kayit</span>
          </div>

          {recentRequests.length === 0 ? (
            <p className={styles.emptyFeed}>Henuz talep yok. Ilk talebi formdan olustur.</p>
          ) : (
            <ul className={styles.requestList}>
              {recentRequests.map((item) => (
                <li key={item.id} className={styles.requestCard}>
                  <p className={styles.route}>
                    {item.fromAddress} {"->"} {item.toAddress}
                  </p>
                  <p>
                    {HOME_SIZE_LABELS[item.homeSize]} / {SERVICE_TYPE_LABELS[item.serviceType]}
                  </p>
                  <p>Tasinma: {formatDate(item.moveDate)}</p>
                  <div className={styles.metaRow}>
                    <span>{STATUS_LABELS[item.status]}</span>
                    <small>Olusturma: {formatDate(item.createdAt)}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
