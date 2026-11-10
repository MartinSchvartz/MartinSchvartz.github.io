"use client";

import { RoundedBox, useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Phase, TopicId } from "./topics";

type Vec3 = [number, number, number];

type SceneProps = {
  phase: Phase;
  reduced: boolean;
  selected: TopicId | null;
  hovered: TopicId | null;
  onHover: (id: TopicId | null) => void;
  onSelect: (id: TopicId) => void;
  onWindow: () => void;
};

const DeskContext = createContext<SceneProps | null>(null);

function useDesk() {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error("useDesk must be used inside the scene");
  return ctx;
}

const { damp } = THREE.MathUtils;

const COLORS = {
  wall: "#ebe5da",
  wallSide: "#e2dbcf",
  floor: "#c29c76",
  trim: "#f4f1ea",
  desk: "#86593b",
  deskDark: "#6c4630",
  metal: "#2b2c30",
  rug: "#d4c7b2",
  robot: "#efeae0",
  face: "#23262d",
  accent: "#2b4fa8",
  accentLight: "#8ea8e8",
  gourd: "#5b3d27",
  yerba: "#6f7d3c",
  pot: "#b3502d",
  leaf: "#5c7a46",
};

const LIGHTING: Record<
  Phase,
  { ambient: [string, number]; sun: [string, number]; hemi: [string, string, number] }
> = {
  day: { ambient: ["#fff8ee", 0.9], sun: ["#fff1dc", 2.2], hemi: ["#dfe9f0", "#b88a62", 0.6] },
  evening: { ambient: ["#fff1e4", 0.7], sun: ["#ffcfa3", 1.5], hemi: ["#f0d6bf", "#6c4630", 0.4] },
  night: { ambient: ["#8e9cc2", 0.22], sun: ["#9fb3e6", 0.3], hemi: ["#26314a", "#1a1410", 0.25] },
};

/** Where the camera sits and looks for each object, plus the default overview. */
const VIEWS: Record<TopicId | "home", { cam: Vec3; look: Vec3 }> = {
  home: { cam: [8.0, 6.2, 7.9], look: [0, 0.65, -1.0] },
  frontend: { cam: [1.5, 1.99, 2.09], look: [0.1, 1.2, -2.55] },
  agents: { cam: [3.55, 1.96, 1.05], look: [1.1, 1.0, -2.1] },
  backend: { cam: [4.3, 2.59, 2.81], look: [2.2, 0.75, -2.35] },
  reliability: { cam: [3.19, 2.11, 1.27], look: [-2.85, 1.85, -1.0] },
  about: { cam: [2.8, 2.1, 2.6], look: [0.2, 0.8, -1.55] },
};

// ---------------------------------------------------------------------------
// Helpers

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useCanvasTexture(width: number, height: number) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, ctx: canvas.getContext("2d")!, texture };
  }, [width, height]);
}

