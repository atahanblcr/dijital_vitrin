import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-orange-500">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Sayfa Bulunamadı</h2>
      <p className="mt-4 text-lg text-gray-600">
        Aradığınız işletme veya sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl bg-orange-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-orange-600 shadow-lg shadow-orange-200"
      >
        Anasayfaya Dön
      </Link>
    </div>
  );
}
