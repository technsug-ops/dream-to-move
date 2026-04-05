export function isAdminAuthorized(providedKey: string | null): boolean {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return false;
  }

  return providedKey === adminKey;
}
