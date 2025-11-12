/**
 * Google OAuth profile structure
 * Matches the structure from passport-google-oauth20 and our custom usage
 */
export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
}

/**
 * JWT payload structure
 * Matches what we sign in AuthService.login()
 */
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  iat?: number; // issued at (added by JWT library)
  exp?: number; // expiration (added by JWT library)
}

/**
 * User object attached to request after JWT validation
 * Returned by JwtStrategy.validate()
 */
export interface RequestUser {
  id: string;
  email: string;
}

