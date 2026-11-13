import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export const inputClass =
    'mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:disabled:bg-neutral-800';

export const btnPrimary =
    'inline-flex items-center rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200';

export const btnGhost =
    'inline-flex items-center rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800';

export const btnDanger =
    'inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50';

export type PageLink = { url: string | null; label: string; active: boolean };

/** Pesan berhasil / gagal dari session flash (dibagikan lewat shared props). */
export function FlashMessage() {
    const { flash } = usePage<{ flash?: { success?: string | null; error?: string | null } }>().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div
            className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                flash.error
                    ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
                    : 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
            }`}
        >
            {flash.error ?? flash.success}
        </div>
    );
}

/** Label + input + pesan error di bawah input. */
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium">
                {label}
                {children}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function Pagination({ links }: { links: PageLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    const last = links.length - 1;
    const text = (label: string, i: number) =>
        i === 0 ? '‹ Sebelumnya' : i === last ? 'Berikutnya ›' : label;

    return (
        <nav className="mt-4 flex flex-wrap gap-1">
            {links.map((link, i) => {
                const cls = `rounded-md border px-3 py-1.5 text-sm ${
                    link.active
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-300 dark:border-neutral-700'
                }`;

                return link.url ? (
                    <Link key={i} href={link.url} preserveScroll className={`${cls} hover:bg-neutral-100 dark:hover:bg-neutral-800`}>
                        {text(link.label, i)}
                    </Link>
                ) : (
                    <span key={i} className={`${cls} opacity-50`}>
                        {text(link.label, i)}
                    </span>
                );
            })}
        </nav>
    );
}
