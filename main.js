/* 
    Sailesh Kumar - Red Velvet Interactivity
    Advanced 3D Cloth/Wave Shader Simulation
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // --- Red Velvet 3D Background (Three.js) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('red-velvet-canvas'),
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a Plane Geometry for the "Velvet"
    const geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x8b0000,
        side: THREE.DoubleSide,
        wireframe: false,
        shininess: 100,
        flatShading: false
    });
    const velvet = new THREE.Mesh(geometry, material);
    velvet.rotation.x = -Math.PI / 3;
    scene.add(velvet);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff3131, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x2a0000, 5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 8;

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Wave displacement for the "Velvet" effect
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + time) * 0.5 + Math.cos(y * 0.5 + time) * 0.5;
        }
        geometry.attributes.position.needsUpdate = true;
        
        velvet.rotation.z = time * 0.05;
        renderer.render(scene, camera);
    }
    animate();

    // --- Cursor Interactivity ---
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });

        // Move point light slightly with mouse
        const mouseX = (e.clientX / window.innerWidth) * 10 - 5;
        const mouseY = -(e.clientY / window.innerHeight) * 10 + 5;
        pointLight.position.set(mouseX, mouseY, 5);
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Hover Effects ---
    const interactives = document.querySelectorAll('a, .project-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, backgroundColor: 'rgba(255, 49, 49, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#ff3131', duration: 0.3 });
        });
    });
});
