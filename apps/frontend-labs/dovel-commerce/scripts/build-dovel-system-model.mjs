import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class NodeFileReader {
    async readAsArrayBuffer(blob) {
      this.result = await blob.arrayBuffer();
      this.onloadend?.({ target: this });
    }

    async readAsDataURL(blob) {
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
      this.onloadend?.({ target: this });
    }
  };
}

const rootDir = path.resolve(import.meta.dirname, '..');
const outFile = path.join(rootDir, 'public/assets/models/dovel-system-01.glb');

const scene = new THREE.Scene();
scene.name = 'DOVELSystem01Scene';
scene.userData = {
  title: 'DOVEL System 01',
  units: 'meters',
  baseline: '120cm desk-safe rail width, bottom at y=0',
  provenance: 'Original procedural mesh generated with three@0.182.0 GLTFExporter; no Blender, textures, or external assets.',
};

const materials = {
  FinishMetal: new THREE.MeshStandardMaterial({
    name: 'FinishMetal',
    color: 0x6d7170,
    metalness: 0.62,
    roughness: 0.34,
  }),
  FinishInset: new THREE.MeshStandardMaterial({
    name: 'FinishInset',
    color: 0x8d8f8b,
    metalness: 0.44,
    roughness: 0.48,
  }),
  VermilionLatch: new THREE.MeshStandardMaterial({
    name: 'VermilionLatch',
    color: 0xd54a32,
    metalness: 0.18,
    roughness: 0.42,
  }),
  WarmLED: new THREE.MeshStandardMaterial({
    name: 'WarmLED',
    color: 0xffd9a0,
    emissive: 0xffb45a,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  }),
  AshWood: new THREE.MeshStandardMaterial({
    name: 'AshWood',
    color: 0xb79a75,
    metalness: 0.0,
    roughness: 0.58,
  }),
  GraphitePad: new THREE.MeshStandardMaterial({
    name: 'GraphitePad',
    color: 0x2b2e2c,
    metalness: 0.08,
    roughness: 0.72,
  }),
  WoodGrain: new THREE.MeshStandardMaterial({
    name: 'WoodGrain',
    color: 0x9d7b56,
    metalness: 0,
    roughness: 0.68,
  }),
};

function mesh(name, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const m = new THREE.Mesh(geometry, material);
  m.name = name;
  m.position.set(...position);
  m.rotation.set(...rotation);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const roundedBox = (width, height, depth, radius) =>
  new RoundedBoxGeometry(width, height, depth, 1, radius);
const smoothRoundedBox = (width, height, depth, radius) =>
  new RoundedBoxGeometry(width, height, depth, 2, radius);

const wedgeGeometry = (width, height, frontHeight, depth) => {
  const geometry = new THREE.BufferGeometry();
  const x = width / 2;
  const z = depth / 2;
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -x, 0, z,
    x, 0, z,
    x, 0, -z,
    -x, 0, -z,
    -x, frontHeight, z,
    x, frontHeight, z,
    x, height, -z,
    -x, height, -z,
  ], 3));
  geometry.setIndex([
    0, 2, 1, 0, 3, 2,
    4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4,
    3, 7, 6, 3, 6, 2,
    0, 4, 7, 0, 7, 3,
    1, 2, 6, 1, 6, 5,
  ]);
  geometry.computeVertexNormals();
  return geometry;
};

const railAssembly = new THREE.Group();
railAssembly.name = 'RailAssembly';
railAssembly.userData = { role: 'semantic-root', widthMeters: 1.2 };
scene.add(railAssembly);

const railBody = new THREE.Group();
railBody.name = 'RailBody';
railBody.userData = { role: '120cm structural desk-edge dovetail rail', dimensionsMeters: [1.2, 0.14, 0.14] };
railAssembly.add(railBody);
railBody.add(mesh('RailBody_shell', roundedBox(1.2, 0.075, 0.13, 0.016), materials.FinishMetal, [0, 0.08, 0]));
railBody.add(mesh('RailBody_slotBed', roundedBox(1.08, 0.01, 0.062, 0.004), materials.GraphitePad, [0, 0.126, 0]));
railBody.add(mesh('RailBody_frontLip', roundedBox(1.1, 0.022, 0.022, 0.006), materials.FinishMetal, [0, 0.139, 0.048]));
railBody.add(mesh('RailBody_rearLip', roundedBox(1.1, 0.022, 0.022, 0.006), materials.FinishMetal, [0, 0.139, -0.048]));
railBody.add(mesh('RailBody_leftCap', roundedBox(0.018, 0.07, 0.11, 0.005), materials.FinishMetal, [-0.607, 0.08, 0]));
railBody.add(mesh('RailBody_rightCap', roundedBox(0.018, 0.07, 0.11, 0.005), materials.FinishMetal, [0.607, 0.08, 0]));
railBody.add(mesh('RailBody_edgeClamp', roundedBox(1.08, 0.055, 0.038, 0.008), materials.GraphitePad, [0, 0.0275, -0.07]));

