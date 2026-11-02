import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sceneQuality, shouldAnimate } from "@/lib/scene-quality";
import { threeElement } from "@/lib/three-element";

const MINT = new THREE.Color("#5ef2c0");
type Quality = ReturnType<typeof sceneQuality>;
type Motion = { p: number; lastScroll: number };

function Terrain({ quality }: { quality: Quality }) {
  const geo = useMemo(() => new THREE.PlaneGeometry(120, 160, ...quality.terrainSegments), [quality]);
  const base = useMemo(() => Float32Array.from(geo.getAttribute("position").array), [geo]);
  useLayoutEffect(() => {
    const pos = geo.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, Math.sin(pos.getX(i) * 0.12) * 1.4 + Math.cos(pos.getY(i) * 0.09) * 1.8);
    }
    pos.needsUpdate = true;
    geo.computeBoundingSphere();
    return () => geo.dispose();
  }, [geo]);
  useFrame(({ clock }) => {
    if (quality.mobile || quality.reducedMotion) return;
    const t = clock.elapsedTime * 0.3;
    const pos = geo.getAttribute("position").array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i] ?? 0, y = base[i + 1] ?? 0;
      pos[i + 2] =
        Math.sin(x * 0.12 + t) * 1.4 +
        Math.cos(y * 0.09 - t * 0.8) * 1.8 +
        Math.sin((x + y) * 0.05 + t * 0.5) * 2.2 * (Math.abs(x) / 30);
    }
    geo.getAttribute("position").needsUpdate = true;
  });
  return threeElement("mesh", { geometry: geo, rotation: [-Math.PI / 2, 0, 0], position: [0, -4, -50] },
    threeElement("meshBasicMaterial", { color: MINT, wireframe: true, transparent: true, opacity: quality.mobile ? 0.16 : 0.35 })
  );
}

const REVENUE = [42, 48, 45, 53, 57, 55, 62, 66, 64, 71, 74, 81];

function Bars({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current && !quality.reducedMotion) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.4 + 0.3;
  });
  return threeElement("group", { ref: group, position: [6, -2, -70] },
      REVENUE.map((v, i) => {
        const h = v / 8;
        return threeElement("mesh", { key: i, position: [(i - 5.5) * 1.3, h / 2, 0] },
          threeElement("boxGeometry", { args: [0.9, h, 0.9] }),
          quality.mobile
            ? threeElement("meshBasicMaterial", { color: MINT, transparent: true, opacity: 0.14, depthWrite: false })
            : threeElement("meshStandardMaterial", { color: MINT, emissive: MINT, emissiveIntensity: 0.25 + i * 0.03, metalness: 0.3, roughness: 0.4 })
        );
      })
  );
}

function Clusters({ quality }: { quality: Quality }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const centers = [[-4, 2, 0], [3, 4, -2], [0, -2, 2]];
    const colors = [MINT, new THREE.Color("#f2c94c"), new THREE.Color("#7fb2ff")];
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < quality.clusterCount; i++) {
      const center = centers[i % 3];
      const color = colors[i % 3];
      if (!center || !color) continue;
      const jitter = (seed: number) => ((Math.sin(seed * 127.1) * 43758.5453) % 1) * 1.5;
      matrix.makeTranslation((center[0] ?? 0) + jitter(i + 1), (center[1] ?? 0) + jitter(i + 21), (center[2] ?? 0) + jitter(i + 41));
      mesh.current.setMatrixAt(i, matrix);
      mesh.current.setColorAt(i, color);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [quality.clusterCount]);
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current && !quality.reducedMotion) g.current.rotation.y += Math.min(d, 0.05) * 0.15;
  });
  return threeElement("group", { ref: g, position: [-6, 2, -30] },
    threeElement("instancedMesh", { ref: mesh, args: [undefined, undefined, quality.clusterCount] },
      threeElement("sphereGeometry", { args: [0.12, quality.mobile ? 6 : 8, quality.mobile ? 4 : 8] }),
      threeElement("meshBasicMaterial", { transparent: true, opacity: quality.mobile ? 0.45 : 1 })
    )
  );
}

