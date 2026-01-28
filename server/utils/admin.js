const normalizeEmail = (value = "") => value.trim().toLowerCase();

const parseAdminEmails = (raw) =>
  (raw || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

export const getAdminEmails = () => parseAdminEmails(process.env.ADMIN_EMAILS);

export const isAdminEmail = (email) => {
  if (!email) return false;
  const normalized = normalizeEmail(email);
  return getAdminEmails().includes(normalized);
};
