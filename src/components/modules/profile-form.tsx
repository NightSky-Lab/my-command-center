"use client";

import * as React from "react";
import { UserCircle, Save, Mail, Phone, MapPin, School, Briefcase, Check, KeyRound, LogOut, ShieldCheck } from "lucide-react";
import type { CurrentUser } from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { checkPassword, setPassword, logout } from "@/lib/auth";
import { TABLES } from "@/lib/tables";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileExtras {
  school: string;
  email: string;
  phone: string;
  address: string;
}

const LS_KEY = "mypi-profile-extras";

export function ProfileForm({ user }: { user: CurrentUser }) {
  const supabase = getSupabaseBrowser();
  const [name, setName] = React.useState(user.name);
  const [role, setRole] = React.useState(user.role);
  const [avatar, setAvatar] = React.useState(user.avatar_url ?? "");
  const [extras, setExtras] = React.useState<ProfileExtras>({
    school: "Sekolah Kebangsaan Seri Bestari",
    email: "azhari@moe.edu.my",
    phone: "012-3456789",
    address: "Pejabat Pendidikan Daerah",
  });
  const [saving, setSaving] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setExtras((e) => ({ ...e, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const save = async () => {
    setSaving(true);
    setDone(false);
    try {
      if (supabase) {
        await supabase
          .from(TABLES.users)
          .update({ name, role, avatar_url: avatar || null })
          .eq("id", user.id);
      }
      localStorage.setItem(LS_KEY, JSON.stringify(extras));
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const ext = (k: keyof ProfileExtras) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setExtras((p) => ({ ...p, [k]: e.target.value }));

  // ---- Change password ----
  const [curPw, setCurPw] = React.useState("");
  const [newPw, setNewPw] = React.useState("");
  const [confirmPw, setConfirmPw] = React.useState("");
  const [pwMsg, setPwMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const changePassword = () => {
    if (!checkPassword(curPw)) {
      setPwMsg({ ok: false, text: "Kata laluan semasa salah." });
      return;
    }
    if (newPw.length < 4) {
      setPwMsg({ ok: false, text: "Kata laluan baharu mesti sekurang-kurangnya 4 aksara." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "Pengesahan kata laluan tidak sepadan." });
      return;
    }
    setPassword(newPw);
    setCurPw("");
    setNewPw("");
    setConfirmPw("");
    setPwMsg({ ok: true, text: "Kata laluan berjaya ditukar." });
  };

  return (
    <div className="animate-fade-in space-y-5">
      <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <UserCircle className="size-6 text-brand" /> Profil Pengguna
      </h1>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
          <div className="mx-auto mb-3 grid size-24 place-items-center">
            <Avatar src={avatar || null} fallback={initials} alt={name} className="size-24 text-2xl" />
          </div>
          <p className="text-lg font-bold text-foreground">{name}</p>
          <p className="text-sm text-brand">{role}</p>
          <div className="mt-4 space-y-2 text-left text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><School className="size-4 text-brand" /> {extras.school}</p>
            <p className="flex items-center gap-2"><Mail className="size-4 text-brand" /> {extras.email}</p>
            <p className="flex items-center gap-2"><Phone className="size-4 text-brand" /> {extras.phone}</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-brand" /> {extras.address}</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-foreground">Kemas Kini Maklumat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role"><Briefcase className="mr-1 inline size-3.5" /> Jawatan</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="school">Sekolah</Label>
              <Input id="school" value={extras.school} onChange={ext("school")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={extras.email} onChange={ext("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" value={extras.phone} onChange={ext("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatar">URL Gambar Profil</Label>
              <Input id="avatar" value={avatar} placeholder="https://…" onChange={(e) => setAvatar(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" rows={2} value={extras.address} onChange={ext("address")} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button variant="brand" onClick={save} disabled={saving}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
            {done && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                <Check className="size-4" /> Disimpan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security: change password + logout */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-foreground">
          <ShieldCheck className="size-5 text-brand" /> Keselamatan
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">Tukar kata laluan log masuk anda.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="curpw">Kata Laluan Semasa</Label>
            <Input id="curpw" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newpw">Kata Laluan Baharu</Label>
            <Input id="newpw" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confpw">Sahkan Kata Laluan</Label>
            <Input id="confpw" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </div>
        </div>
        {pwMsg && (
          <p className={`mt-3 rounded-md px-3 py-2 text-xs ${pwMsg.ok ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
            {pwMsg.text}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button variant="brand" onClick={changePassword}>
            <KeyRound className="size-4" /> Tukar Kata Laluan
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Log keluar dari sistem?")) {
                logout();
                window.location.reload();
              }
            }}
            className="text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" /> Log Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