function Rig({ quality, motion }: { quality: Quality; motion: Motion }) {
  useFrame(({ camera, pointer }, d) => {
    const z = 10 - motion.p * 75;
    const k = quality.reducedMotion ? 1 : 1 - Math.exp(-8 * Math.min(d, 0.05));
    const parallax = !quality.mobile && !quality.reducedMotion;
    camera.position.x += ((parallax ? pointer.x * 2 : 0) - camera.position.x) * k;
    camera.position.y += (3 + (parallax ? pointer.y : 0) - camera.position.y) * k;
    camera.position.z += (z - camera.position.z) * k;
    camera.lookAt(camera.position.x * 0.3, 0, camera.position.z - 20);
  });
  return null;
}

function RenderLoop({ quality, motion, wrapper }: { quality: Quality; motion: Motion; wrapper: React.RefObject<HTMLDivElement | null> }) {
  const { invalidate, gl } = useThree();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frames = useRef(0);
  const schedule = () => {
    if (timer.current !== undefined || document.hidden) return;
    timer.current = setTimeout(() => {
      timer.current = undefined;
      invalidate();
    }, quality.frameInterval);
  };
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      motion.p = max > 0 ? scrollY / max : 0;
      motion.lastScroll = performance.now();
      schedule();
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
      clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [quality, invalidate, motion]);
  useFrame(() => {
    frames.current++;
    // Defer readiness and metrics until this frame has actually drawn.
    if (frames.current === 1 || import.meta.env.DEV) {
      queueMicrotask(() => {
        const el = wrapper.current;
        if (!el) return;
        el.setAttribute("data-scene-ready", "");
        if (import.meta.env.DEV) {
          el.dataset['drawCalls'] = String(gl.info.render.calls);
          el.dataset['triangles'] = String(gl.info.render.triangles);
          el.dataset['frames'] = String(frames.current);
          el.dataset['pixelRatio'] = String(gl.getPixelRatio());
        }
      });
    }
    if (shouldAnimate(quality.mobile, quality.reducedMotion, document.hidden, performance.now() - motion.lastScroll)) schedule();
  });
  return null;
}

export default function Scene3D() {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({ p: 0, lastScroll: 0 });
  const [quality, setQuality] = useState<Quality | null>(null);
  useEffect(() => {
    const small = matchMedia("(max-width: 767px)");
    const coarse = matchMedia("(pointer: coarse)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setQuality(sceneQuality(small.matches || coarse.matches, reduced.matches));
    update();
    const queries = [small, coarse, reduced];
    queries.forEach(q => q.addEventListener("change", update));
    return () => queries.forEach(q => q.removeEventListener("change", update));
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" data-quality={quality?.mobile ? "mobile" : "desktop"}>
      {quality && (
      <Canvas
        key={`${quality.mobile}-${quality.reducedMotion}`}
        camera={{ position: [0, 3, 10], fov: 60 }}
        dpr={quality.pixelRatio}
        frameloop="demand"
        gl={{ antialias: !quality.mobile, alpha: false, powerPreference: quality.mobile ? "low-power" : "high-performance" }}
      >
        {threeElement("color", { attach: "background", args: ["#060b0a"] })}
        {threeElement("fog", { attach: "fog", args: ["#060b0a", 15, 60] })}
        {threeElement("ambientLight", { intensity: 0.5 })}
        {threeElement("pointLight", { position: [0, 10, -40], intensity: 200, color: "#5ef2c0" })}
        {threeElement("directionalLight", { position: [5, 10, 5], intensity: 1 })}
        <Terrain quality={quality} />
        <Clusters quality={quality} />
        <Bars quality={quality} />
        <Rig quality={quality} motion={motion.current} />
        <RenderLoop quality={quality} motion={motion.current} wrapper={ref} />
      </Canvas>
      )}
    </div>
  );
}
