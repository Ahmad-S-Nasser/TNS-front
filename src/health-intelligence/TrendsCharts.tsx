import React from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { TrendData } from "./intelligence.types";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  data: TrendData[];
}

export function TrendsCharts({ data }: Props) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Time Series - Disease Signals */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">{t("intel_trends")}</h3>
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="h-2 w-2 rounded-full bg-teal-500/20" />
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSymptom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 10}} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10}} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="symptom" stroke="#0d9488" fillOpacity={1} fill="url(#colorSymptom)" strokeWidth={3} />
              <Area type="monotone" dataKey="vaccine_effect" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution - Availability & Access */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">{t("intel_serviceAccess")}</h3>
          <div className="px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-700 uppercase">{t("intel_seriousAlerts")}</div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(-7)}> {/* Just last 7 days for bar */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 10}} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10}} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="availability" fill="#0f172a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="access" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
