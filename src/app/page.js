import Image from "next/image";
import styles from "./page.module.css";
import Chat from "@/components/chat";
import './globals.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Chat />
    </main>
  );
}
