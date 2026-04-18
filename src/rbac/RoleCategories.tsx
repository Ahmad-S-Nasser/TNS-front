import React from "react";
import { RoleCategory } from "./rbac.types";
import { Shield, Users, Cog, LayoutDashboard } from "lucide-react";

interface Props {
  activeCategory: RoleCategory;
  onSelect: (category: RoleCategory) => void;
}

export function RoleCategories({ activeCategory, onSelect }: Props) {
  const categories: { id: RoleCategory; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: "DOCTORS", 
      label: "Doctors", 
      icon: Shield, 
      color: "blue",
      desc: "Medical review & questionnaire management" 
    },
    { 
      id: "MARKETING", 
      label: "Marketing", 
      icon: Users, 
      color: "emerald",
      desc: "Content creation & educational guidance" 
    },
    { 
      id: "IT_SUPPORT", 
      label: "IT Support", 
      icon: Cog, 
      color: "slate",
      desc: "System logs, defaults & account management" 
    },
    { 
      id: "SUPER_ADMIN", 
      label: "Super Admins", 
      icon: LayoutDashboard, 
      color: "rose",
      desc: "Global privileges and root configuration" 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col p-5 rounded-[2rem] text-left transition-all duration-300 border grow ${
            activeCategory === cat.id 
              ? `bg-white border-${cat.color}-100 shadow-xl shadow-${cat.color}-900/5 ring-1 ring-${cat.color}-500/20`
              : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-100"
          }`}
        >
          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center mb-4 ${
            activeCategory === cat.id 
              ? `bg-${cat.color}-500 text-white shadow-lg shadow-${cat.color}-500/20`
              : "bg-slate-200 text-slate-400"
          }`}>
            <cat.icon className="h-5 w-5" />
          </div>
          <span className={`text-[12px] font-black uppercase tracking-widest ${
            activeCategory === cat.id ? `text-${cat.color}-600` : "text-slate-400"
          }`}>
            {cat.label}
          </span>
          <p className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">
            {cat.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
