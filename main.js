/*
    Sailesh Kumar Mishra - Interaction Layer v10.1
    3D Background + Clean Interactions
*/

document.addEventListener('DOMContentLoaded', () => {

    // ---- 3D PARTICLE BACKGROUND (Safe) ----
    try {
        const canvas = document.getElementById('bg3d');
        if (canvas && window.THREE) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Create floating particles
            const particleCount = 600;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3]     = (Math.random() - 0.5) * 40;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

                // Mix of indigo, purple, and pink
                const colorChoice = Math.random();
                if (colorChoice < 0.33) {
                    colors[i * 3] = 0.39; colors[i * 3 + 1] = 0.40; colors[i * 3 + 2] = 0.95; // Indigo
                } else if (colorChoice < 0.66) {
                    colors[i * 3] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.97; // Purple
                } else {
                    colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.28; colors[i * 3 + 2] = 0.60; // Pink
                }
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Add soft glowing orbs
            const orbGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const orbMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x6366f1, 
                transparent: true, 
                opacity: 0.08 
            });

            for (let i = 0; i < 5; i++) {
                const orb = new THREE.Mesh(orbGeometry, orbMaterial.clone());
                orb.position.set(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 10
                );
                orb.scale.setScalar(Math.random() * 3 + 1);
                scene.add(orb);
            }

            camera.position.z = 15;

            // Mouse interaction
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                particles.rotation.y += 0.0008;
                particles.rotation.x += 0.0003;

                // Subtle camera follow
                camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
                camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }
            animate();

            // Handle resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    } catch (e) {
        // 3D failed — page still works fine without it
        console.log('3D background skipped:', e.message);
    }

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- 3D TILT ON PROJECT CARDS ----
    document.querySelectorAll('.project-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
            card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- ACTIVE NAV HIGHLIGHT ----
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`nav a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = '#6366f1';
                } else {
                    link.style.color = '';
                }
            }
        });
    });
});
