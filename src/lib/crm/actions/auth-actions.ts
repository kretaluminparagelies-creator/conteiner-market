/**
 * @file auth-actions.ts
 * @description CRM login, logout, password change
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server-auth";
import { isSupabaseReadConfigured } from "@/lib/supabase/env";

export async function loginAction(formData: FormData) {
  if (!isSupabaseReadConfigured()) {
    redirect("/admin");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin").trim() || "/admin";

  if (!email || !password) {
    return { error: "Συμπλήρωσε email και κωδικό." };
  }

  const supabase = await createSupabaseAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Λάθος email ή κωδικός." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  if (isSupabaseReadConfigured()) {
    const supabase = await createSupabaseAuthServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

export async function changePasswordAction(formData: FormData) {
  if (!isSupabaseReadConfigured()) {
    return { error: "Auth δεν είναι ενεργό σε preview mode." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return { error: "Συμπλήρωσε όλα τα πεδία." };
  }

  if (newPassword.length < 8) {
    return { error: "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Οι νέοι κωδικοί δεν ταιριάζουν." };
  }

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Δεν είσαι συνδεδεμένος." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Ο τρέχων κωδικός είναι λάθος." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: "Ο κωδικός άλλαξε επιτυχώς." };
}
