import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BukuForm from '../components/BukuForm';

export default function Create() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Buku', href: '/buku' },
                { title: 'Tambah', href: '/buku/create' },
            ]}
        >
            <Head title="Tambah Buku" />
            <BukuForm />
        </AppLayout>
    );
}
