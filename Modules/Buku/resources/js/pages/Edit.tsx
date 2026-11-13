import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BukuForm, { type BukuData } from '../components/BukuForm';

export default function Edit({ buku }: { buku: BukuData }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Buku', href: '/buku' },
                { title: 'Ubah', href: `/buku/${buku.id}/edit` },
            ]}
        >
            <Head title="Ubah Buku" />
            <BukuForm buku={buku} />
        </AppLayout>
    );
}
