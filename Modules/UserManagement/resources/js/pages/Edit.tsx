import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import UserForm, { type UserData } from '../components/UserForm';

export default function Edit({ user, currentUserId }: { user: UserData; currentUserId: number }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Kelola User', href: '/users' },
                { title: 'Ubah', href: `/users/${user.id}/edit` },
            ]}
        >
            <Head title="Ubah User" />
            <UserForm user={user} currentUserId={currentUserId} />
        </AppLayout>
    );
}
