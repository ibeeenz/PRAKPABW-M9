import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ErrorPage({ status, message }: { status: number; message?: string }) {
    return (
        <AppLayout>
            <Head title={`Error ${status}`} />
            <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
                <h1 className="text-6xl font-bold">{status}</h1>
                <p className="text-lg font-medium">{status === 403 ? 'Akses Ditolak' : 'Terjadi Kesalahan'}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {message ?? 'Anda tidak memiliki hak akses ke halaman ini.'}
                </p>
                <Link
                    href="/dashboard"
                    className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </AppLayout>
    );
}
