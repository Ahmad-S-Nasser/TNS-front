import React from "react";
import { Permission, RoleCategory } from "./rbac.types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, ClipboardCheck, MessageSquare, 
  BarChart4, ShieldCheck, Mail, Settings 
} from "lucide-react";

interface Props {
  category: RoleCategory;
  defaults: Permission[];
  onToggle: (permission: Permission) => void;
}

const PERMISSION_GROUPS = [
  {
    label: "Content & CMS",
    icon: FileText,
    items: [
      { id: 'content.create', label: 'Create Content' },
      { id: 'content.publish', label: 'Publish Live' },
      { id: 'content.review', label: 'Medical Review' },
      { id: 'content.delete', label: 'Delete Records' }
    ]
  },
  {
    label: "Health Data",
    icon: ClipboardCheck,
    items: [
      { id: 'questionnaires.manage', label: 'Manage Questionnaires' },
      { id: 'faqs.manage', label: 'Manage Guidance (FAQs)' },
      { id: 'questions.create', label: 'Create Questions' },
      { id: 'questions.answer', label: 'Answer Inquiries' }
    ]
  },
  {
    label: "Intelligence & Analytics",
    icon: BarChart4,
    items: [
      { id: 'analytics.view', label: 'View Reports' },
      { id: 'health_intelligence.view', label: 'Access Heatmaps' }
    ]
  },
  {
    label: "Security & System",
    icon: ShieldCheck,
    items: [
      { id: 'users.manage', label: 'User Management' },
      { id: 'rbac.manage', label: 'RBAC Administration' },
      { id: 'system.logs.view', label: 'Audit Logs' },
      { id: 'settings.manage', label: 'Global Settings' }
    ]
  }
];

export function PermissionsMatrix({ category, defaults, onToggle }: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-8 space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between border-b border-slate-50 pb-6">
        <div>
           <Badge variant="outline" className="mb-2 uppercase text-[10px] font-black tracking-widest text-[#0d9488] bg-[#0d9488]/5 border-[#0d9488]/20">
              Global Policy
           </Badge>
           <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tighter">
              {category} Defaults
           </h3>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
               baseline permissions inherited by all accounts in this category.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.label} className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <group.icon className="h-4 w-4" />
                </div>
                <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{group.label}</h4>
             </div>

             <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div>
                       <p className="text-[12px] font-bold text-slate-700">{item.label}</p>
                       <p className="text-[10px] font-medium text-slate-400">{item.id}</p>
                    </div>
                    <Switch 
                      checked={defaults.includes(item.id as Permission)} 
                      onCheckedChange={() => onToggle(item.id as Permission)}
                    />
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
