import { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const rootDir = path.resolve(import.meta.dirname, '..');
const file = path.join(rootDir, 'public/assets/models/dovel-system-01.glb');
const requiredNodes = ['RailAssembly', 'RailBody', 'ArcDock', 'HaloLight', 'PocketTray'];
const requiredMaterials = [
  'FinishMetal',
  'FinishInset',
  'VermilionLatch',
  'WarmLED',
  'AshWood',
  'GraphitePad',
  'WoodGrain',
];
const minBytes = 1024;
const maxBytes = 600_000;

function fail(message) {
  throw new Error(`DOVEL System 01 check failed: ${message}`);
}

function finiteVector(v) {
  return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}

function parseGlbHeaderAndJson(buffer) {
  if (buffer.byteLength < 20) fail(`file too small for GLB header (${buffer.byteLength} bytes)`);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const magic = view.getUint32(0, true);
  const version = view.getUint32(4, true);
  const declaredLength = view.getUint32(8, true);
  if (magic !== 0x46546c67) fail(`wrong magic 0x${magic.toString(16)} (expected glTF)`);
  if (version !== 2) fail(`wrong GLB version ${version} (expected 2)`);
  if (declaredLength !== buffer.byteLength) fail(`declared length ${declaredLength} does not match bytes ${buffer.byteLength}`);

  let offset = 12;
  let json = null;
  while (offset + 8 <= buffer.byteLength) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    offset += 8;
    if (offset + chunkLength > buffer.byteLength) fail(`chunk overruns file at offset ${offset}`);
    if (chunkType === 0x4e4f534a) {
      const chunk = buffer.subarray(offset, offset + chunkLength);
      json = JSON.parse(new TextDecoder().decode(chunk).trim());
    }
    offset += chunkLength;
  }
  if (!json) fail('missing JSON chunk');
  if (offset !== buffer.byteLength) fail(`chunk parsing ended at ${offset}, expected ${buffer.byteLength}`);
  return json;
}

function loadGlb(arrayBuffer) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', resolve, reject);
  });
}

const buffer = await readFile(file);
if (buffer.byteLength < minBytes) fail(`unreasonable size: ${buffer.byteLength} bytes is below ${minBytes}`);
if (buffer.byteLength > maxBytes) fail(`unreasonable size: ${buffer.byteLength} bytes exceeds ${maxBytes}`);

const json = parseGlbHeaderAndJson(buffer);
if (json.images?.length) fail('textures/images are not allowed');
if (json.textures?.length) fail('textures are not allowed');
for (const material of json.materials ?? []) {
  for (const key of Object.keys(material.pbrMetallicRoughness ?? {})) {
    if (key.endsWith('Texture')) fail(`material ${material.name ?? '<unnamed>'} uses ${key}`);
  }
  if (material.normalTexture || material.occlusionTexture || material.emissiveTexture) {
    fail(`material ${material.name ?? '<unnamed>'} uses a texture slot`);
  }
}

const nodeNames = new Set((json.nodes ?? []).map((node) => node.name).filter(Boolean));
const materialNames = new Set((json.materials ?? []).map((material) => material.name).filter(Boolean));
for (const name of requiredNodes) {
  if (!nodeNames.has(name)) fail(`missing semantic node ${name}`);
}
for (const name of requiredMaterials) {
  if (!materialNames.has(name)) fail(`missing material ${name}`);
}

const gltf = await loadGlb(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
gltf.scene.updateMatrixWorld(true);
const bounds = new THREE.Box3();
let meshCount = 0;
gltf.scene.traverse((object) => {
  if (!object.isMesh || !object.geometry) return;
  meshCount += 1;
  object.updateWorldMatrix(true, false);
  const geometry = object.geometry;
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const meshBounds = geometry.boundingBox.clone().applyMatrix4(object.matrixWorld);
  if (!finiteVector(meshBounds.min) || !finiteVector(meshBounds.max)) {
    fail(`non-finite bounds on mesh ${object.name ?? '<unnamed>'}`);
  }
  bounds.union(meshBounds);
});

if (meshCount === 0) fail('no mesh data found');
if (bounds.isEmpty() || !finiteVector(bounds.min) || !finiteVector(bounds.max)) fail('invalid aggregate bounds');
const size = bounds.getSize(new THREE.Vector3());
if (bounds.min.y < -0.001) fail(`baseline is below desk surface: min.y=${bounds.min.y}`);
if (size.x < 1.15 || size.x > 1.25) fail(`width ${size.x}m is not a 120cm-class baseline`);
if (size.y <= 0 || size.z <= 0) fail(`invalid dimensions ${size.toArray().join(', ')}`);
if (size.x > 2 || size.y > 1.5 || size.z > 1) fail(`unreasonable dimensions ${size.toArray().join(', ')}`);

const report = {
  file,
  bytes: buffer.byteLength,
  bounds: {
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
    size: size.toArray(),
  },
  meshCount,
  nodes: [...nodeNames].sort(),
  materials: [...materialNames].sort(),
};

console.log(JSON.stringify(report, null, 2));
