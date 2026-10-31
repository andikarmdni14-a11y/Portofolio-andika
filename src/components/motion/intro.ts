"use client";

import { useEffect, useState } from "react";

// Koordinasi "intro": saat splash screen atau transisi halaman sedang menutupi
// layar, <html data-intro="pending">. Animasi masuk (RevealText) menunggu sampai
// layar terbuka agar tidak berjalan di balik penutup.

const EVENT = "intro:done";

export function setIntroPending() {
  document.documentElement.dataset.intro = "pending";
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(EVENT));
}

export function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (document.documentElement.dataset.intro !== "pending") setReady(true);
    };
    check();
    window.addEventListener(EVENT, check);
    return () => window.removeEventListener(EVENT, check);
  }, []);

  return ready;
}
