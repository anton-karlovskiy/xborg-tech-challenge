const PAGE_URLS = {
  SIGN_IN: "/signin",
  PROFILE: "/profile"
} as const;

const LOCAL_STORAGE_KEYS = {
  TOKEN: "token"
} as const;

const QUERY_KEYS = {
  USER_PROFILE: ["user", "profile"] as const
} as const;

export {
  PAGE_URLS,
  LOCAL_STORAGE_KEYS,
  QUERY_KEYS
};