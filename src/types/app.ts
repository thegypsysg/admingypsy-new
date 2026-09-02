/**
 * Application Domain Model Type Definitions
 */

/** Data aplikasi aktif (dari /app/active) */
export interface AppItem {
  id: number;
  app_id?: number;
  app_name: string;
  app_main_image?: string | null;
}

/** Item aplikasi yang sudah diformat untuk tampilan dashboard / navigation */
export interface AppDisplayItem {
  id: number;
  name?: string;
  title?: string;
  path?: string;
  image?: string | null;
}

/** Data negara dari /countries */
export interface CountryItem {
  ac_id?: number;
  country_id: number;
  country_name: string;
}
