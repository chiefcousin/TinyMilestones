export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-purple">
            TinyMilestones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalized play for every stage
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
