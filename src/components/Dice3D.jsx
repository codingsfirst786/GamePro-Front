// Dice3D.jsx
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

const FACE_ROTATIONS = {
  1: new THREE.Euler(Math.PI / 2, 0, 0),
  2: new THREE.Euler(-Math.PI / 2, 0, 0),
  3: new THREE.Euler(0, 0, 0),
  4: new THREE.Euler(0, Math.PI, 0),
  5: new THREE.Euler(0, -Math.PI / 2, 0),
  6: new THREE.Euler(0, Math.PI / 2, 0),
};

const PIP_POSITIONS = [
  [[0, 0, 0]], // 1
  [
    [-0.3, 0.3, 0],
    [0.3, -0.3, 0],
  ], // 2
  [
    [-0.3, 0.3, 0],
    [0.3, -0.3, 0],
    [0, 0, 0],
  ], // 3
  [
    [-0.3, 0.3, 0],
    [0.3, 0.3, 0],
    [-0.3, -0.3, 0],
    [0.3, -0.3, 0],
  ], // 4
  [
    [-0.3, 0.3, 0],
    [0.3, 0.3, 0],
    [-0.3, -0.3, 0],
    [0.3, -0.3, 0],
    [0, 0, 0],
  ], // 5
  [
    [-0.3, 0.3, 0],
    [0.3, 0.3, 0],
    [-0.3, 0, 0],
    [0.3, 0, 0],
    [-0.3, -0.3, 0],
    [0.3, -0.3, 0],
  ], // 6
];

const HALF = 0.7;
const PIP_INSET = 0.002;

// Where each face sits
const FACE_DIRS = {
  1: new THREE.Vector3(0, HALF, 0),
  2: new THREE.Vector3(0, -HALF, 0),
  3: new THREE.Vector3(0, 0, HALF),
  4: new THREE.Vector3(0, 0, -HALF),
  5: new THREE.Vector3(HALF, 0, 0),
  6: new THREE.Vector3(-HALF, 0, 0),
};

// Rotations so Z axis points OUT of the cube
const FACE_ROTS = {
  1: new THREE.Euler(-Math.PI / 2, 0, 0), // top
  2: new THREE.Euler(Math.PI / 2, 0, 0), // bottom
  3: new THREE.Euler(0, 0, 0), // front
  4: new THREE.Euler(0, Math.PI, 0), // back
  5: new THREE.Euler(0, -Math.PI / 2, 0), // right
  6: new THREE.Euler(0, Math.PI / 2, 0), // left
};

export default function Dice3D({ value = 1, rolling }) {
  const mesh = useRef();
  const [target, setTarget] = useState(new THREE.Quaternion());
  const [spin, setSpin] = useState(new THREE.Vector3());
  const [spinTime, setSpinTime] = useState(0);

  // handle value or roll change
  useEffect(() => {
    const euler = FACE_ROTATIONS[value] || FACE_ROTATIONS[1];
    setTarget(new THREE.Quaternion().setFromEuler(euler));

    if (rolling) {
      setSpin(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        )
      );
      setSpinTime(2.5); // secs of free spin
    }
  }, [value, rolling]);

  // animate spin + smooth stop
  useFrame((_, delta) => {
    if (!mesh.current) return;

    if (spinTime > 0) {
      mesh.current.rotation.x += spin.x * delta;
      mesh.current.rotation.y += spin.y * delta;
      mesh.current.rotation.z += spin.z * delta;
      setSpinTime((t) => t - delta);
    } else {
      const dist = mesh.current.quaternion.angleTo(target);
      if (dist < 0.01) {
        mesh.current.quaternion.copy(target);
      } else {
        mesh.current.quaternion.slerp(target, 0.18);
      }
    }
  });

  // Build all pips
  const pips = useMemo(() => {
    const groups = [];
    for (let f = 1; f <= 6; f++) {
      PIP_POSITIONS[f - 1].forEach(([x, y], i) => {
        groups.push(
          <group
            key={`face-${f}-pip-${i}`}
            position={FACE_DIRS[f]}
            rotation={FACE_ROTS[f]}
          >
            <mesh position={[x, y, -PIP_INSET]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
        );
      });
    }
    return groups;
  }, []);

  return (
    <group ref={mesh}>
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.12} smoothness={6}>
        <meshStandardMaterial color="white" />
      </RoundedBox>
      {pips}
    </group>
  );
}
