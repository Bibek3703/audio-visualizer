"use client";

import React from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import Image from "next/image";
import {
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    RewindIcon,
    Square,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { formatTime } from "@/utils/audio";
import { Button } from "./ui/button";
import AudioVisualizer from "./AudioVisualizer";
import { useAudioAnalyzer } from "@/constexts/audio-context";

function AudioPlayer() {
    const {
        currentSong,
        currentTime,
        duration,
        handleClickNextSong,
        handleClickPrevSong,
        songIndex,
        totalSongs,
        playing,
        playAudio,
        pauseAudio,
        stopAudio,
    } = useAudioAnalyzer();

    return (
        <div className="relative w-full md:max-w-xl h-auto">
            <BackgroundGradient
                containerClassName="w-full h-full mt-3"
                className="flex flex-col items-center rounded-[22px] bg-zinc-900 w-full h-full p-10 pt-12"
            >
                <div className="flex flex-col items-center justify-center gap-4 h-auto">
                    <div className="relative">
                        {currentSong
                            ? (
                                <Image
                                    src={currentSong.image}
                                    alt="Album Cover"
                                    width={400}
                                    height={400}
                                    className="rounded-full w-20 h-20 object-cover"
                                />
                            )
                            : (
                                <Image
                                    src="/images/echobeat.jpg"
                                    alt="Album Cover"
                                    width={400}
                                    height={400}
                                    className="rounded-full w-20 h-20 object-cover"
                                />
                            )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold line-clamp-1">
                            {currentSong.title ||
                                "Audio Title"}
                        </h2>
                    </div>
                </div>
                <div className="relative w-full max-w-xs px-4">
                    <AudioVisualizer />
                </div>

                <div className="w-full max-w-sm">
                    <Progress
                        value={currentTime}
                        className="bg-black"
                        indicatorClassName="bg-rose-500"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClickPrevSong}
                        disabled={songIndex === 0}
                    >
                        <RewindIcon className="w-6 h-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => playing ? pauseAudio() : playAudio()}
                            disabled={totalSongs === 0}
                        >
                            {playing
                                ? <PauseIcon className="w-6 h-6" />
                                : <PlayIcon className="w-6 h-6" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => stopAudio()}
                            disabled={!playing}
                        >
                            <Square className="w-6 h-6" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClickNextSong}
                        disabled={songIndex === totalSongs - 1}
                    >
                        <ForwardIcon className="w-6 h-6" />
                    </Button>
                </div>
            </BackgroundGradient>
        </div>
    );
}

export default AudioPlayer;
