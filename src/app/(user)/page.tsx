import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";

export default function UserPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1>User Page</h1>
          <p>Welcome to the user section of the application.</p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