const arcDock = new THREE.Group();
arcDock.name = 'ArcDock';
arcDock.position.set(-0.37, 0.14, 0);
arcDock.userData = { role: '15-degree angled aluminum landing dock with open shared rail shoe' };
railAssembly.add(arcDock);
arcDock.add(mesh('ArcDock_shoeTop', roundedBox(0.15, 0.04, 0.13, 0.01), materials.GraphitePad, [0, 0.015, 0]));
arcDock.add(mesh('ArcDock_shoeBottom', roundedBox(0.15, 0.032, 0.115, 0.009), materials.GraphitePad, [0, -0.045, 0]));
arcDock.add(mesh('ArcDock_shoeBack', roundedBox(0.15, 0.085, 0.025, 0.007), materials.GraphitePad, [0, -0.015, -0.058]));
arcDock.add(mesh('ArcDock_latch', new THREE.CylinderGeometry(0.024, 0.024, 0.028, 18), materials.VermilionLatch, [0.085, -0.005, 0.06], [Math.PI / 2, 0, 0]));
arcDock.add(mesh('ArcDock_baseWedge', wedgeGeometry(0.21, 0.16, 0.065, 0.18), materials.FinishMetal, [0, 0.05, -0.01]));
arcDock.add(mesh('ArcDock_plate', roundedBox(0.27, 0.36, 0.038, 0.026), materials.FinishMetal, [0, 0.37, -0.085], [-0.26, 0, 0]));
arcDock.add(mesh('ArcDock_inset', roundedBox(0.235, 0.32, 0.012, 0.022), materials.FinishInset, [0, 0.37, -0.058], [-0.26, 0, 0]));
arcDock.add(mesh('ArcDock_ledge', roundedBox(0.275, 0.03, 0.082, 0.01), materials.FinishMetal, [0, 0.195, 0.002], [-0.26, 0, 0]));
arcDock.add(mesh('ArcDock_ledgeNotch', roundedBox(0.07, 0.018, 0.032, 0.006), materials.FinishInset, [0, 0.21, 0.048], [-0.26, 0, 0]));

const haloLight = new THREE.Group();
haloLight.name = 'HaloLight';
haloLight.position.set(0, 0.14, 0);
haloLight.userData = { role: 'slender task light with left-reaching blade, rotation joint, collar, and open rail clamp' };
railAssembly.add(haloLight);
haloLight.add(mesh('HaloLight_clampTop', roundedBox(0.15, 0.04, 0.13, 0.01), materials.GraphitePad, [0, 0.02, 0]));
haloLight.add(mesh('HaloLight_clampBottom', roundedBox(0.15, 0.032, 0.115, 0.009), materials.GraphitePad, [0, -0.045, 0]));
haloLight.add(mesh('HaloLight_clampBack', roundedBox(0.15, 0.085, 0.025, 0.007), materials.GraphitePad, [0, -0.015, -0.058]));
haloLight.add(mesh('HaloLight_knob', new THREE.CylinderGeometry(0.027, 0.027, 0.026, 20), materials.GraphitePad, [0, -0.01, 0.072], [Math.PI / 2, 0, 0]));
haloLight.add(mesh('HaloLight_base', roundedBox(0.14, 0.075, 0.12, 0.014), materials.FinishMetal, [0, 0.095, 0]));
haloLight.add(mesh('HaloLight_collar', new THREE.CylinderGeometry(0.025, 0.025, 0.035, 24), materials.VermilionLatch, [0, 0.155, -0.008]));
haloLight.add(mesh('HaloLight_stem', new THREE.CylinderGeometry(0.014, 0.017, 0.48, 20), materials.FinishMetal, [0, 0.405, -0.008]));
haloLight.add(mesh('HaloLight_hinge', new THREE.CylinderGeometry(0.032, 0.032, 0.082, 20), materials.FinishMetal, [0, 0.655, -0.008], [Math.PI / 2, 0, 0]));
haloLight.add(mesh('HaloLight_blade', roundedBox(0.5, 0.043, 0.064, 0.018), materials.FinishMetal, [-0.22, 0.662, -0.008], [0, 0, 0.035]));
haloLight.add(mesh('HaloLight_diffuser', roundedBox(0.43, 0.011, 0.042, 0.006), materials.WarmLED, [-0.22, 0.637, 0.004], [0, 0, 0.035]));

