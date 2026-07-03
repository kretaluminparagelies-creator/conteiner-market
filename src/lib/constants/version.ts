/**
 * @file version.ts
 * @description App version — synced with package.json
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import packageJson from "../../../package.json";

export const appVersion = packageJson.version;

export const appVersionLabel = `v${appVersion}`;
