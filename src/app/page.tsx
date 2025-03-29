import AudioPlayer from "@/components/AudioPlayer";
import { AudioAnalyserProvider } from "@/constexts/audio-context";

export default function Home() {
  return (
    <AudioAnalyserProvider>
      <div className="flex flex-col justify-center items-center gap-6 w-full h-screen p-6">
        <div className="flex flex-col w-full max-w-xl text-center">
          <span className="pointer-events-none h-full whitespace-nowrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-4xl sm:text-5xl font-bold tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            EchoBeats{" "}
          </span>
          <span className="pointer-events-none h-full whitespace-nowrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-2xl sm:text-3xl font-bold tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            The sound never fades 🎼
          </span>
        </div>
        <AudioPlayer />
      </div>
    </AudioAnalyserProvider>
  );
}
