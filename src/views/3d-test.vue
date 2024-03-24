<template>
  <div>123</div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

// load all animations
async function loadAnimations() {
  let animationNameList = [
    "changge1.json",
    "changge2.json",
    "changge3.json",
    "shuijiao1.json",
    "shuijiao2.json",
    "shuijiao3.json",
    "tiqiu.json",
    "zuoxiadiantou1.json",
    "zuoxiadiantou2.json",
    "zuoxiadiantou3.json",
  ];
  let animationList = [];
  for (let i = 0; i < animationNameList.length; i++) {
    console.log(`Processing ${animationNameList[i]}`);
    let animation = THREE.AnimationClip.parse(
      JSON.parse(
        await (
          await fetch(
            `https://raw.githubusercontent.com/XYY-huijiwiki/3d-assets/main/v1/${animationNameList[i]}`
          )
        ).text()
      )[0]
    );
    animationList.push(animation);
  }
  return animationList;
}

// Create a scene
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 10;

// Create a renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the GLB model
var loader = new GLTFLoader();
var mixer; // Declare mixer outside the load function
var clock = new THREE.Clock();
var animations = [];

loader.load(
  "https://raw.githubusercontent.com/XYY-huijiwiki/3d-assets/main/v1/xyyaction913_3.glb",
  async function (gltf) {
    scene.add(gltf.scene);
    gltf.animations.push(...(await loadAnimations()));
    gltf.animations.sort((a, b) => a.name.localeCompare(b.name));
    mixer = new THREE.AnimationMixer(gltf.scene);
    var action = mixer.clipAction(gltf.animations[10]);
    animations = gltf.animations;
    action.play();
    console.log(gltf.animations);
  }
);

// // Add light
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// scene.add(directionalLight);

// In your render loop
function animate() {
  requestAnimationFrame(animate);

  var deltaTime = clock.getDelta(); // clock is an instance of THREE.Clock
  if (mixer) mixer.update(deltaTime); // Update the mixer

  renderer.render(scene, camera);
}
animate();

// Download the glb model
async function downloadGLB() {
  let exporter = new GLTFExporter();
  let arrayBuffer = (await exporter.parseAsync(scene,{
    binary: true,
    animations: animations,
  })) as ArrayBuffer;
  let blob = new Blob([arrayBuffer], { type: "model/gltf-binary" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "model.glb";
  a.click();
}

window.downloadGLB = downloadGLB;
</script>

<style scoped></style>
