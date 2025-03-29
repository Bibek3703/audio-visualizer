import { Html, useProgress } from "@react-three/drei";
import React from "react";
import { Progress } from "./ui/progress";

export default function CanvasLoader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 w-60">
                <span className="text-black text-sm font-normal">
                    Loading...
                </span>
                <Progress value={progress} className="h-1.5" />
            </div>
        </Html>
    );
}