const pocketTray = new THREE.Group();
pocketTray.name = 'PocketTray';
pocketTray.position.set(0.37, 0.14, 0.11);
pocketTray.userData = { role: 'shallow removable ash tray inside an aluminum frame with rear slide attachment' };
railAssembly.add(pocketTray);
pocketTray.add(mesh('PocketTray_rearRail', roundedBox(0.34, 0.055, 0.07, 0.012), materials.GraphitePad, [0, 0.07, -0.15]));
pocketTray.add(mesh('PocketTray_slideLip', roundedBox(0.35, 0.022, 0.055, 0.007), materials.GraphitePad, [0, 0.115, -0.155]));
pocketTray.add(mesh('PocketTray_latch', new THREE.CylinderGeometry(0.024, 0.024, 0.032, 18), materials.VermilionLatch, [0.19, 0.07, -0.15], [0, 0, Math.PI / 2]));
pocketTray.add(mesh('PocketTray_frame', smoothRoundedBox(0.4, 0.042, 0.3, 0.028), materials.FinishMetal, [0, 0.095, 0.04]));
pocketTray.add(mesh('PocketTray_floor', smoothRoundedBox(0.345, 0.014, 0.245, 0.024), materials.AshWood, [0, 0.123, 0.04]));
pocketTray.add(mesh('PocketTray_innerRimFront', roundedBox(0.31, 0.012, 0.012, 0.004), materials.GraphitePad, [0, 0.137, 0.132]));
pocketTray.add(mesh('PocketTray_innerRimBack', roundedBox(0.31, 0.012, 0.012, 0.004), materials.GraphitePad, [0, 0.137, -0.052]));
pocketTray.add(mesh('PocketTray_innerRimLeft', roundedBox(0.012, 0.012, 0.175, 0.004), materials.GraphitePad, [-0.145, 0.137, 0.04]));
pocketTray.add(mesh('PocketTray_innerRimRight', roundedBox(0.012, 0.012, 0.175, 0.004), materials.GraphitePad, [0.145, 0.137, 0.04]));
pocketTray.add(mesh('PocketTray_frontLip', roundedBox(0.345, 0.038, 0.026, 0.01), materials.AshWood, [0, 0.155, 0.15]));
pocketTray.add(mesh('PocketTray_backLip', roundedBox(0.345, 0.038, 0.026, 0.01), materials.AshWood, [0, 0.155, -0.07]));
pocketTray.add(mesh('PocketTray_leftLip', roundedBox(0.026, 0.038, 0.205, 0.01), materials.AshWood, [-0.16, 0.155, 0.04]));
pocketTray.add(mesh('PocketTray_rightLip', roundedBox(0.026, 0.038, 0.205, 0.01), materials.AshWood, [0.16, 0.155, 0.04]));
pocketTray.add(mesh('PocketTray_grainA', new THREE.BoxGeometry(0.24, 0.0015, 0.002), materials.WoodGrain, [0, 0.131, -0.015]));
pocketTray.add(mesh('PocketTray_grainB', new THREE.BoxGeometry(0.27, 0.0015, 0.002), materials.WoodGrain, [0, 0.131, 0.035]));
pocketTray.add(mesh('PocketTray_grainC', new THREE.BoxGeometry(0.22, 0.0015, 0.002), materials.WoodGrain, [0.015, 0.131, 0.082]));

const runtimeHiddenModules = new THREE.Group();
runtimeHiddenModules.name = 'RuntimeHiddenModules';
runtimeHiddenModules.visible = false;
runtimeHiddenModules.userData = { role: 'exported service modules hidden by default at runtime' };
railAssembly.add(runtimeHiddenModules);
runtimeHiddenModules.add(mesh('RuntimeHiddenModules_alignmentSlug', new THREE.BoxGeometry(0.18, 0.035, 0.06), materials.VermilionLatch, [0, 0.2, 0]));
runtimeHiddenModules.add(mesh('RuntimeHiddenModules_servicePort', new THREE.CylinderGeometry(0.026, 0.026, 0.035, 16), materials.WarmLED, [0.52, 0.14, 0.09], [Math.PI / 2, 0, 0]));

scene.updateMatrixWorld(true);
const bounds = new THREE.Box3().setFromObject(scene);
if (!Number.isFinite(bounds.min.x) || bounds.min.y < -1e-6) {
  throw new Error(`Invalid generated bounds: min=${bounds.min.toArray()} max=${bounds.max.toArray()}`);
}

const exporter = new GLTFExporter();
const arrayBuffer = await exporter.parseAsync(scene, {
  binary: true,
  onlyVisible: false,
  trs: false,
  includeCustomExtensions: false,
});

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, Buffer.from(arrayBuffer));
console.log(JSON.stringify({
  file: outFile,
  bytes: Buffer.byteLength(Buffer.from(arrayBuffer)),
  bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
  semanticNodes: ['RailAssembly', 'RailBody', 'ArcDock', 'HaloLight', 'PocketTray'],
  materials: Object.keys(materials),
}, null, 2));
