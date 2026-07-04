/**
 * @file crm-session-header.ts
 * @description Pass CRM user email from proxy to Server Components (avoids duplicate getUser)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

/** Set by proxy after auth.getUser(); read in admin layout/pages */
export const CRM_USER_EMAIL_HEADER = "x-crm-user-email";
