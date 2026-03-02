import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CreditCard, DollarSign } from 'lucide-react';

export default function NotificationBanner() {
    const { bannerQueue, setBannerQueue } = useApp();
    const [activeBanner, setActiveBanner] = useState(null);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        if (!activeBanner && bannerQueue.length > 0) {
            const nextBanner = bannerQueue[0];
            setActiveBanner(nextBanner);
            setBannerQueue(prev => prev.slice(1));
            setIsAnimatingOut(false);

            // Tempo para a notificação ficar na tela (3 segundos)
            const showTimer = setTimeout(() => {
                setIsAnimatingOut(true);
                // Tempo da animação de saída (0.3s)
                setTimeout(() => {
                    setActiveBanner(null);
                }, 300);
            }, 3000);

            return () => clearTimeout(showTimer);
        }
    }, [activeBanner, bannerQueue, setBannerQueue]);

    if (!activeBanner) return null;

    return (
        <div className={`ios-banner ${isAnimatingOut ? 'slide-up-out' : 'slide-down-in'}`}>
            <div className="ios-banner-icon">
                {activeBanner.type === 'Pagar' ? (
                    <DollarSign size={18} color="#fff" />
                ) : (
                    <CreditCard size={18} color="#fff" />
                )}
            </div>
            <div className="ios-banner-content">
                <strong>{activeBanner.title}</strong>
                <span>{activeBanner.description}</span>
            </div>
        </div>
    );
}