/** Group that lifts slightly when hovered or selected, and reports pointer events for its topic. */
function Pickable({ id, position, rotation, children }: { id: TopicId; position: Vec3; rotation?: Vec3; children: React.ReactNode }) {
  const { hovered, selected, onHover, onSelect, reduced } = useDesk();
  const ref = useRef<THREE.Group>(null);
  const active = hovered === id || selected === id;

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = position[1] + (active ? 0.06 : 0);
    g.position.y = reduced ? target : damp(g.position.y, target, 12, dt);
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={() => onHover(null)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {children}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera

function Rig() {
  const { selected, reduced } = useDesk();
  const { camera, size, pointer } = useThree();
  const look = useRef(new THREE.Vector3(...VIEWS.home.look));
  const shift = useRef({ x: 0, y: 0 });
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  useFrame((_, dt) => {
    const aspect = size.width / size.height;
    const narrow = aspect < 0.9;
    const view = VIEWS[selected ?? "home"];
    tmpLook.set(...view.look);
    tmpPos.set(...view.cam);

    if (!selected) {
      // Pull back on tall screens so the whole room fits.
      if (aspect < 1.1) tmpPos.sub(tmpLook).multiplyScalar(1.1 / aspect).add(tmpLook);
      if (!reduced) {
        tmpPos.x += pointer.x * 0.6;
        tmpPos.z -= pointer.x * 0.6;
        tmpPos.y += pointer.y * 0.35;
      }
    } else if (narrow) {
      tmpPos.sub(tmpLook).multiplyScalar(1.25).add(tmpLook);
    }

    // Shift the projection so the focused object isn't hidden behind the info panel.
    const sx = selected && !narrow ? Math.min(200, size.width * 0.16) : 0;
    const sy = selected && narrow ? size.height * 0.24 : 0;

    if (reduced || first.current) {
      camera.position.copy(tmpPos);
      look.current.copy(tmpLook);
      shift.current = { x: sx, y: sy };
      first.current = false;
    } else {
      const k = selected ? 3.2 : 2.6;
      camera.position.set(
        damp(camera.position.x, tmpPos.x, k, dt),
        damp(camera.position.y, tmpPos.y, k, dt),
        damp(camera.position.z, tmpPos.z, k, dt),
      );
      look.current.set(
        damp(look.current.x, tmpLook.x, k, dt),
        damp(look.current.y, tmpLook.y, k, dt),
        damp(look.current.z, tmpLook.z, k, dt),
      );
      shift.current.x = damp(shift.current.x, sx, k, dt);
      shift.current.y = damp(shift.current.y, sy, k, dt);
    }

    camera.lookAt(look.current);
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(size.width, size.height, shift.current.x, shift.current.y, size.width, size.height);
    cam.updateProjectionMatrix();
  });

  return null;
}

// ---------------------------------------------------------------------------
// Room

function Room() {
  const { onWindow, phase } = useDesk();
  const [hoverWindow, setHoverWindow] = useState(false);
  useCursor(hoverWindow);
  const view = useCanvasTexture(512, 320);

  useEffect(() => {
    drawWindow(view.ctx, view.canvas.width, view.canvas.height, phase);
    view.texture.needsUpdate = true;
  }, [phase, view]);

  // Window opening in the back wall, centered above the desk.
  const win = { x0: -0.9, x1: 1.5, y0: 1.45, y1: 2.65 };
  const H = 3.2;
  const T = 0.2;
  const z = -3 - T / 2;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.1, -0.9]} receiveShadow>
        <boxGeometry args={[6.2, 0.2, 4.4]} />
        <meshStandardMaterial color={COLORS.floor} roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 0.006, -1.0]} receiveShadow>
        <boxGeometry args={[2.6, 0.012, 1.9]} />
        <meshStandardMaterial color={COLORS.rug} roughness={1} />
      </mesh>

      {/* Back wall, built around the window */}
      <group>
        <mesh position={[(-3.1 + win.x0) / 2, H / 2, z]} receiveShadow>
          <boxGeometry args={[win.x0 + 3.1, H, T]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
        <mesh position={[(win.x1 + 3.1) / 2, H / 2, z]} receiveShadow>
          <boxGeometry args={[3.1 - win.x1, H, T]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
        <mesh position={[(win.x0 + win.x1) / 2, win.y0 / 2, z]} receiveShadow>
          <boxGeometry args={[win.x1 - win.x0, win.y0, T]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
        <mesh position={[(win.x0 + win.x1) / 2, (H + win.y1) / 2, z]} receiveShadow>
          <boxGeometry args={[win.x1 - win.x0, H - win.y1, T]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </group>

      {/* Left wall */}
      <mesh position={[-3 - T / 2, H / 2, -0.9]} receiveShadow>
        <boxGeometry args={[T, H, 4.4]} />
        <meshStandardMaterial color={COLORS.wallSide} />
      </mesh>

      {/* Window: frame, mullion, sill and the city behind it. Clicking it changes the time of day. */}
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoverWindow(true);
        }}
        onPointerOut={() => setHoverWindow(false)}
        onClick={(e) => {
          e.stopPropagation();
          onWindow();
        }}
      >
        <mesh position={[(win.x0 + win.x1) / 2, (win.y0 + win.y1) / 2, z - 0.06]}>
          <planeGeometry args={[win.x1 - win.x0, win.y1 - win.y0]} />
          <meshBasicMaterial map={view.texture} toneMapped={false} />
        </mesh>
        {[
          { p: [(win.x0 + win.x1) / 2, win.y1, z + 0.02] as Vec3, s: [win.x1 - win.x0 + 0.08, 0.06, 0.14] as Vec3 },
          { p: [(win.x0 + win.x1) / 2, win.y0, z + 0.06] as Vec3, s: [win.x1 - win.x0 + 0.2, 0.05, 0.3] as Vec3 },
          { p: [win.x0, (win.y0 + win.y1) / 2, z + 0.02] as Vec3, s: [0.06, win.y1 - win.y0, 0.14] as Vec3 },
          { p: [win.x1, (win.y0 + win.y1) / 2, z + 0.02] as Vec3, s: [0.06, win.y1 - win.y0, 0.14] as Vec3 },
          { p: [(win.x0 + win.x1) / 2, (win.y0 + win.y1) / 2, z - 0.02] as Vec3, s: [0.035, win.y1 - win.y0, 0.05] as Vec3 },
        ].map((f, i) => (
          <mesh key={i} position={f.p} castShadow>
            <boxGeometry args={f.s} />
            <meshStandardMaterial color={COLORS.trim} />
          </mesh>
        ))}
      </group>

      {/* Baseboards */}
      <mesh position={[0, 0.05, -2.99]}>
        <boxGeometry args={[6.2, 0.1, 0.02]} />
        <meshStandardMaterial color={COLORS.trim} />
      </mesh>
      <mesh position={[-2.99, 0.05, -0.9]}>
        <boxGeometry args={[0.02, 0.1, 4.4]} />
        <meshStandardMaterial color={COLORS.trim} />
      </mesh>
    </group>
  );
}

