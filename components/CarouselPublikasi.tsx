"use client";

import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

type Publication = {
  id: number;
  judul: string;
  tahun: number;
  kategori: string;
  deskripsi: string;
  cover: string | null;
  fileUrl: string | null;
};

const PLACEHOLDER_IMG =
  "https://placehold.co/280x373/e9ecef/6c757d?text=Buku+IPK";

async function fetchPublikasi() {
  const res = await fetch("/api/publikasi");
  if (!res.ok) throw new Error("Gagal mengambil data publikasi");
  const json = await res.json();
  return json.data as Publication[];
}

export default function CarouselPublikasi() {
  const { data: publications, isLoading, error } = useQuery({
    queryKey: ["publications"],
    queryFn: fetchPublikasi,
  });

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track || !publications || publications.length === 0) return;

    let currentPosition = 0;
    let lastTime = 0;
    let animFrame: number;
    let isDragging = false;
    let isHovered = false;
    let startX = 0;
    let dragStartPosition = 0;
    let lastDragX = 0;
    let dragVelocity = 0;
    const speed = 35; // Kecepatan gerak otomatis (pixel per detik)
    const gap = 24; // gap-6 di Tailwind = 24px

    // Hitung total lebar satu set buku asli
    const getSingleSetWidth = () => {
      let width = 0;
      for (let i = 0; i < publications.length; i++) {
        const child = track.children[i] as HTMLElement | undefined;
        if (child) {
          width += child.offsetWidth + gap;
        }
      }
      return width;
    };

    const applyPosition = () => {
      track.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
    };

    const normalizePosition = () => {
      const setWidth = getSingleSetWidth();
      if (setWidth <= 0) return;
      if (currentPosition <= -setWidth) {
        currentPosition += setWidth;
      }
      if (currentPosition > 0) {
        currentPosition -= setWidth;
      }
    };

    // Loop animasi requestAnimationFrame
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!isDragging && !isHovered) {
        currentPosition -= speed * (delta / 1000);
        normalizePosition();
        applyPosition();
      }

      animFrame = requestAnimationFrame(animate);
    };

    // Pause on hover
    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };

    // Mouse & touch dragging
    const startDrag = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      carousel.style.cursor = "grabbing";
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      dragStartPosition = currentPosition;
      lastDragX = startX;
      dragVelocity = 0;
    };

    const moveDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      currentPosition = dragStartPosition + (clientX - startX);
      dragVelocity = clientX - lastDragX;
      lastDragX = clientX;
      normalizePosition();
      applyPosition();
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = "grab";
      currentPosition += dragVelocity * 2.5; // Efek inersia saat dilepas
      normalizePosition();
      applyPosition();
    };

    carousel.addEventListener("mouseenter", onMouseEnter);
    carousel.addEventListener("mouseleave", onMouseLeave);

    carousel.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", endDrag);

    carousel.addEventListener("touchstart", startDrag, { passive: true });
    window.addEventListener("touchmove", moveDrag, { passive: true });
    window.addEventListener("touchend", endDrag);

    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      carousel.removeEventListener("mouseenter", onMouseEnter);
      carousel.removeEventListener("mouseleave", onMouseLeave);
      carousel.removeEventListener("mousedown", startDrag);
      window.removeEventListener("mousemove", moveDrag);
      window.removeEventListener("mouseup", endDrag);
      carousel.removeEventListener("touchstart", startDrag);
      window.removeEventListener("touchmove", moveDrag);
      window.removeEventListener("touchend", endDrag);
    };
  }, [publications]);

  if (isLoading) {
    return (
      <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-zinc-500 text-sm">Memuat koleksi buku digital...</p>
      </section>
    );
  }

  if (error || !publications || publications.length === 0) {
    return null;
  }

  // Gandakan array 3x untuk seamless infinite looping
  const displayItems = [...publications, ...publications, ...publications];

  return (
    <section className="section-alt section-py">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
        <SectionHeader
          eyebrow="PUBLIKASI IPK"
          title="Koleksi Buku Digital"
          description="Jelajahi publikasi IPK yang menyajikan hasil pengukuran dan perkembangan pembangunan kebudayaan Indonesia."
          maxWidth="max-w-2xl"
          className="mb-14"
        />
      </div>

      {/* Area carousel */}
      <div
        ref={carouselRef}
        style={{ cursor: "grab" }}
        className="relative w-full overflow-hidden select-none py-4 touch-pan-y"
      >
        {/* Soft fade di sisi kiri dan kanan */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

        {/* Track yang digerakkan oleh transform */}
        <div
          ref={trackRef}
          className="flex gap-6 w-max will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {displayItems.map((item, index) => {
            const imgSrc = item.cover || PLACEHOLDER_IMG;

            return (
              <div
                key={`${item.id}-${index}`}
                className="w-[230px] sm:w-[260px] md:w-[280px] shrink-0"
              >
                <Link
                  href={`/pages/detail-publikasi?id=${item.id}`}
                  draggable={false}
                  className="block group/item transition-transform duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md group-hover/item:shadow-2xl transition-all duration-300 p-2">
                    <img
                      src={imgSrc}
                      alt={item.judul}
                      draggable={false}
                      className="w-full h-full object-cover rounded-xl pointer-events-none"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
                      }}
                    />
                  </div>

                  <h3 className="mt-4 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover/item:text-[#B8860B] line-clamp-2 leading-snug px-2 transition-colors">
                    {item.judul}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol jelajahi koleksi buku */}
      <div className="mt-14 flex justify-center">
        <Button variant="gold" showArrow href="publikasi/koleksi-buku">
          Jelajahi Koleksi Buku
        </Button>
      </div>
    </section>
  );
}