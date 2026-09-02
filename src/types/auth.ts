/**
 * Authentication and User Session Type Definitions
 */

/** Data user yang tersimpan di sessionStorage */
export interface UserToken {
  token: string;
  userId?: string | number;
  name?: string;
  role?: string;
  image?: string | null;
  loginTime?: string;
}