function drawWindow(ctx: CanvasRenderingContext2D, w: number, h: number, phase: Phase) {
  const palette = {
    day: { sky: "#cfdfe8", far: "#aebfcc", near: "#8fa3b3", obelisco: "#ece7dd", lit: 0 },
    evening: { sky: "#e9b892", far: "#b98073", near: "#875a57", obelisco: "#f3d2b4", lit: 0.12 },
    night: { sky: "#1c2333", far: "#2a3346", near: "#151b28", obelisco: "#d8d1c4", lit: 0.38 },
  }[phase];
  const rand = mulberry32(7);

  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, w, h);

  if (phase === "night") {
    ctx.fillStyle = "#e8e3d8";
    ctx.beginPath();
    ctx.arc(w * 0.18, h * 0.2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.sky;
    ctx.beginPath();
    ctx.arc(w * 0.18 + 7, h * 0.2 - 4, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const skyline = (color: string, minH: number, maxH: number, lit: number) => {
    let x = -10;
    while (x < w) {
      const bw = 26 + rand() * 46;
      const bh = minH + rand() * (maxH - minH);
      ctx.fillStyle = color;
      ctx.fillRect(x, h - bh, bw, bh);
      if (lit > 0) {
        for (let wy = h - bh + 8; wy < h - 6; wy += 12) {
          for (let wx = x + 5; wx < x + bw - 6; wx += 9) {
            if (rand() < lit) {
              ctx.fillStyle = "#f2d38a";
              ctx.fillRect(wx, wy, 4, 5);
            }
          }
        }
      }
      x += bw + 2;
    }
  };

  skyline(palette.far, h * 0.35, h * 0.6, palette.lit * 0.6);

  // The Obelisco, between the two layers of buildings.
  const ox = w * 0.66;
  ctx.fillStyle = palette.obelisco;
  ctx.beginPath();
  ctx.moveTo(ox - 9, h);
  ctx.lineTo(ox - 6, h * 0.16);
  ctx.lineTo(ox, h * 0.08);
  ctx.lineTo(ox + 6, h * 0.16);
  ctx.lineTo(ox + 9, h);
  ctx.closePath();
  ctx.fill();

  skyline(palette.near, h * 0.15, h * 0.38, palette.lit);
}

// ---------------------------------------------------------------------------
// Furniture

function Desk() {
  const legs: Vec3[] = [
    [-0.95, 0.37, -2.75],
    [1.55, 0.37, -2.75],
    [-0.95, 0.37, -1.95],
    [1.55, 0.37, -1.95],
  ];
  return (
    <group>
      <mesh position={[0.3, 0.76, -2.35]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.06, 1.0]} />
        <meshStandardMaterial color={COLORS.desk} roughness={0.6} />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      ))}
      {/* Keyboard and mouse */}
      <RoundedBox args={[0.6, 0.025, 0.18]} radius={0.01} position={[0.15, 0.805, -1.98]} castShadow>
        <meshStandardMaterial color="#d9d3c8" />
      </RoundedBox>
      <RoundedBox args={[0.07, 0.03, 0.11]} radius={0.015} position={[0.62, 0.805, -1.97]} castShadow>
        <meshStandardMaterial color="#d9d3c8" />
      </RoundedBox>
    </group>
  );
}

/** Colors for the avatar. Change these to look more like me. */
const AVATAR = {
  skin: "#d9a982",
  hair: "#3a2a20",
  shirt: "#3f5070",
  pants: "#2e3036",
  shoes: "#e6e1d8",
};

const CHAIR_POS: Vec3 = [0.2, 0, -1.55];
const CHAIR_IDLE = -0.35;

