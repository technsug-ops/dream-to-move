import Link from "next/link";

import { AdminDashboard } from "@/components/admin-dashboard";

import styles from "./page.module.css";

export const revalidate = 0;

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>dream to move</p>
            <h1>Admin Takip Paneli</h1>
            <p>Yeni talepleri gor, durum guncelle, teklif bilgisini kaydet.</p>
          </div>
          <Link href="/">Ana Sayfaya Don</Link>
        </header>

        <AdminDashboard />
      </main>
    </div>
  );
}
