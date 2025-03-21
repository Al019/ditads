import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from './Components/ui/sonner';
import { SecurityProvider } from './Components/security-modal';

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: () => `${appName} - Journal`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider storageKey="vite-ui-theme">
                <SecurityProvider>
                    <App {...props} />
                </SecurityProvider>
                <Toaster />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#22c55e',
    },
});
