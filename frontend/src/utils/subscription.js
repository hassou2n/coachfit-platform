export function getValidSubscription() {
  const raw = localStorage.getItem("subscription");
  if (!raw) return null;

  const sub = JSON.parse(raw);

  if (Date.now() > sub.expiresAt) {
    localStorage.removeItem("subscription");
    return null;
  }

  return sub;
}
