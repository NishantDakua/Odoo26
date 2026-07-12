// TODO: replace with real session lookup once auth module is wired
// e.g. const session = await getServerSession(authOptions); return session.user.id;
export function getCurrentUserId(): string {
  return "system";
}
