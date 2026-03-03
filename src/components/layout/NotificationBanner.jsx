import { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, DollarSign } from 'lucide-react';

export default function NotificationBanner() {
    const { bannerQueue, setBannerQueue } = useApp();
    const [activeBanner, setActiveBanner] = useState(null);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // Swipe handling refs
    const startY = useRef(0);
    const currentY = useRef(0);
    const bannerRef = useRef(null);

    // Consome a fila se não houver banner ativo
    useEffect(() => {
        if (!activeBanner && bannerQueue.length > 0) {
            const nextBanner = bannerQueue[0];
            setActiveBanner(nextBanner);
            setBannerQueue(prev => prev.slice(1));
            setIsAnimatingOut(false);
        }
    }, [activeBanner, bannerQueue, setBannerQueue]);

    // Lida com o ciclo de vida do banner ativo
    useEffect(() => {
        let outTimer;
        let clearTimer;

        if (activeBanner && !isAnimatingOut) {
            outTimer = setTimeout(() => {
                setIsAnimatingOut(true);
            }, 3000);
        }

        if (activeBanner && isAnimatingOut) {
            clearTimer = setTimeout(() => {
                setActiveBanner(null);
                setIsAnimatingOut(false);
                if (bannerRef.current) {
                    bannerRef.current.style.transform = '';
                }
            }, 300);
        }

        return () => {
            clearTimeout(outTimer);
            clearTimeout(clearTimer);
        };
    }, [activeBanner, isAnimatingOut]);

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
        if (bannerRef.current) {
            bannerRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e) => {
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;
        // Permite apenas arrastar para cima
        if (diff < 0 && bannerRef.current) {
            bannerRef.current.style.transform = `translate(-50%, ${diff}px)`;
        }
    };

    const handleTouchEnd = () => {
        const diff = currentY.current - startY.current;
        if (bannerRef.current) {
            bannerRef.current.style.transition = 'transform 0.3s ease-out';
        }
        if (diff < -30) {
            // Arrastou o suficiente para cima, dispensa o banner
            setIsAnimatingOut(true);
        } else {
            // Volta para a posição original
            if (bannerRef.current && !isAnimatingOut) {
                bannerRef.current.style.transform = '';
            }
        }
    };

    if (!activeBanner) return null;

    return (
        <div
            ref={bannerRef}
            className={`ios-banner ${isAnimatingOut ? 'slide-up-out' : 'slide-down-in'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
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
