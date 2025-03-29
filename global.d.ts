import { ThreeElements } from "@react-three/fiber";
import { JSX } from "react";

declare module 'three' {
    interface ShaderMaterial {
        uniforms: {
            [key: string]: { value: any };
        };
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // For Three.js geometries
            icosahedronGeometry: ThreeElements["icosahedronGeometry"];

            // For materials
            shaderMaterial: ThreeElements["shaderMaterial"];

            // For other Three.js elements
            mesh: ThreeElements["mesh"];
            group: ThreeElements["group"];
        }
    }
}
