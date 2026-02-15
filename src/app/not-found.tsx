import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-md text-center text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button className="bg-brand-purple hover:bg-brand-purple/90">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
