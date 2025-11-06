import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1>Admin Page</h1>
          <p>Welcome to the admin section of the application.</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
