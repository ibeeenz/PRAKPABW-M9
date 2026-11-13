import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type PageModule = { default: ComponentType };

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    // resolve halaman: modul HMVC (Modules/<Nama>/resources/js/pages) lebih dulu, lalu resources/js/pages
    resolve: async (name) => {
        const modulePages = import.meta.glob<PageModule>('/Modules/*/resources/js/pages/**/*.tsx');
        const corePages = import.meta.glob<PageModule>('./pages/**/*.tsx');
        const [module, ...rest] = name.split('/');
        const modulePath = `/Modules/${module}/resources/js/pages/${rest.join('/')}.tsx`;

        if (rest.length > 0 && modulePages[modulePath]) {
            return (await modulePages[modulePath]()).default;
        }

        const core = corePages[`./pages/${name}.tsx`];

        if (!core) {
            throw new Error(`Halaman tidak ditemukan: ${name}`);
        }

        return (await core()).default;
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();