import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, Play, Sparkles, Layers, ZoomIn, ZoomOut } from 'lucide-react';

export default function Board3DViewer({
  boardId = 'esp32-devkit-v1',
  isSimulating = false,
  ledState = false,
  onPinSelect = null,
}) {
  const containerRef = useRef(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraView, setCameraView] = useState('iso'); // 'iso' | 'top'

  // References for Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const boardGroupRef = useRef(null);
  const ledMeshRef = useRef(null);
  const ledLightRef = useRef(null);
  const pinsGroupRef = useRef(null);

  // Interaction dragging state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.5, y: -0.6 });
  const zoomRef = useRef(1.0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x18213D);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 14, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x2A56A3, 0.8);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 5. Build 3D Board Model
    const boardGroup = new THREE.Group();
    boardGroupRef.current = boardGroup;
    scene.add(boardGroup);

    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    boardGroup.add(pinsGroup);

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d8df,
      metalness: 0.9,
      roughness: 0.2,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5b842,
      metalness: 0.85,
      roughness: 0.25,
    });

    const blackPlastic = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.5,
    });

    if (boardId.includes('esp32')) {
      // ─── ESP32 DevKit V1 3D MODEL ───
      // PCB Substrate (Black matte)
      const pcbGeo = new THREE.BoxGeometry(6.5, 0.25, 13);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x14161a,
        roughness: 0.6,
      });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.receiveShadow = true;
      boardGroup.add(pcb);

      // Gold Edge Traces & Pads
      const padGeo = new THREE.BoxGeometry(0.3, 0.05, 0.3);
      for (let i = 0; i < 15; i++) {
        const z = -5.0 + i * 0.72;
        // Left pin header
        const p1 = new THREE.Mesh(padGeo, goldMaterial);
        p1.position.set(-2.8, 0.15, z);
        p1.userData = { pinName: `GPIO / Pin L${i + 1}`, number: i + 1, side: 'Left' };
        pinsGroup.add(p1);

        // Header pin plastic block
        const pinPostGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const postLeft = new THREE.Mesh(pinPostGeo, metalMaterial);
        postLeft.position.set(-2.8, 0.5, z);
        boardGroup.add(postLeft);

        // Right pin header
        const p2 = new THREE.Mesh(padGeo, goldMaterial);
        p2.position.set(2.8, 0.15, z);
        p2.userData = { pinName: `GPIO / Pin R${i + 1}`, number: i + 16, side: 'Right' };
        pinsGroup.add(p2);

        const postRight = new THREE.Mesh(pinPostGeo, metalMaterial);
        postRight.position.set(2.8, 0.5, z);
        boardGroup.add(postRight);
      }

      // Metallic RF Shield Can (ESP-WROOM-32)
      const rfGeo = new THREE.BoxGeometry(4.2, 0.45, 5.0);
      const rfMesh = new THREE.Mesh(rfGeo, metalMaterial);
      rfMesh.position.set(0, 0.35, -2.5);
      rfMesh.castShadow = true;
      boardGroup.add(rfMesh);

      // Antenna Section (PCB area above metal can)
      const antGeo = new THREE.BoxGeometry(3.8, 0.1, 1.8);
      const antMat = new THREE.MeshStandardMaterial({ color: 0x6e5015, roughness: 0.8 });
      const antMesh = new THREE.Mesh(antGeo, antMat);
      antMesh.position.set(0, 0.18, -5.3);
      boardGroup.add(antMesh);

      // Micro-USB Port (Metallic)
      const usbGeo = new THREE.BoxGeometry(1.8, 0.6, 1.5);
      const usb = new THREE.Mesh(usbGeo, metalMaterial);
      usb.position.set(0, 0.4, 6.0);
      usb.castShadow = true;
      boardGroup.add(usb);

      // Buttons (EN & BOOT)
      const btnGeo = new THREE.BoxGeometry(0.6, 0.3, 0.6);
      const btn1 = new THREE.Mesh(btnGeo, blackPlastic);
      btn1.position.set(-1.8, 0.25, 4.8);
      boardGroup.add(btn1);

      const btn2 = new THREE.Mesh(btnGeo, blackPlastic);
      btn2.position.set(1.8, 0.25, 4.8);
      boardGroup.add(btn2);

      // Blue Status LED (GPIO 2)
      const ledGeo = new THREE.BoxGeometry(0.4, 0.2, 0.3);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        emissive: 0x000000,
        roughness: 0.3,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-1.0, 0.25, 3.2);
      boardGroup.add(led);
      ledMeshRef.current = led;

      const pLight = new THREE.PointLight(0x3b82f6, 0, 4);
      pLight.position.set(-1.0, 0.7, 3.2);
      boardGroup.add(pLight);
      ledLightRef.current = pLight;
    } else if (boardId.includes('uno')) {
      // ─── ARDUINO UNO R3 3D MODEL ───
      // Arduino Blue PCB
      const pcbGeo = new THREE.BoxGeometry(10.5, 0.3, 14.5);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x087e8b,
        roughness: 0.5,
      });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.receiveShadow = true;
      boardGroup.add(pcb);

      // Silver USB Type-B Port
      const usbGeo = new THREE.BoxGeometry(2.5, 2.0, 3.0);
      const usb = new THREE.Mesh(usbGeo, metalMaterial);
      usb.position.set(-3.5, 1.1, -5.5);
      usb.castShadow = true;
      boardGroup.add(usb);

      // Black DC Barrel Power Jack
      const dcGeo = new THREE.BoxGeometry(2.5, 2.0, 3.2);
      const dc = new THREE.Mesh(dcGeo, blackPlastic);
      dc.position.set(-3.5, 1.1, 5.0);
      dc.castShadow = true;
      boardGroup.add(dc);

      // ATmega328P Dual-in-line Package (DIP-28 IC)
      const dipGeo = new THREE.BoxGeometry(1.8, 0.5, 7.5);
      const dip = new THREE.Mesh(dipGeo, blackPlastic);
      dip.position.set(1.5, 0.4, 1.5);
      dip.castShadow = true;
      boardGroup.add(dip);

      // Silver Pins on DIP IC
      const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6);
      for (let i = 0; i < 14; i++) {
        const z = -1.8 + i * 0.48;
        const pl = new THREE.Mesh(pinGeo, metalMaterial);
        pl.position.set(0.5, 0.3, z);
        boardGroup.add(pl);

        const pr = new THREE.Mesh(pinGeo, metalMaterial);
        pr.position.set(2.5, 0.3, z);
        boardGroup.add(pr);
      }

      // Female Pin Header Strips
      const headerMat = blackPlastic;
      // Top header (Digital 8-13, GND, AREF)
      const h1Geo = new THREE.BoxGeometry(0.6, 1.2, 5.5);
      const h1 = new THREE.Mesh(h1Geo, headerMat);
      h1.position.set(4.6, 0.75, -3.5);
      boardGroup.add(h1);

      // Bottom Digital header (0-7)
      const h2Geo = new THREE.BoxGeometry(0.6, 1.2, 4.5);
      const h2 = new THREE.Mesh(h2Geo, headerMat);
      h2.position.set(4.6, 0.75, 2.5);
      boardGroup.add(h2);

      // Power Header
      const h3Geo = new THREE.BoxGeometry(0.6, 1.2, 4.5);
      const h3 = new THREE.Mesh(h3Geo, headerMat);
      h3.position.set(-4.6, 0.75, -1.0);
      boardGroup.add(h3);

      // Analog In Header (A0-A5)
      const h4Geo = new THREE.BoxGeometry(0.6, 1.2, 3.5);
      const h4 = new THREE.Mesh(h4Geo, headerMat);
      h4.position.set(-4.6, 0.75, 3.5);
      boardGroup.add(h4);

      // Built-in LED (Pin 13)
      const ledGeo = new THREE.BoxGeometry(0.3, 0.15, 0.3);
      const ledMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.3 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(2.8, 0.25, -2.5);
      boardGroup.add(led);
      ledMeshRef.current = led;

      const pLight = new THREE.PointLight(0xf59e0b, 0, 4);
      pLight.position.set(2.8, 0.6, -2.5);
      boardGroup.add(pLight);
      ledLightRef.current = pLight;
    } else {
      // ─── RASPBERRY PI PICO 3D MODEL ───
      // Pico Green PCB
      const pcbGeo = new THREE.BoxGeometry(5.2, 0.2, 12.5);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.5,
      });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.receiveShadow = true;
      boardGroup.add(pcb);

      // RP2040 Chip (Mounted diagonally at 45°)
      const chipGeo = new THREE.BoxGeometry(1.8, 0.25, 1.8);
      const chip = new THREE.Mesh(chipGeo, blackPlastic);
      chip.position.set(0, 0.22, 0.5);
      chip.rotation.y = Math.PI / 4;
      chip.castShadow = true;
      boardGroup.add(chip);

      // Micro-USB
      const usbGeo = new THREE.BoxGeometry(1.6, 0.5, 1.4);
      const usb = new THREE.Mesh(usbGeo, metalMaterial);
      usb.position.set(0, 0.35, -5.8);
      usb.castShadow = true;
      boardGroup.add(usb);

      // BOOTSEL Button
      const btnGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
      const btn = new THREE.Mesh(btnGeo, metalMaterial);
      btn.position.set(0, 0.22, -2.5);
      boardGroup.add(btn);

      // Castellated Solder Pads along edges
      const padGeo = new THREE.BoxGeometry(0.35, 0.08, 0.25);
      for (let i = 0; i < 20; i++) {
        const z = -5.0 + i * 0.52;
        const pl = new THREE.Mesh(padGeo, goldMaterial);
        pl.position.set(-2.5, 0.12, z);
        pinsGroup.add(pl);

        const pr = new THREE.Mesh(padGeo, goldMaterial);
        pr.position.set(2.5, 0.12, z);
        pinsGroup.add(pr);
      }

      // Green User LED
      const ledGeo = new THREE.BoxGeometry(0.3, 0.15, 0.3);
      const ledMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.3 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-1.0, 0.2, -4.5);
      boardGroup.add(led);
      ledMeshRef.current = led;

      const pLight = new THREE.PointLight(0x10b981, 0, 4);
      pLight.position.set(-1.0, 0.5, -4.5);
      boardGroup.add(pLight);
      ledLightRef.current = pLight;
    }

    // 6. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.005;
      }

      boardGroup.rotation.x = rotationRef.current.x;
      boardGroup.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
    };
    animate();

    // 7. Mouse & Touch Orbit Event Handlers
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      rotationRef.current.y += deltaX * 0.008;
      rotationRef.current.x += deltaY * 0.008;
      // Clamp vertical tilt
      rotationRef.current.x = Math.max(-1.2, Math.min(1.2, rotationRef.current.x));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      zoomRef.current += e.deltaY * 0.0015;
      zoomRef.current = Math.max(0.5, Math.min(2.5, zoomRef.current));
      camera.position.set(0, 14 * zoomRef.current, 20 * zoomRef.current);
      camera.lookAt(0, 0, 0);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [boardId]);

  // Handle LED Light Updates in 3D
  useEffect(() => {
    if (ledMeshRef.current && ledLightRef.current) {
      if (isSimulating && ledState) {
        ledMeshRef.current.material.emissive.setHex(
          boardId.includes('esp32') ? 0x3b82f6 : boardId.includes('uno') ? 0xf59e0b : 0x10b981
        );
        ledLightRef.current.intensity = 2.5;
      } else {
        ledMeshRef.current.material.emissive.setHex(0x000000);
        ledLightRef.current.intensity = 0;
      }
    }
  }, [isSimulating, ledState, boardId]);

  // Reset Camera View
  const resetCamera = () => {
    rotationRef.current = { x: 0.5, y: -0.6 };
    zoomRef.current = 1.0;
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 14, 20);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const setTopDown = () => {
    rotationRef.current = { x: Math.PI / 2, y: 0 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 22, 0.01);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[420px] rounded-[11px] overflow-hidden bg-[#18213D] border border-[#34436A] shadow-md select-none">
      {/* 3D Canvas mount point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Toolbar Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#283656]/90 backdrop-blur-sm p-1.5 rounded-[7px] border border-[#34436A] text-xs text-[#FAF4E9]">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-2 py-1 rounded-[5px] font-['Barlow_Semi_Condensed'] font-bold transition-colors ${
            autoRotate ? 'bg-[#2A56A3] text-white' : 'hover:bg-[#34436A] text-[#AAA59D]'
          }`}
        >
          {autoRotate ? 'Orbit: ON' : 'Orbit: OFF'}
        </button>

        <div className="h-4 w-px bg-[#34436A]" />

        <button
          onClick={resetCamera}
          className="p-1 rounded-[5px] hover:bg-[#34436A] text-[#AAA59D] hover:text-white"
          title="Reset 3D Angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={setTopDown}
          className="px-2 py-1 rounded-[5px] hover:bg-[#34436A] text-[#AAA59D] hover:text-white font-['Barlow_Semi_Condensed'] font-bold"
          title="Top-Down Pinout View"
        >
          Top View
        </button>
      </div>

      {/* Live 3D Simulation Status Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#283656]/90 backdrop-blur-sm px-3 py-1.5 rounded-[7px] border border-[#34436A] text-xs font-['JetBrains_Mono']">
        <span
          className={`w-2 h-2 rounded-full ${
            isSimulating ? (ledState ? 'bg-[#3b82f6] animate-ping' : 'bg-[#057A55]') : 'bg-[#AAA59D]'
          }`}
        />
        <span className="text-[#FAF4E9] text-[11px]">
          {isSimulating ? (ledState ? 'LED: ACTIVE (3.3V)' : 'SIMULATING') : '3D CAD Model'}
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-['Barlow'] text-[#AAA59D] pointer-events-none px-2">
        <span>🖱 Click & drag to rotate 3D board • Scroll to zoom</span>
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#F6EDDD]">
          Physics & Solder Shader Active
        </span>
      </div>
    </div>
  );
}