/** Arm hanging from the shoulder; rotations are driven from the parent. */
function Arm({ side, armRef, elbowRef }: { side: 1 | -1; armRef: React.RefObject<THREE.Group | null>; elbowRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={armRef} position={[0.2 * side, 1.0, 0.02]}>
      <mesh position={[0, -0.13, 0]} castShadow>
        <capsuleGeometry args={[0.045, 0.18, 4, 12]} />
        <meshStandardMaterial color={AVATAR.shirt} />
      </mesh>
      <group ref={elbowRef} position={[0, -0.26, 0]}>
        <mesh position={[0, -0.11, 0]} castShadow>
          <capsuleGeometry args={[0.038, 0.17, 4, 12]} />
          <meshStandardMaterial color={AVATAR.shirt} />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <sphereGeometry args={[0.04, 14, 10]} />
          <meshStandardMaterial color={AVATAR.skin} />
        </mesh>
      </group>
    </group>
  );
}

/** Desk chair with me sitting in it. Selecting "About" swivels it round to wave at the camera. */
function ChairAndMe() {
  const { reduced, selected } = useDesk();
  const swivel = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const elbowL = useRef<THREE.Group>(null);
  const elbowR = useRef<THREE.Group>(null);

  // Facing angle (the avatar faces -z) that points at the "about" camera.
  const facing = useMemo(() => {
    const [cx, , cz] = VIEWS.about.cam;
    return Math.atan2(-(cx - CHAIR_POS[0]), -(cz - CHAIR_POS[2]));
  }, []);

  useFrame(({ clock }, dt) => {
    if (!swivel.current || !torso.current || !head.current || !armL.current || !armR.current || !elbowL.current || !elbowR.current) return;
    const t = clock.elapsedTime;
    const waving = selected === "about";
    const k = reduced ? 1000 : 5;
    const d = (from: number, to: number) => damp(from, to, k, dt);

    swivel.current.rotation.y = d(swivel.current.rotation.y, waving ? facing : CHAIR_IDLE);

    // Typing pose: upper arms down and forward, forearms level over the keyboard.
    const typeL = reduced ? 0 : Math.max(0, Math.sin(t * 9)) * 0.08;
    const typeR = reduced ? 0 : Math.max(0, Math.sin(t * 9 + 2)) * 0.08;
    armL.current.rotation.x = d(armL.current.rotation.x, 0.55);
    elbowL.current.rotation.x = d(elbowL.current.rotation.x, waving ? 0.6 : 1.05 + typeL);
    armR.current.rotation.x = d(armR.current.rotation.x, waving ? 0 : 0.55);
    armR.current.rotation.z = d(armR.current.rotation.z, waving ? 2.5 : 0);
    elbowR.current.rotation.x = d(elbowR.current.rotation.x, waving ? 0 : 1.05 + typeR);
    elbowR.current.rotation.z = waving && !reduced ? Math.sin(t * 8) * 0.45 + 0.2 : d(elbowR.current.rotation.z, 0);

    torso.current.rotation.x = d(torso.current.rotation.x, waving ? 0 : 0.12);
    torso.current.scale.y = reduced ? 1 : 1 + Math.sin(t * 1.6) * 0.008;
    head.current.rotation.x = d(head.current.rotation.x, waving ? -0.05 : 0.12);
    head.current.rotation.z = reduced ? 0 : Math.sin(t * 0.7) * 0.04;
  });

  return (
    <Pickable id="about" position={CHAIR_POS}>
      <group ref={swivel} rotation={[0, CHAIR_IDLE, 0]}>
        {/* Chair */}
        <RoundedBox args={[0.55, 0.07, 0.5]} radius={0.03} position={[0, 0.48, 0]} castShadow>
          <meshStandardMaterial color="#3d4250" />
        </RoundedBox>
        <RoundedBox args={[0.52, 0.55, 0.06]} radius={0.03} position={[0, 0.82, 0.25]} rotation={[-0.08, 0, 0]} castShadow>
          <meshStandardMaterial color="#3d4250" />
        </RoundedBox>
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.46]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.16, 0.03, Math.sin((i / 5) * Math.PI * 2) * 0.16]} rotation={[0, -(i / 5) * Math.PI * 2, 0]} castShadow>
            <boxGeometry args={[0.32, 0.03, 0.04]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
        ))}

        {/* Legs: thighs on the seat, shins down to the floor */}
        {[-1, 1].map((side) => (
          <group key={side} position={[0.09 * side, 0, 0]}>
            <RoundedBox args={[0.13, 0.12, 0.42]} radius={0.05} position={[0, 0.58, -0.12]} castShadow>
              <meshStandardMaterial color={AVATAR.pants} />
            </RoundedBox>
            <RoundedBox args={[0.11, 0.5, 0.12]} radius={0.045} position={[0, 0.32, -0.33]} castShadow>
              <meshStandardMaterial color={AVATAR.pants} />
            </RoundedBox>
            <RoundedBox args={[0.12, 0.07, 0.22]} radius={0.03} position={[0, 0.04, -0.38]} castShadow>
              <meshStandardMaterial color={AVATAR.shoes} />
            </RoundedBox>
          </group>
        ))}

        {/* Upper body pivots at the hips so it can lean toward the desk */}
        <group ref={torso} position={[0, 0.55, 0.06]}>
          <group position={[0, -0.55, -0.06]}>
            <RoundedBox args={[0.38, 0.5, 0.22]} radius={0.08} position={[0, 0.82, 0.05]} castShadow>
              <meshStandardMaterial color={AVATAR.shirt} />
            </RoundedBox>
            <mesh position={[0, 1.1, 0.04]}>
              <cylinderGeometry args={[0.045, 0.05, 0.08, 12]} />
              <meshStandardMaterial color={AVATAR.skin} />
            </mesh>
            <group ref={head} position={[0, 1.24, 0.03]}>
              <mesh castShadow>
                <sphereGeometry args={[0.12, 24, 18]} />
                <meshStandardMaterial color={AVATAR.skin} />
              </mesh>
              {/* Hair: a cap over the top and back of the head */}
              <mesh position={[0, 0.025, 0.015]} rotation={[-0.35, 0, 0]} castShadow>
                <sphereGeometry args={[0.128, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial color={AVATAR.hair} roughness={0.9} />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[0.122 * side, -0.01, 0.01]}>
                  <sphereGeometry args={[0.025, 10, 8]} />
                  <meshStandardMaterial color={AVATAR.skin} />
                </mesh>
              ))}
              {/* Eyes, on the side facing the desk */}
              {[-1, 1].map((side) => (
                <mesh key={`e${side}`} position={[0.042 * side, 0.0, -0.113]}>
                  <sphereGeometry args={[0.013, 10, 8]} />
                  <meshStandardMaterial color="#1f1d1b" />
                </mesh>
              ))}
              <mesh position={[0, -0.045, -0.114]} rotation={[0, Math.PI, Math.PI]}>
                <torusGeometry args={[0.032, 0.007, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#1f1d1b" />
              </mesh>
            </group>
            <Arm side={-1} armRef={armL} elbowRef={elbowL} />
            <Arm side={1} armRef={armR} elbowRef={elbowR} />
          </group>
        </group>
      </group>
    </Pickable>
  );
}

