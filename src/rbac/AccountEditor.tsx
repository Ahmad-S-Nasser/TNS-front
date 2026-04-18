import React, { useState } from "react";
import { AdminAccount, Permission, RoleCategory } from "./rbac.types";
import { rbacService } from "./rbac.service";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, Check, X, 
  Info, AlertTriangle, RefreshCw 
} from "lucide-react";

interface Props {
  account: AdminAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const PERMISSIONS: { id: Permission; label: string; group: string }[] = [
  { id: 'content.create', label: 'Create Content', group: 'Content' },
  { id: 'content.publish', label: 'Publish Live', group: 'Content' },
  { id: 'content.review', label: 'Medical Review', group: 'Content' },
  { id: 'content.delete', label: 'Delete Content', group: 'Content' },
  { id: 'questions.create', label: 'Create Questions', group: 'Health' },
  { id: 'questions.answer', label: 'Answer Inquiries', group: 'Health' },
  { id: 'questionnaires.manage', label: 'Manage Questionnaires', group: 'Health' },
  { id: 'faqs.manage', label: 'Manage FAQs', group: 'Health' },
  { id: 'analytics.view', label: 'View Analytics', group: 'Intelligence' },
  { id: 'health_intelligence.view', label: 'View Heatmaps', group: 'Intelligence' },
  { id: 'users.manage', label: 'Manage Users', group: 'System' },
  { id: 'rbac.manage', label: 'Manage RBAC', group: 'System' },
  { id: 'system.logs.view', label: 'View Audit Logs', group: 'System' },
  { id: 'settings.manage', label: 'Manage Settings', group: 'System' },
];

export function AccountEditor({ account, open, onOpenChange, onSave }: Props) {
  if (!account) return null;

  const defaults = rbacService.getCategoryDefaults(account.roleCategory);
  const [overrides, setOverrides] = useState(account.overrides);

  const getOverride = (p: Permission) => overrides.find(o => o.permission === p);

  const toggleOverride = (p: Permission, action: 'grant' | 'deny') => {
    const existing = getOverride(p);
    if (existing?.action === action) {
      // Remove override (reset)
      setOverrides(overrides.filter(o => o.permission !== p));
    } else {
      // Set override
      setOverrides([
        ...overrides.filter(o => o.permission !== p),
        {
          permission: p,
          action: action,
          grantedBy: "current-admin", // Simplified
          timestamp: new Date().toISOString()
        } as any
      ]);
    }
  };

  const handleSave = () => {
    // In a real app, we'd call rbacService.updatePermissionOverride for each change
    // For this mock, we just update the account object directly
    account.overrides = overrides;
    onSave();
    onOpenChange(false);
  };

  const resetToDefaults = () => {
    setOverrides([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 rounded-[2.5rem] border-none overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
           <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-xl text-slate-400 shadow-sm">
                 {account.name.charAt(0)}
              </div>
              <div>
                 <DialogTitle className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">
                    Account Privileges: {account.name}
                 </DialogTitle>
                 <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {account.roleCategory} Category Account — {account.email}
                 </DialogDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetToDefaults}
                className="ml-auto rounded-xl gap-2 h-9 border-slate-200 hover:bg-white hover:text-rose-600 hover:border-rose-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Reset Defaults</span>
              </Button>
           </div>
        </DialogHeader>

        <div className="flex h-[500px]">
           {/* Sidebar: Groups */}
           <div className="w-64 border-r border-slate-100 bg-slate-50/20 p-6 space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Permission Mapping</p>
              {Array.from(new Set(PERMISSIONS.map(p => p.group))).map(group => (
                <div key={group} className="px-4 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-white hover:shadow-sm cursor-pointer transition-all">
                   {group}
                </div>
              ))}
              
              <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                 <div className="flex items-center gap-2 text-amber-700">
                    <Info className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Note</span>
                 </div>
                 <p className="text-[10px] font-medium text-amber-600 leading-relaxed">
                    Account-level overrides take precedence over category global defaults.
                 </p>
              </div>
           </div>

           {/* Main Column: Matrix */}
           <ScrollArea className="flex-1 p-8">
              <div className="space-y-2 mb-6 grid grid-cols-3 gap-8 px-4">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Atomic Access Point</span>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Inherited</span>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Privilege Modifier</span>
              </div>

              <div className="space-y-3">
                 {PERMISSIONS.map((p) => {
                    const isInherited = defaults.includes(p.id);
                    const override = getOverride(p.id);
                    
                    return (
                       <div key={p.id} className="grid grid-cols-3 items-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition-colors shadow-sm">
                          <div>
                             <p className="text-xs font-bold text-slate-700">{p.label}</p>
                             <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{p.id}</p>
                          </div>
                          
                          <div className="flex justify-center">
                             {isInherited ? (
                                <Badge variant="outline" className="h-6 gap-1 bg-emerald-50 text-emerald-600 border-emerald-100">
                                   <Check className="h-3 w-3" /> <span className="text-[9px] font-black uppercase">Yes</span>
                                </Badge>
                             ) : (
                                <Badge variant="outline" className="h-6 gap-1 bg-slate-50 text-slate-400 border-slate-200">
                                   <X className="h-3 w-3" /> <span className="text-[9px] font-black uppercase">No</span>
                                </Badge>
                             )}
                          </div>

                          <div className="flex justify-center gap-2">
                             <Button 
                                variant={override?.action === 'grant' ? "default" : "outline"}
                                size="sm" 
                                onClick={() => toggleOverride(p.id, 'grant')}
                                className={`h-8 w-16 text-[9px] font-black uppercase rounded-lg ${
                                   override?.action === 'grant' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-200'
                                }`}
                             >
                               Grant
                             </Button>
                             <Button 
                                variant={override?.action === 'deny' ? "destructive" : "outline"}
                                size="sm" 
                                onClick={() => toggleOverride(p.id, 'deny')}
                                className={`h-8 w-16 text-[9px] font-black uppercase rounded-lg ${
                                   override?.action === 'deny' ? 'bg-rose-500 hover:bg-rose-600' : 'border-slate-200 text-rose-400'
                                }`}
                             >
                               Deny
                             </Button>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </ScrollArea>
        </div>

        <DialogFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-bold">Encrypted Permission Hash: ATS-992-PX</span>
           </div>
           <div className="flex gap-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-xs uppercase text-slate-400">Cancel</Button>
              <Button onClick={handleSave} className="rounded-xl font-black text-xs uppercase px-8 bg-slate-900 hover:bg-black">Save Privilege Overrides</Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
