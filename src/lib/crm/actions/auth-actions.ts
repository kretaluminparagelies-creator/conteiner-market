/**
 * @file auth-actions.ts
 * @description CRM login, logout, password reset (server-side)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use server";

import { redirect } from "next/navigation";
import { site } from "@/lib/constants/site";
import { createSupabaseAuthApiClient } from "@/lib/supabase/auth-api";
import { createSupabaseAuthServerClient } from "@/lib/supabase/server-auth";
import { isSupabaseReadConfigured } from "@/lib/supabase/env";

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Λάθος email ή κωδικός.";
  }
  if (lower.includes("email not confirmed")) {
    return "Το email δεν έχει επιβεβαιωθεί. Supabase → Users → Confirm user.";
  }
  if (lower.includes("redirect") || lower.includes("url")) {
    return "Πρόσθεσε redirect URL στο Supabase: /admin/reset-password";
  }
  if (lower.includes("rate limit")) {
    return "Πολλά email reset σε σύντομο διάστημα. Περίμενε ~1 ώρα ή όρισε κωδικό από Supabase → Users.";
  }
  return message;
}

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

  try {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: mapAuthError(error.message) };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία σύνδεσης";
    return { error: mapAuthError(message) };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function requestPasswordResetAction(email: string) {
  if (!isSupabaseReadConfigured()) {
    return { error: "Supabase δεν είναι ρυθμισμένο." };
  }

  const trimmed = email.trim();
  if (!trimmed) {
    return { error: "Βάλε το email σου." };
  }

  try {
    const supabase = createSupabaseAuthApiClient();
    const baseUrl = site.url.replace(/\/$/, "");
    const redirectTo = `${baseUrl}/admin/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    return {
      success: "Στάλθηκε email reset. Άνοιξε τον σύνδεσμο και όρισε νέο κωδικό.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία αποστολής email";
    return { error: mapAuthError(message) };
  }
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
