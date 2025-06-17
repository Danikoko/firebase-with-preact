import { useEffect } from 'preact/hooks';
import preactLogo from './assets/preact.svg';
import './app.css';
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

export function App() {
    useEffect(() => {
        const token: string = import.meta.env.VITE_BEARER_TOKEN;
        (window as any).Pusher = Pusher;

        (window as any).Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS:
                (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        });

        (window as any).Echo.connector.pusher.connection.bind(
            'connected',
            () => {
                console.log(
                    '%c✅ Connected to Reverb WebSocket!',
                    'color: green'
                );
            }
        );

        (window as any).Echo.connector.pusher.connection.bind(
            'error',
            (err: any) => {
                console.error('❌ Echo connection error:', err);
            }
        );

        (window as any).Echo.connector.pusher.connection.bind(
            'state_change',
            (states: any) => {
                console.log(`ℹ️ Echo connection state changed:`, states);
            }
        );

        (window as any).Echo.connector.pusher.logToConsole = true;

        const maintenanceId: number = 16;
        (window as any).Echo.private(
            `maintenances.${maintenanceId}.maintenance-notes`
        ).listen('MaintenanceNoteReceived', (e: any) => {
            console.log(e);
        });
    }, []);

    return (
        <>
            <div>
                <a href='https://vitejs.dev' target='_blank'>
                    <img src='/vite.svg' class='logo' alt='Vite logo' />
                </a>
                <a href='https://preactjs.com' target='_blank'>
                    <img
                        src={preactLogo}
                        class='logo preact'
                        alt='Preact logo'
                    />
                </a>
            </div>
        </>
    );
}
