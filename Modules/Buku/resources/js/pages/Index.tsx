import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage, Pagination, btnDanger, btnGhost, btnPrimary, inputClass, type PageLink } from '@/components/sipustaka-ui';
import type { BukuData } from '../components/BukuForm';

type Props = {
    bukus: { data: BukuData[]; links: PageLink[]; from: number | null; total: number };
    filters: { q: string };
    canManage: boolean;
};

export default function Index({ bukus, filters, canManage }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function cari(e: FormEvent) {
        e.preventDefault();
        router.get('/buku', q ? { q } : {}, { preserveState: true, replace: true });
    }

    function hapus(buku: BukuData) {
        if (confirm(`Hapus buku "${buku.judul}"?`)) {
            router.delete(`/buku/${buku.id}`, { preserveScroll: true });
        }
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Buku', href: '/buku' }]}>
            <Head title="Data Buku" />

            <div className="p-4">
                <FlashMessage />

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">Data Buku</h1>
                    {canManage && (
                        <Link href="/buku/create" className={btnPrimary}>
                            + Tambah Buku
                        </Link>
                    )}
                </div>

                <form onSubmit={cari} className="mb-4 flex max-w-md gap-2">
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari judul, penulis, atau penerbit..."
                        className={inputClass.replace('mt-1 ', '')}
                    />
                    <button type="submit" className={btnGhost}>
                        Cari
                    </button>
                </form>

                <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100 dark:bg-neutral-900">
                            <tr>
                                <th className="px-3 py-2">No</th>
                                <th className="px-3 py-2">Judul</th>
                                <th className="px-3 py-2">Penulis</th>
                                <th className="px-3 py-2">Penerbit</th>
                                <th className="px-3 py-2">Tahun Terbit</th>
                                <th className="px-3 py-2">Stok</th>
                                {canManage && <th className="px-3 py-2">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bukus.data.length === 0 && (
                                <tr>
                                    <td colSpan={canManage ? 7 : 6} className="px-3 py-6 text-center text-neutral-500">
                                        Data buku tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                            {bukus.data.map((b, i) => (
                                <tr key={b.id} className="border-t border-neutral-200 dark:border-neutral-800">
                                    <td className="px-3 py-2">{(bukus.from ?? 1) + i}</td>
                                    <td className="px-3 py-2">{b.judul}</td>
                                    <td className="px-3 py-2">{b.penulis}</td>
                                    <td className="px-3 py-2">{b.penerbit}</td>
                                    <td className="px-3 py-2">{b.tahun_terbit}</td>
                                    <td className="px-3 py-2">{b.stok}</td>
                                    {canManage && (
                                        <td className="flex gap-2 px-3 py-2">
                                            <Link href={`/buku/${b.id}/edit`} className={btnGhost}>
                                                Ubah
                                            </Link>
                                            <button type="button" onClick={() => hapus(b)} className={btnDanger}>
                                                Hapus
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={bukus.links} />
            </div>
        </AppLayout>
    );
}
