import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Field, btnDanger, btnGhost, btnPrimary, inputClass } from '@/components/sipustaka-ui';

type Peminjaman = {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: 'Dipinjam' | 'Dikembalikan';
    bukti_url: string | null;
};

type Errors = Record<string, string[]>;
type Notice = { type: 'success' | 'error'; text: string } | null;

const emptyForm = {
    nama_peminjam: '',
    judul_buku: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    status: 'Dipinjam',
};

// Laravel menaruh token CSRF di cookie XSRF-TOKEN; dikirim balik lewat header untuk fetch()
function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function api(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    });
    const body = await response.json().catch(() => ({}));

    return { ok: response.ok, status: response.status, body };
}

export default function Index() {
    const [items, setItems] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState<Notice>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [currentBukti, setCurrentBukti] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    // TAMPIL: ambil seluruh data lewat fetch()
    const loadItems = useCallback(async () => {
        setLoading(true);
        const res = await api('/peminjaman/data');
        if (res.ok) {
            setItems(res.body as Peminjaman[]);
        } else {
            setNotice({ type: 'error', text: 'Gagal memuat data peminjaman.' });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(t);
    }, [notice]);

    function openCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setFile(null);
        setCurrentBukti(null);
        setErrors({});
        setModalOpen(true);
    }

    // UBAH: ambil satu data lewat fetch() lalu isi form
    async function openEdit(id: number) {
        const res = await api(`/peminjaman/${id}`);
        if (!res.ok) {
            setNotice({ type: 'error', text: 'Gagal memuat data peminjaman.' });
            return;
        }
        const p = res.body as Peminjaman;
        setEditingId(p.id);
        setForm({
            nama_peminjam: p.nama_peminjam,
            judul_buku: p.judul_buku,
            tanggal_pinjam: p.tanggal_pinjam,
            tanggal_kembali: p.tanggal_kembali,
            status: p.status,
        });
        setFile(null);
        setCurrentBukti(p.bukti_url);
        setErrors({});
        setModalOpen(true);
    }

    // TAMBAH / UBAH: kirim FormData (karena ada file) lewat fetch()
    async function submit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (file) data.append('bukti', file);
        if (editingId) data.append('_method', 'PUT'); // PHP tidak membaca multipart pada method PUT

        const res = await api(editingId ? `/peminjaman/${editingId}` : '/peminjaman', {
            method: 'POST',
            body: data,
        });

        if (res.status === 422) {
            setErrors((res.body.errors ?? {}) as Errors); // pesan error dari Form Request
        } else if (res.ok) {
            setModalOpen(false);
            setNotice({ type: 'success', text: res.body.message });
            await loadItems();
        } else {
            setNotice({ type: 'error', text: res.body.message ?? 'Terjadi kesalahan pada server.' });
        }

        setSaving(false);
    }

    // HAPUS
    async function hapus(p: Peminjaman) {
        if (!confirm(`Hapus data peminjaman "${p.judul_buku}" oleh ${p.nama_peminjam}?`)) return;

        const res = await api(`/peminjaman/${p.id}`, { method: 'DELETE' });
        if (res.ok) {
            setNotice({ type: 'success', text: res.body.message });
            await loadItems();
        } else {
            setNotice({ type: 'error', text: res.body.message ?? 'Gagal menghapus data.' });
        }
    }

    const err = (name: string) => errors[name]?.[0];
    const set = (name: keyof typeof emptyForm) => (e: { target: { value: string } }) =>
        setForm((prev) => ({ ...prev, [name]: e.target.value }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Peminjaman', href: '/peminjaman' }]}>
            <Head title="Peminjaman" />

            <div className="p-4">
                {notice && (
                    <div
                        className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                            notice.type === 'error'
                                ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
                                : 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
                        }`}
                    >
                        {notice.text}
                    </div>
                )}

                <div className="mb-4 flex items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">Peminjaman Buku</h1>
                    <button type="button" className={btnPrimary} onClick={openCreate}>
                        + Tambah Peminjaman
                    </button>
                </div>

                <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100 dark:bg-neutral-900">
                            <tr>
                                <th className="px-3 py-2">No</th>
                                <th className="px-3 py-2">Nama Peminjam</th>
                                <th className="px-3 py-2">Judul Buku</th>
                                <th className="px-3 py-2">Tgl Pinjam</th>
                                <th className="px-3 py-2">Tgl Kembali</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Bukti</th>
                                <th className="px-3 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-neutral-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            )}
                            {!loading && items.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-6 text-center text-neutral-500">
                                        Belum ada data peminjaman.
                                    </td>
                                </tr>
                            )}
                            {items.map((p, i) => (
                                <tr key={p.id} className="border-t border-neutral-200 dark:border-neutral-800">
                                    <td className="px-3 py-2">{i + 1}</td>
                                    <td className="px-3 py-2">{p.nama_peminjam}</td>
                                    <td className="px-3 py-2">{p.judul_buku}</td>
                                    <td className="px-3 py-2">{p.tanggal_pinjam}</td>
                                    <td className="px-3 py-2">{p.tanggal_kembali}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs ${
                                                p.status === 'Dipinjam'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                            }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {p.bukti_url ? (
                                            <a href={p.bukti_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                Lihat berkas
                                            </a>
                                        ) : (
                                            <span className="text-neutral-400">-</span>
                                        )}
                                    </td>
                                    <td className="flex gap-2 px-3 py-2">
                                        <button type="button" className={btnGhost} onClick={() => openEdit(p.id)}>
                                            Ubah
                                        </button>
                                        <button type="button" className={btnDanger} onClick={() => hapus(p)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-950"
                    >
                        <h2 className="text-lg font-semibold">{editingId ? 'Ubah Peminjaman' : 'Tambah Peminjaman'}</h2>

                        <Field label="Nama Peminjam" error={err('nama_peminjam')}>
                            <input className={inputClass} value={form.nama_peminjam} onChange={set('nama_peminjam')} />
                        </Field>

                        <Field label="Judul Buku" error={err('judul_buku')}>
                            <input className={inputClass} value={form.judul_buku} onChange={set('judul_buku')} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Tanggal Pinjam" error={err('tanggal_pinjam')}>
                                <input type="date" className={inputClass} value={form.tanggal_pinjam} onChange={set('tanggal_pinjam')} />
                            </Field>
                            <Field label="Tanggal Kembali" error={err('tanggal_kembali')}>
                                <input type="date" className={inputClass} value={form.tanggal_kembali} onChange={set('tanggal_kembali')} />
                            </Field>
                        </div>

                        <Field label="Status" error={err('status')}>
                            <select className={inputClass} value={form.status} onChange={set('status')}>
                                <option value="Dipinjam">Dipinjam</option>
                                <option value="Dikembalikan">Dikembalikan</option>
                            </select>
                        </Field>

                        <Field label="Bukti Peminjaman (jpg/png/pdf, maks. 2 MB)" error={err('bukti')}>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className={inputClass}
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </Field>
                        {editingId && currentBukti && (
                            <p className="-mt-2 text-sm">
                                Berkas saat ini:{' '}
                                <a href={currentBukti} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                    buka berkas
                                </a>{' '}
                                <span className="text-neutral-500">(pilih berkas baru untuk menggantinya)</span>
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <button type="button" className={btnGhost} onClick={() => setModalOpen(false)}>
                                Batal
                            </button>
                            <button type="submit" className={btnPrimary} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}
