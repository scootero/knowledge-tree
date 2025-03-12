// knowledge-tree/extension/tree.js

import * as THREE from 'three';
import treeData from './treeData.json';

let scene, camera, renderer;

function init() {
    // Set up the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark gray background

    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lights
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Build tree
    buildTree(treeData.trunk, new THREE.Vector3(0, -5, 0), null);

    // Start animation loop
    animate();
}

function buildTree(node, position, parent) {
    if (!node) return;

    // Create trunk/branches
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    if (parent) {
        points.push(parent.position);
    }
    points.push(position);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Position leaves
    if (node.leaves) {
        node.leaves.forEach((leaf, index) => {
            const leafPos = position.clone().add(new THREE.Vector3(index - node.leaves.length / 2, 1, 0));
            createLeaf(leaf, leafPos);
        });
    }

    // Recursively build branches
    if (node.branches) {
        node.branches.forEach((branch, index) => {
            const newPos = position.clone().add(new THREE.Vector3(index - node.branches.length / 2, 2, 0));
            buildTree(branch, newPos, { position });
        });
    }
}

function createLeaf(leaf, position) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    sphere.userData = { url: leaf.url, title: leaf.title };

    sphere.addEventListener('click', () => {
        window.open(leaf.url, '_blank');
    });
    scene.add(sphere);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.onload = init;
