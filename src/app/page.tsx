

export default function Home() {
  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <a
            href="https://github.com/guneettoppo"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 text-sm font-medium text-gray-600 hover:text-white transition"
        >
          Made by Guneet Toppo
        </a>
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center sm:text-left">
            Welcome to ZeroPass Drive
          </h1>

          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by clicking log in to enter your e-mail address.
            </li>
            <li className="mb-2 tracking-[-.01em]">
              You will get a verification link on your mail which will redirect you to your drive space.
            </li>
            <li className="tracking-[-.01em]">
              Upload your file by clicking upload and use it as cloud storage.
            </li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
                href="/login"
                className="px-4 py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 transition"
            >
              Log in
            </a>
          </div>

          {/* Notes Section */}
          <section className="mt-10 max-w-2xl text-sm sm:text-base text-center sm:text-left text-gray-700 leading-relaxed">
            <h2 className="text-lg font-bold mb-4 text-white">About ZeroPass Drive</h2>
            <p>
              {/* 🔽 Replace this with your own content */}
              ZeroPass Drive is a modern file storage and access system that
              removes the need for passwords. It uses Magic Links(mail verification),
              and WebAuthn to authenticate users. After login, users can upload,
              view, and manage files securely—just like a cloud drive. New user email verification is temporarily
              unavailable due to deployment cost constraints. We’ll enable it soon as we move to a production-ready environment
              Mobile OTP login is architecturally supported but temporarily disabled in production
              to optimize operational costs associated with SMS delivery.
            </p>
            <p className="mt-2">
              Built with Next.js, TailwindCSS, FastAPI backend, and hosted on Vercel & NeonDB,
              it emphasizes security and seamless user experience.
            </p>
          </section>
        </main>
      </div>
  );
}
