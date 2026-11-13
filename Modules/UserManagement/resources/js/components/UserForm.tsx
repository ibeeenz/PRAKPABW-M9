import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Field, btnGhost, btnPrimary, inputClass } from '@/components/sipustaka-ui';

export type UserData = { id: number; name: string; email: string; role: 'admin' | 'user' };

export default function UserForm({ user, currentUserId }: { user?: UserData; currentUserId?: number }) {
    const form = useForm<Record<string, string>>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
        password: '',
    });

    // admin tidak boleh menurunkan role akunnya sendiri
    const isSelf = !!user && user.id === currentUserId;

    function submit(e: FormEvent) {
        e.preventDefault();

        if (user) {
            form.put(`/users/${user.id}`);
        } else {
            form.post('/users');
        }
    }

    return (
        <form onSubmit={submit} className="max-w-xl space-y-4 p-4">
            <h1 className="text-xl font-semibold">{user ? 'Ubah User' : 'Tambah User'}</h1>

            <Field label="Nama" error={form.errors.name}>
                <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
            </Field>

            <Field label="Email" error={form.errors.email}>
                <input
                    type="email"
                    className={inputClass}
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                />
            </Field>

            <Field label="Role" error={form.errors.role}>
                <select
                    className={inputClass}
                    value={form.data.role}
                    disabled={isSelf}
                    onChange={(e) => form.setData('role', e.target.value)}
                >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
            </Field>
            {isSelf && <p className="-mt-2 text-xs text-neutral-500">Role akun Anda sendiri tidak dapat diubah.</p>}

            <Field label={user ? 'Password (kosongkan jika tidak diubah)' : 'Password'} error={form.errors.password}>
                <input
                    type="password"
                    className={inputClass}
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                />
            </Field>

            <div className="flex gap-2">
                <button type="submit" className={btnPrimary} disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                </button>
                <Link href="/users" className={btnGhost}>
                    Batal
                </Link>
            </div>
        </form>
    );
}
