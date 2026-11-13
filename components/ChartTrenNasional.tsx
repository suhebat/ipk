"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type NasionalItem = {
  tahun: number;
  skorIpk: number | null;
};

async function fetchNasional() {
  const res = await fetch("/api/nasional");
  if (!res.ok) throw new Error("Gagal mengambil data");
  const json = await res.json();
  return json.data as NasionalItem[];
}

export default function ChartTrenNasional() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nasional"],
    queryFn: fetchNasional,
  });

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center text-zinc-500">
        Memuat data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-80 flex items-center justify-center text-red-500">
        Gagal memuat data tren IPK
      </div>
    );
  }

  const chartData = data.map((d) => ({
    tahun: d.tahun,
    skor: d.skorIpk,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          {/* Gradasi dari atas (warna emas) ke bawah (transparan) */}
          <defs>
            <linearGradient id="gradasiIpk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8860B" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.35} />
          <XAxis
            dataKey="tahun"
            stroke="#a1a1aa"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <YAxis
            domain={[40, 70]}
            stroke="#a1a1aa"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            formatter={(value: any) => [Number(value ?? 0).toFixed(2), "Skor"]}
          />
          <Area
            type="monotone"
            dataKey="skor"
            stroke="#B8860B"
            strokeWidth={3}
            fill="url(#gradasiIpk)"
            dot={{ fill: "#B8860B", r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7, fill: "#B8860B" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}