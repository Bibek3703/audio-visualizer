"use client";

import { audios as songs } from "@/constants/audio";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import * as THREE from "three";

type Audio = {
    title: string;
    fileName: string;
    image: string;
};

interface AudioAnalyserContextProps {
    currentSong: Audio;
    currentTime: number;
    duration: number;
    handleClickPrevSong: () => void;
    handleClickNextSong: () => void;
    songIndex: number;
    totalSongs: number;
    playing: boolean;
    playAudio: () => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    audioAnalyser: THREE.AudioAnalyser | null;
}

const AudioAnalyserContext = createContext<
    AudioAnalyserContextProps | undefined
>(
    undefined,
);

export const AudioAnalyserProvider = (
    { children }: { children: React.ReactNode },
) => {
    const [songIndex, setSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const fftSize = 128;
    const [audioStarted, setAudioStarted] = useState(false);

    const audioRef = useRef<THREE.Audio<AudioNode>>(null!);
    const audioElementRef = useRef<HTMLAudioElement>(null);
    const listenerRef = useRef<THREE.AudioListener>(null);
    const analyserRef = useRef<THREE.AudioAnalyser>(null);

    // Setup audio and analyzer
    const initAudio = useCallback(() => {
        if (listenerRef.current || !currentSong) return;

        // Clean up previous audio if it exists
        if (audioRef.current) {
            if (audioRef.current.isPlaying) {
                audioRef.current.stop();
            }
        }

        const listener = new THREE.AudioListener();
        listenerRef.current = listener;
        const audio = new THREE.Audio(listener);
        audioRef.current = audio;
        const file = `/audios/${currentSong.fileName}`;

        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            const loader = new THREE.AudioLoader();
            loader.load(file, (buffer) => {
                audio.setBuffer(buffer);
                setDuration(buffer.duration);
                setupAnalyser(audio);
                setAudioStarted(true);
                playAudio();
            });
        } else {
            const mediaElement = new Audio(file);
            audioElementRef.current = mediaElement;

            // Set up event listeners for time tracking
            mediaElement.addEventListener("loadedmetadata", () => {
                setDuration(mediaElement.duration);
            });

            mediaElement.addEventListener("timeupdate", () => {
                setCurrentTime(mediaElement.currentTime);
            });

            mediaElement.addEventListener("ended", () => {
                setCurrentTime(0);
                setPlaying(false);
            });

            audio.setMediaElementSource(mediaElement);
            setupAnalyser(audio);
            setAudioStarted(true);
            playAudio();
        }
    }, [listenerRef, currentSong]);

    const setupAnalyser = useCallback((audio: THREE.Audio<AudioNode>) => {
        if (analyserRef.current) return;
        const analyser = new THREE.AudioAnalyser(audio, fftSize);
        analyserRef.current = analyser;

        setAudioStarted(true);
    }, []);

    // Play audio function
    const playAudio = useCallback(() => {
        if (!audioElementRef.current || !audioRef.current) {
            initAudio();
            return;
        }

        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            if (audioRef.current && !audioRef.current.isPlaying) {
                audioRef.current.play();
            }
        } else if (audioElementRef.current) {
            audioElementRef.current.play();
        }

        setPlaying(true);
    }, [audioStarted, initAudio]);

    // Pause audio function
    const pauseAudio = useCallback(() => {
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            if (audioRef.current && audioRef.current.isPlaying) {
                audioRef.current.pause();
            }
        } else if (audioElementRef.current && audioElementRef.current.played) {
            audioElementRef.current.pause();
        }

        setPlaying(false);
    }, []);

    // Stop audio function
    const stopAudio = useCallback(() => {
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            if (audioRef.current && audioRef.current.isPlaying) {
                audioRef.current.stop();
                // Reset time for iOS
                setCurrentTime(0);
            }
        } else if (audioElementRef.current && audioElementRef.current.played) {
            audioElementRef.current.pause();
            audioElementRef.current.currentTime = 0;
        }
        listenerRef.current = null;
        analyserRef.current = null;
        audioElementRef.current = null;
        setPlaying(false);
        setCurrentTime(0);
    }, []);

    // Change song effect
    useEffect(() => {
        if (
            audioStarted && audioElementRef.current &&
            audioElementRef?.current?.currentTime > 0
        ) {
            stopAudio();
            initAudio();
        }
    }, [currentSong, audioStarted, stopAudio, initAudio, audioElementRef]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                audioElementRef.current.src = "";
            }
            if (audioRef.current) {
                if (audioRef.current.isPlaying) {
                    audioRef.current.stop();
                }
            }
        };
    }, []);

    const handleClickPrevSong = useCallback(() => {
        if (songIndex > 0) {
            setSongIndex((prev) => prev - 1);
            setCurrentSong(songs[songIndex - 1]);
        }
    }, [songIndex, songs]);

    const handleClickNextSong = useCallback(() => {
        if (songIndex < songs.length - 1) {
            setSongIndex((prev) => prev + 1);
            setCurrentSong(songs[songIndex + 1]);
        }
    }, [songIndex, songs]);

    return (
        <AudioAnalyserContext.Provider
            value={{
                currentSong,
                currentTime,
                duration,
                handleClickPrevSong,
                handleClickNextSong,
                songIndex,
                totalSongs: songs.length,
                playing,
                playAudio,
                pauseAudio,
                stopAudio,
                audioAnalyser: analyserRef.current,
            }}
        >
            {children}
        </AudioAnalyserContext.Provider>
    );
};

export const useAudioAnalyzer = () => {
    const context = useContext(AudioAnalyserContext);
    if (!context) {
        throw new Error(
            "useAudioAnalyzer must be used within a AudioAnalyserProvider",
        );
    }
    return context;
};
