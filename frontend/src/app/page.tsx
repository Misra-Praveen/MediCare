import Link from "next/link";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">MediCare+</h1>
      <p className="text-gray-600 mb-6">
        Medicine Inventory & Billing System
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Login
        </Link>

        <Link
          href="/sign-up"
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
