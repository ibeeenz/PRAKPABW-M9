import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import UserForm from '../components/UserForm';

export default function Create() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Kelola User', href: '/users' },
                { title: 'Tambah', href: '/users/create' },
            ]}
        >
            <Head title="Tambah User" />
            <UserForm />
        </AppLayout>
    );
}
