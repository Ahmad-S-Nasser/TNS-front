import React from "react";
import { AdminAccount } from "./rbac.types";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, Edit3, UserMinus, 
  History, ShieldAlert, BadgeCheck 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n/i18n.context";

interface Props {
  accounts: AdminAccount[];
  onEdit: (account: AdminAccount) => void;
}

export function AccountsTable({ accounts, onEdit }: Props) {
  const { t, isRTL } = useI18n();

  return (
    <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden animate-in fade-in duration-700 ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100 h-16">
            <TableHead className={`${isRTL ? "pr-8" : "pl-8"} font-black uppercase text-[10px] text-slate-400 tracking-widest`}>{t("rbac_table_admin")}</TableHead>
            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest p-1">{t("rbac_table_status")}</TableHead>
            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest p-1">{t("rbac_table_level")}</TableHead>
            <TableHead className={`font-black uppercase text-[10px] text-slate-400 tracking-widest ${isRTL ? "text-left pl-8" : "text-right pr-8"}`}>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((acc) => {
            const hasOverrides = acc.overrides.length > 0;
            return (
              <TableRow key={acc.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors h-20">
                <TableCell className={`${isRTL ? "pr-8" : "pl-8"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 ${
                      acc.roleCategory === 'SUPER_ADMIN' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-[#0f172a]">{acc.name}</p>
                      <p className="text-[11px] font-bold text-slate-400 tracking-tight">{acc.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-[9px] font-black uppercase px-2 h-5 rounded-lg border-none ${
                    acc.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {acc.status === 'active' ? t("users_active") : acc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {hasOverrides ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 w-fit">
                       <ShieldAlert className="h-3 w-3 text-amber-600" />
                       <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest">{t("rbac_table_custom")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 w-fit">
                       <BadgeCheck className="h-3 w-3 text-slate-400" />
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          {t("rbac_table_standard")} {
                            acc.roleCategory === 'DOCTORS' ? t("rbac_cat_doctors") :
                            acc.roleCategory === 'MARKETING' ? t("rbac_cat_marketing") :
                            acc.roleCategory === 'IT_SUPPORT' ? t("rbac_cat_it") :
                            acc.roleCategory === 'SUPER_ADMIN' ? t("rbac_cat_super") : acc.roleCategory
                          }
                       </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className={`${isRTL ? "text-left pl-8" : "text-right pr-8"}`}>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"} className="rounded-2xl border-slate-100 p-2 shadow-xl shadow-slate-900/10 min-w-[160px]">
                        <DropdownMenuItem onClick={() => onEdit(acc)} className={`rounded-xl flex items-center gap-3 h-10 font-bold text-xs uppercase cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                           <Edit3 className="h-4 w-4" /> {t("rbac_table_edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className={`rounded-xl flex items-center gap-3 h-10 font-bold text-xs uppercase cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                           <History className="h-4 w-4" /> {t("rbac_table_log")}
                        </DropdownMenuItem>
                        <div className="h-[1px] bg-slate-50 my-2" />
                        <DropdownMenuItem className={`rounded-xl flex items-center gap-3 h-10 font-bold text-xs uppercase cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 ${isRTL ? "flex-row-reverse" : ""}`}>
                           <UserMinus className="h-4 w-4" /> {t("rbac_table_disable")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
