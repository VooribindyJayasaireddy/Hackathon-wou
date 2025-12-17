import * as THREE from 'three';

export function InteractionLink({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const points = [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.6,
  });

  const line = new THREE.Line(geometry, material);

  return <primitive object={line} />;
}
