import Link from 'next/link';

export default function SlugNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-gray-800">İşletme Bulunamadı</h2>
      <p className="mt-2 text-gray-600">Aradığınız işletme aktif değil veya adresi yanlış.</p>
      <Link href="http://localhost:3000" className="mt-6 text-orange-500 font-bold hover:underline">
        Platform Anasayfasına Dön
      </Link>
    </div>
  );
}
