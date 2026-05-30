export function SetupNotice() {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <h2 className="text-lg font-semibold">Database setup needed</h2>
      <p className="mt-2 leading-7">
        Add your Neon connection string to <code>.env</code> as{" "}
        <code>DATABASE_URL</code>, then run{" "}
        <code>pnpm prisma migrate dev --name init</code>. The UI is ready, but
        saved medications and dose logs need that database connection.
      </p>
    </section>
  );
}