function Lamp() {
  const { phase } = useDesk();
  const [on, setOn] = useState<boolean | null>(null);
  const [hover, setHover] = useState(false);
  useCursor(hover);
  const lit = on ?? phase === "night";

  return (
    <group
      position={[-0.75, 0.79, -2.65]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        setOn(!lit);
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.025, 24]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0.05, 0.22, 0.05]} rotation={[0.35, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.46]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <group position={[0.12, 0.43, 0.15]} rotation={[0.9, 0, -0.3]}>
        <mesh castShadow>
          <coneGeometry args={[0.1, 0.16, 24, 1, true]} />
          <meshStandardMaterial color={COLORS.accent} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.035, 16, 12]} />
          <meshStandardMaterial color="#fff6e0" emissive="#ffd590" emissiveIntensity={lit ? 2 : 0} />
        </mesh>
      </group>
      {lit && <pointLight position={[0.2, 0.3, 0.3]} color="#ffcf8a" intensity={3.2} distance={4} decay={1.6} castShadow={false} />}
    </group>
  );
}

function Plant() {
  const leaves = useMemo(() => {
    const rand = mulberry32(3);
    return Array.from({ length: 9 }, (_, i) => ({
      rot: [0.5 + rand() * 0.5, (i / 9) * Math.PI * 2, 0] as Vec3,
      len: 0.32 + rand() * 0.2,
    }));
  }, []);
  return (
    <group position={[-2.45, 0, -2.45]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.4, 24]} />
        <meshStandardMaterial color={COLORS.pot} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.38, 0]} rotation={[0, l.rot[1], 0]}>
          <mesh rotation={[l.rot[0], 0, 0]} position={[0, l.len * 0.45, l.len * 0.25]} scale={[0.09, l.len, 0.025]} castShadow>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={COLORS.leaf} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Shelf() {
  const books = useMemo(() => {
    const rand = mulberry32(11);
    const colors = ["#2b4fa8", "#b3502d", "#d9cfb8", "#3d4250", "#7a8b5a", "#c9a24a"];
    let z = -0.45;
    return Array.from({ length: 8 }, () => {
      const t = 0.05 + rand() * 0.04;
      const h = 0.2 + rand() * 0.08;
      const b = { z: z + t / 2, t, h, color: colors[Math.floor(rand() * colors.length)] };
      z += t + 0.006;
      return b;
    });
  }, []);
  return (
    <group position={[-2.85, 1.15, 0.35]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.035, 1.1]} />
        <meshStandardMaterial color={COLORS.desk} />
      </mesh>
      {books.map((b, i) => (
        <mesh key={i} position={[0, b.h / 2 + 0.018, b.z]} castShadow>
          <boxGeometry args={[0.2, b.h, b.t]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Topic objects

const CODE = [
  "export function Desk() {",
  '  const [mate] = useState("ready");',
  "  const agent = useAgent({ evals: true });",
  "",
  "  return (",
  "    <Monitor>",
  "      <Feature owner=\"me\" endToEnd />",
  "    </Monitor>",
  "  );",
  "}",
];

function drawCode(ctx: CanvasRenderingContext2D, w: number, h: number, chars: number, cursorOn: boolean) {
  ctx.fillStyle = "#1d1f23";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2a2d33";
  ctx.fillRect(0, 0, w, 26);
  ["#e06c5a", "#e5b454", "#7cb36a"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(16 + i * 16, 13, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#8b8f98";
  ctx.font = "13px ui-monospace, Menlo, monospace";
  ctx.fillText("Desk.tsx", 72, 17);

  ctx.font = "17px ui-monospace, Menlo, monospace";
  let remaining = chars;
  let cursor: [number, number] | null = null;
  CODE.forEach((line, i) => {
    const y = 58 + i * 25;
    ctx.fillStyle = "#555a63";
    ctx.fillText(String(i + 1).padStart(2, " "), 12, y);
    const shown = line.slice(0, Math.max(0, remaining));
    remaining -= line.length + 1;
    let x = 48;
    for (const token of shown.split(/(\s+|"[^"]*"?|[(){}<>/=;,[\]])/).filter(Boolean)) {
      ctx.fillStyle = /^(export|function|const|return|true)$/.test(token)
        ? "#8ea8e8"
        : token.startsWith('"')
          ? "#e0a77c"
          : /^[A-Z]/.test(token)
            ? "#d8c58a"
            : "#d7d3cb";
      ctx.fillText(token, x, y);
      x += ctx.measureText(token).width;
    }
    if (!cursor && remaining <= 0) cursor = [x, y];
  });
  if (cursorOn) {
    const [cx, cy] = cursor ?? [48, 58 + CODE.length * 25];
    ctx.fillStyle = "#d7d3cb";
    ctx.fillRect(cx + 1, cy - 15, 9, 19);
  }
}

function Monitor() {
  const { reduced } = useDesk();
  const screen = useCanvasTexture(512, 320);
  const total = CODE.join("\n").length;
  const state = useRef({ t: 0, last: "" });

  useFrame((_, dt) => {
    state.current.t += dt;
    const t = state.current.t;
    // Type at ~22 characters per second, hold for a few seconds, then start over.
    const cycle = total / 22 + 4;
    const chars = reduced ? total : Math.floor((t % cycle) * 22);
    const cursorOn = reduced || Math.floor(t * 2) % 2 === 0;
    const key = `${chars}:${cursorOn}`;
    if (key === state.current.last) return;
    state.current.last = key;
    drawCode(screen.ctx, 512, 320, chars, cursorOn);
    screen.texture.needsUpdate = true;
  });

  return (
    <Pickable id="frontend" position={[0.1, 0.79, -2.6]}>
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.3, 0.025, 0.18]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0, 0.17, -0.02]} castShadow>
        <boxGeometry args={[0.05, 0.3, 0.03]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <RoundedBox args={[1.08, 0.7, 0.045]} radius={0.015} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color={COLORS.metal} />
      </RoundedBox>
      <mesh position={[0, 0.48, 0.024]}>
        <planeGeometry args={[1.02, 0.64]} />
        <meshBasicMaterial map={screen.texture} toneMapped={false} />
      </mesh>
    </Pickable>
  );
}

function Robot() {
  const { reduced, selected } = useDesk();
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const blink = useRef({ next: 2, until: 0 });

  useFrame(({ pointer, clock }, dt) => {
    const t = clock.elapsedTime;
    if (!head.current || !eyes.current || !body.current) return;
    if (reduced) return;
    const waving = selected === "agents";
    head.current.rotation.y = damp(head.current.rotation.y, waving ? 0.25 : pointer.x * 0.7, 6, dt);
    head.current.rotation.x = damp(head.current.rotation.x, -pointer.y * 0.25, 6, dt);
    head.current.rotation.z = damp(head.current.rotation.z, waving ? Math.sin(t * 6) * 0.12 : 0, 6, dt);
    body.current.position.y = Math.sin(t * 2) * 0.006;

    const b = blink.current;
    if (t > b.next) {
      b.until = t + 0.12;
      b.next = t + 2.5 + Math.random() * 3;
    }
    eyes.current.scale.y = t < b.until ? 0.15 : 1;
  });

  return (
    <Pickable id="agents" position={[1.2, 0.79, -2.2]} rotation={[0, -0.35, 0]}>
      <group ref={body}>
        <RoundedBox args={[0.24, 0.2, 0.18]} radius={0.04} position={[0, 0.11, 0]} castShadow>
          <meshStandardMaterial color={COLORS.robot} />
        </RoundedBox>
        <mesh position={[0, 0.13, 0.091]}>
          <circleGeometry args={[0.035, 24]} />
          <meshStandardMaterial color={COLORS.accent} />
        </mesh>
        <group ref={head} position={[0, 0.3, 0]}>
          <RoundedBox args={[0.3, 0.2, 0.22]} radius={0.05} castShadow>
            <meshStandardMaterial color={COLORS.robot} />
          </RoundedBox>
          <RoundedBox args={[0.23, 0.12, 0.02]} radius={0.01} position={[0, 0, 0.105]}>
            <meshStandardMaterial color={COLORS.face} roughness={0.3} />
          </RoundedBox>
          <group ref={eyes} position={[0, 0.005, 0.117]}>
            {[-0.05, 0.05].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <circleGeometry args={[0.02, 20]} />
                <meshBasicMaterial color={COLORS.accentLight} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.09]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <sphereGeometry args={[0.022, 16, 12]} />
            <meshStandardMaterial color={COLORS.accent} />
          </mesh>
        </group>
      </group>
    </Pickable>
  );
}

function ServerRack() {
  const { reduced, hovered, selected } = useDesk();
  const busy = hovered === "backend" || selected === "backend";
  const leds = useMemo(() => {
    const rand = mulberry32(5);
    const list: { pos: Vec3; color: string; mat: THREE.MeshBasicMaterial; on: boolean }[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const color = rand() < 0.75 ? "#7bd88f" : "#f2c46d";
        list.push({
          pos: [-0.17 + col * 0.04, 0.32 + row * 0.22, 0.351],
          color,
          mat: new THREE.MeshBasicMaterial({ color, toneMapped: false }),
          on: rand() < 0.6,
        });
      }
    }
    return list;
  }, []);

  useFrame((_, dt) => {
    if (reduced) return;
    // Blink faster while the rack is "under load".
    const rate = busy ? 14 : 2.5;
    for (const led of leds) {
      if (Math.random() < rate * dt * 0.5) led.on = !led.on;
      led.mat.color.set(led.on ? led.color : "#2f3a33");
    }
  });

  return (
    <Pickable id="backend" position={[2.3, 0, -2.4]} rotation={[0, -0.2, 0]}>
      <RoundedBox args={[0.62, 1.4, 0.7]} radius={0.02} position={[0, 0.72, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.metal} roughness={0.5} />
      </RoundedBox>
      {[0, 1, 2, 3, 4].map((row) => (
        <mesh key={row} position={[0, 0.32 + row * 0.22, 0.352]}>
          <planeGeometry args={[0.54, 0.17]} />
          <meshStandardMaterial color="#383a40" roughness={0.4} />
        </mesh>
      ))}
      {leds.map((led, i) => (
        <mesh key={i} position={[led.pos[0], led.pos[1], 0.354]} material={led.mat}>
          <planeGeometry args={[0.018, 0.018]} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((row) => (
        <mesh key={`v${row}`} position={[0.14, 0.32 + row * 0.22, 0.354]}>
          <planeGeometry args={[0.16, 0.012]} />
          <meshStandardMaterial color="#55585f" />
        </mesh>
      ))}
    </Pickable>
  );
}

function drawDashboard(ctx: CanvasRenderingContext2D, w: number, h: number, series: number[]) {
  ctx.fillStyle = "#1d1f23";
  ctx.fillRect(0, 0, w, h);

  ctx.font = "500 18px system-ui, sans-serif";
  ctx.fillStyle = "#d7d3cb";
  ctx.fillText("p95 latency", 24, 38);
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillStyle = "#7bd88f";
  ctx.beginPath();
  ctx.arc(w - 176, 33, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a978f";
  ctx.fillText("All systems normal", w - 164, 38);

  const top = 70;
  const bottom = h - 34;
  ctx.strokeStyle = "#2c2f35";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = top + ((bottom - top) * i) / 3;
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(w - 24, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#8ea8e8";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  series.forEach((v, i) => {
    const x = 24 + ((w - 48) * i) / (series.length - 1);
    const y = bottom - (bottom - top) * v;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  const latest = Math.round(38 + series[series.length - 1] * 60);
  ctx.font = "14px ui-monospace, Menlo, monospace";
  ctx.fillStyle = "#9a978f";
  ctx.fillText(`${latest} ms`, w - 82, h - 12);
}

function Dashboard() {
  const { reduced } = useDesk();
  const screen = useCanvasTexture(512, 320);
  const state = useRef({ acc: 0, series: [] as number[], v: 0.4 });

  useEffect(() => {
    const rand = mulberry32(9);
    const s = state.current;
    s.series = Array.from({ length: 48 }, () => {
      s.v = Math.min(0.85, Math.max(0.15, s.v + (rand() - 0.5) * 0.12));
      return s.v;
    });
    drawDashboard(screen.ctx, 512, 320, s.series);
    screen.texture.needsUpdate = true;
  }, [screen]);

  useFrame((_, dt) => {
    if (reduced) return;
    const s = state.current;
    s.acc += dt;
    if (s.acc < 0.35) return;
    s.acc = 0;
    s.v = Math.min(0.85, Math.max(0.15, s.v + (Math.random() - 0.5) * 0.12));
    s.series.push(s.v);
    s.series.shift();
    drawDashboard(screen.ctx, 512, 320, s.series);
    screen.texture.needsUpdate = true;
  });

  return (
    <Pickable id="reliability" position={[-2.9, 1.85, -1.0]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[1.12, 0.72, 0.05]} radius={0.015} castShadow>
        <meshStandardMaterial color={COLORS.metal} />
      </RoundedBox>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[1.06, 0.66]} />
        <meshBasicMaterial map={screen.texture} toneMapped={false} />
      </mesh>
    </Pickable>
  );
}

function Mate() {
  const { reduced } = useDesk();
  const steam = useRef<THREE.Group>(null);
  const gourd = useMemo(() => {
    const pts = [
      [0, 0],
      [0.06, 0.004],
      [0.085, 0.03],
      [0.095, 0.075],
      [0.085, 0.12],
      [0.062, 0.15],
      [0.058, 0.165],
      [0.066, 0.18],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 32);
  }, []);
  const puffs = useMemo(() => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, depthWrite: false })), []);

  useFrame(({ clock }) => {
    if (!steam.current) return;
    steam.current.visible = !reduced;
    if (reduced) return;
    const t = clock.elapsedTime;
    steam.current.children.forEach((child, i) => {
      const p = (t * 0.35 + i / 3) % 1;
      child.position.set(Math.sin(p * 6 + i) * 0.02, p * 0.3, 0);
      child.scale.setScalar(0.02 + p * 0.03);
      puffs[i].opacity = 0.45 * (1 - p) * Math.min(1, p * 5);
    });
  });

  return (
    <group position={[-0.55, 0.79, -2.05]}>
      <mesh geometry={gourd} castShadow>
        <meshStandardMaterial color={COLORS.gourd} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.172, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 24]} />
        <meshStandardMaterial color={COLORS.yerba} roughness={1} />
      </mesh>
      <mesh position={[0.02, 0.24, 0.0]} rotation={[0, 0, -0.28]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.26]} />
        <meshStandardMaterial color="#c9c6bf" metalness={0.8} roughness={0.3} />
      </mesh>
      <group ref={steam} position={[-0.02, 0.2, 0]}>
        {puffs.map((m, i) => (
          <mesh key={i} material={m}>
            <sphereGeometry args={[1, 12, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Lights and root

function Lights() {
  const { phase } = useDesk();
  const l = LIGHTING[phase];
  return (
    <>
      <ambientLight color={l.ambient[0]} intensity={l.ambient[1]} />
      <hemisphereLight args={[l.hemi[0], l.hemi[1], l.hemi[2]]} />
      <directionalLight
        position={[5, 9, 4]}
        color={l.sun[0]}
        intensity={l.sun[1]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
    </>
  );
}

function Cursor() {
  const { hovered } = useDesk();
  useCursor(hovered !== null);
  return null;
}

function World() {
  const group = useRef<THREE.Group>(null);
  // Every mesh receives shadows; casting is opted into per mesh.
  useLayoutEffect(() => {
    group.current?.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) obj.receiveShadow = true;
    });
  }, []);

  return (
    <group ref={group}>
      <Room />
      <Desk />
      <ChairAndMe />
      <Lamp />
      <Plant />
      <Shelf />
      <Monitor />
      <Robot />
      <ServerRack />
      <Dashboard />
      <Mate />
    </group>
  );
}

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ fov: 30, near: 0.1, far: 60, position: VIEWS.home.cam }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => props.selected && props.onSelect(props.selected)}
    >
      <DeskContext.Provider value={props}>
        <Lights />
        <Rig />
        <Cursor />
        <World />
      </DeskContext.Provider>
    </Canvas>
  );
}
