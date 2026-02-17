import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to ApiGuard</h1>
      <p className="mt-4 text-muted-foreground">
        Hello, {session.user?.name || session.user?.email}!
      </p>
    </div>
  );
}
