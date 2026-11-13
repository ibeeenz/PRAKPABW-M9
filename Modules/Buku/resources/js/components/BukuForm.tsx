import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Field, btnGhost, btnPrimary, inputClass } from '@/components/sipustaka-ui';

export type BukuData = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};

const fields = [
    ['judul', 'Judul', 'text'],
    ['penulis', 'Penulis', 'text'],
    ['penerbit', 'Penerbit', 'text'],
    ['tahun_terbit', 'Tahun Terbit', 'number'],
    ['stok', 'Stok', 'number'],
] as const;

export default function BukuForm({ buku }: { buku?: BukuData }) {
    const form = useForm<Record<string, string>>({
        judul: buku?.judul ?? '',
        penulis: buku?.penulis ?? '',
        penerbit: buku?.penerbit ?? '',
        tahun_terbit: buku ? String(buku.tahun_terbit) : '',
        stok: buku ? String(buku.stok) : '0',
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (buku) {
            form.put(`/buku/${buku.id}`);
        } else {
            form.post('/buku');
        }
    }

    return (
        <form onSubmit={submit} className="max-w-xl space-y-4 p-4">
            <h1 className="text-xl font-semibold">{buku ? 'Ubah Buku' : 'Tambah Buku'}</h1>

            {fields.map(([name, label, type]) => (
                <Field key={name} label={label} error={form.errors[name]}>
                    <input
                        type={type}
                        className={inputClass}
                        value={form.data[name]}
                        onChange={(e) => form.setData(name, e.target.value)}
                    />
                </Field>
            ))}

            <div className="flex gap-2">
                <button type="submit" className={btnPrimary} disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                </button>
                <Link href="/buku" className={btnGhost}>
                    Batal
                </Link>
            </div>
        </form>
    );
}
