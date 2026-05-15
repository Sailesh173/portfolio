/* 
    Sailesh Kumar Mishra - ADVANCED 3D ENGINE v10.2
    Cinematic Vortex + 3D Core
*/

document.addEventListener('DOMContentLoaded', () => {

    // ---- ADVANCED 3D VORTEX ENGINE ----
    try {
        const canvas = document.getElementById('bg3d');
        if (canvas && window.THREE) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // --- 3000 PARTICLE VORTEX ---
            const particleCount = 3000;
            const geometry = new THREE.BufferGeometry();
            const pos = new Float32Array(particleCount * 3);
            const col = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                // Sphere distribution with vortex twist
                const radius = Math.random() * 25 + 5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                pos[i * 3 + 2] = radius * Math.cos(phi);

                // Deep Indigo to Electric Purple
                col[i * 3] = 0.38 + Math.random() * 0.2; // R
                col[i * 3 + 1] = 0.40 + Math.random() * 0.1; // G
                col[i * 3 + 2] = 0.95; // B
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));

            const material = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });

            const starfield = new THREE.Points(geometry, material);
            scene.add(starfield);

            // --- 3D WIREFRAME CORE (The "Architect" Object) ---
            const coreGeom = new THREE.TorusKnotGeometry(4, 1.2, 120, 16);
            const coreMat = new THREE.MeshBasicMaterial({ 
                color: 0x6366f1, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.1 
            });
            const core = new THREE.Mesh(coreGeom, coreMat);
            scene.add(core);

            camera.position.z = 18;

            // Mouse Interaction Logic
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2);
                mouseY = (e.clientY - window.innerHeight / 2);
            });

            // --- ANIMATION ENGINE ---
            function animate() {
                requestAnimationFrame(animate);
                
                const time = Date.now() * 0.0005;

                // Rotate Vortex
                starfield.rotation.y += 0.001;
                starfield.rotation.z += 0.0005;

                // Rotate Core
                core.rotation.x = time * 0.2;
                core.rotation.y = time * 0.3;

                // Cinematic Smooth Follow
                targetX = mouseX * 0.01;
                targetY = mouseY * 0.01;

                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (-targetY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }
            animate();

            // Handle Resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    } catch (err) {
        console.warn("3D Engine Fail-Safe Triggered:", err);
    }

    // --- STANDARD INTERACTIONS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.project-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    // Nav Highlight Logic
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            if (window.pageYOffset >= (section.offsetTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}` ? '#6366f1' : '';
        });
    });

     // ---- INTERACTIVE CARD GLOWS ----
    document.querySelectorAll('.glass-card, .contact-method').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Hover Scaling
    const interactives = document.querySelectorAll('a, .glass-card, .project-item');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, backgroundColor: 'rgba(0, 242, 254, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#00f2fe', duration: 0.3 });
        });
    });
});
