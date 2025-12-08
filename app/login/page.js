export default function LoginPage() {
  const handleClick = async (e) => {};

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log in to your account</h1>

      <form className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          type="email"
        />
        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
        />

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleClick}
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Forgot your password?{" "}
        <a href="/" className="text-blue-600 hover:underline">
          Reset
        </a>
      </p>
    </div>
  );
}
