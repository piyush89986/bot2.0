import { useEffect, useRef } from "react";

/**
 * Custom Hook for Sound Effects in Chat Application
 * Usage: const { playMessageSend, playMessageReceive, playNotification } = useSoundEffects();
 */

export const useSoundEffects = () => {
    const audioRefs = useRef({
        messageSend: null,
        messageReceive: null,
        notification: null,
    });

    useEffect(() => {
        // Initialize audio elements with sound URLs
        // You can use free sound resources or create your own sounds
        
        audioRefs.current.messageSend = new Audio(
            // Option 1: Use data URI (simple beep - already included below)
            "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        );
        
        audioRefs.current.messageReceive = new Audio(
            // Option 1: Use data URI (different beep)
            "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        );
        
        audioRefs.current.notification = new Audio(
            // Option 1: Use data URI
            "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        );

        // Set volume levels (0 to 1)
        audioRefs.current.messageSend.volume = 0.5;
        audioRefs.current.messageReceive.volume = 0.5;
        audioRefs.current.notification.volume = 0.6;

        return () => {
            // Cleanup
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    const playSound = (soundType) => {
        try {
            const audio = audioRefs.current[soundType];
            if (audio) {
                // Reset and play
                audio.currentTime = 0;
                audio.play().catch(err => console.log("Audio play failed:", err));
            }
        } catch (error) {
            console.error(`Error playing ${soundType}:`, error);
        }
    };

    return {
        playMessageSend: () => playSound("messageSend"),
        playMessageReceive: () => playSound("messageReceive"),
        playNotification: () => playSound("notification"),
    };
};

/**
 * Alternative: Generate beep sounds programmatically using Web Audio API
 * This doesn't require external sound files
 */
export const useSoundEffectsWebAudio = () => {
    const audioContextRef = useRef(null);

    // Initialize Web Audio API
    useEffect(() => {
        const initAudioContext = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
        };

        // Initialize on first user interaction
        window.addEventListener("click", initAudioContext, { once: true });
        window.addEventListener("touchstart", initAudioContext, { once: true });

        return () => {
            window.removeEventListener("click", initAudioContext);
            window.removeEventListener("touchstart", initAudioContext);
        };
    }, []);

    const playBeep = (frequency = 800, duration = 100, type = "sine") => {
        try {
            const audioContext = audioContextRef.current;
            if (!audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            // Smooth fade out
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.error("Error playing beep:", error);
        }
    };

    return {
        playMessageSend: () => playBeep(800, 100, "sine"), // 800Hz beep
        playMessageReceive: () => playBeep(1000, 150, "sine"), // 1000Hz longer beep
        playNotification: () => {
            // Two-tone notification
            playBeep(800, 100, "sine");
            setTimeout(() => playBeep(1000, 100, "sine"), 150);
        },
    };
};

/**
 * Extended hook with settings support
 * Allows enabling/disabling sounds from settings
 */
export const useSoundEffectsWithSettings = (soundsEnabled = true) => {
    const audioContextRef = useRef(null);

    useEffect(() => {
        const initAudioContext = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
        };

        window.addEventListener("click", initAudioContext, { once: true });
        window.addEventListener("touchstart", initAudioContext, { once: true });

        return () => {
            window.removeEventListener("click", initAudioContext);
            window.removeEventListener("touchstart", initAudioContext);
        };
    }, []);

    const playBeep = (frequency = 800, duration = 100, type = "sine") => {
        if (!soundsEnabled) return;

        try {
            const audioContext = audioContextRef.current;
            if (!audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.error("Error playing beep:", error);
        }
    };

    return {
        playMessageSend: () => playBeep(800, 100, "sine"),
        playMessageReceive: () => playBeep(1000, 150, "sine"),
        playNotification: () => {
            playBeep(800, 100, "sine");
            setTimeout(() => playBeep(1000, 100, "sine"), 150);
        },
    };
};
