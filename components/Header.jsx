import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-black text-white p-4 shadow-md">
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/twitter_logo.png" className="w-6 mb-0.5"></img>
          <h1 className="text-xl font-bold">
            <Link href="/">Postly</Link>
          </h1>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-300 transition">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:text-gray-300 transition">
              My Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
