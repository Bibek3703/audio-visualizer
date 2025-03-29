import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import CanvasLoader from "./CanvasLoader";
import Scene from "./models/Scene";

function AudioVisualizer() {
    return (
        <Canvas className="w-full h-auto aspect-square bg-transparent">
            <Suspense fallback={<CanvasLoader />}>
                <Scene />
            </Suspense>
        </Canvas>
    );
}

export default AudioVisualizer;
