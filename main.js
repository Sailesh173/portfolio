/* 
    Sailesh Kumar - Digital Architect v5.0
    GSAP + Three.js Interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // --- Three.js Background (Stars/Particles) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 1000;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.8, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.001;
        stars.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- GSAP Scroll Interactions ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax
    gsap.to('.hero-glow', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        opacity: 0
    });

    // Project Grid Reveal
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.project-grid',
            start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
    });

    // Nav Link Active State
    const sections = ['hero', 'about', 'projects', 'contact'];
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: `#${section}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => updateNav(section),
            onEnterBack: () => updateNav(section)
        });
    });

    function updateNav(id) {
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    }

    // Hover Effects
    const interactives = document.querySelectorAll('a, .project-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#d4af37', duration: 0.3 });
        });
    });
});
