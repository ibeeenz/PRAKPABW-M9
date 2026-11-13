import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage, Pagination, btnDanger, btnGhost, btnPrimary, type PageLink } from '@/components/sipustaka-ui';
import type { UserData } from '../components/UserForm';

type Props = {
    users: { data: UserData[]; links: PageLink[]; from: number | null };
    currentUserId: number;
};

export default function Index({ users, currentUserId }: Props) {
    function hapus(user: UserData) {
        if (confirm(`Hapus user "${user.name}"?`)) {
            router.delete(`/users/${user.id}`, { preserveScroll: true });
        }
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola User', href: '/users' }]}>
            <Head title="Kelola User" />

            <div className="p-4">
                <FlashMessage />

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">Kelola User</h1>
                    <Link href="/users/create" className={btnPrimary}>
                        + Tambah User
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100 dark:bg-neutral-900">
                            <tr>
                                <th className="px-3 py-2">No</th>
                                <th className="px-3 py-2">Nama</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Role</th>
                                <th className="px-3 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u, i) => (
                                <tr key={u.id} className="border-t border-neutral-200 dark:border-neutral-800">
                                    <td className="px-3 py-2">{(users.from ?? 1) + i}</td>
                                    <td className="px-3 py-2">
                                        {u.name}
                                        {u.id === currentUserId && <span className="ml-2 text-xs text-neutral-500">(Anda)</span>}
                                    </td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">
                                        <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-800">{u.role}</span>
                                    </td>
                                    <td className="flex gap-2 px-3 py-2">
                                        <Link href={`/users/${u.id}/edit`} className={btnGhost}>
                                            Ubah
                                        </Link>
                                        {u.id !== currentUserId && (
                                            <button type="button" onClick={() => hapus(u)} className={btnDanger}>
                                                Hapus
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}
