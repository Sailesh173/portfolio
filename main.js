/* 
    Sailesh Kumar Mishra - Interactive Logic
    Powered by GSAP & Three.js
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Check if device is touch-enabled
    const isTouchDevice = () => {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    };

    if (!isTouchDevice()) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
        });

        // Add hover effects and magnetic attraction to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn, .timeline-item, .contact-link, .mini-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', (e) => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
                
                // Reset magnetic element
                if (el.classList.contains('btn') || el.classList.contains('mini-card') || el.classList.contains('social-link')) {
                    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
                }
            });
            
            // Magnetic attraction effect
            if (el.classList.contains('btn') || el.classList.contains('mini-card') || el.classList.contains('social-link')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const currentX = gsap.getProperty(el, "x") || 0;
                    const currentY = gsap.getProperty(el, "y") || 0;
                    const centerX = rect.left - currentX + rect.width / 2;
                    const centerY = rect.top - currentY + rect.height / 2;
                    const x = e.clientX - centerX;
                    const y = e.clientY - centerY;
                    
                    gsap.to(el, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            }
        });

        // --- 3D Tilt Effect for Project Cards ---
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                // Reset terminal lines so they re-animate next time
                const lines = card.querySelectorAll('.terminal-line');
                lines.forEach(line => {
                    line.style.animation = 'none';
                    void line.offsetWidth; 
                    line.style.animation = null;
                });
            });
        });
    } else {
        // Hide cursor on touch devices
        cursor.style.display = 'none';
        follower.style.display = 'none';
    }

    // --- Navigation & Mobile Menu ---
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // --- Three.js Background (Hero Section) ---
    const initHeroBackground = () => {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = window.innerWidth > 768 ? 400 : 150;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80; // Spread
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00f2fe,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Mouse interaction for particle attraction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        // Raycaster for advanced particle attraction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        document.addEventListener('mousemove', (event) => {
            // Normalized device coordinates for raycaster
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Raw coordinates for rotation
            mouseX = (event.clientX - window.innerWidth / 2);
            mouseY = (event.clientY - window.innerHeight / 2);
        });

        const clock = new THREE.Clock();

        // Store original positions for spring physics return
        const originalPositions = new Float32Array(posArray.length);
        for(let i=0; i<posArray.length; i++) {
            originalPositions[i] = posArray[i];
        }

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Parallax rotation
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            particlesMesh.rotation.y += 0.001 + (targetX - particlesMesh.rotation.y) * 0.05;
            particlesMesh.rotation.x += 0.0005 + (targetY - particlesMesh.rotation.x) * 0.05;
            
            // Slow wave effect
            particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;
            
            // Advanced Particle Attraction (Swarm effect)
            raycaster.setFromCamera(mouse, camera);
            
            // Create a plane at z=0 to intersect with mouse ray
            const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const targetPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeZ, targetPoint);
            
            const positions = particlesGeometry.attributes.position.array;
            
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                
                // Current position of particle
                const px = positions[i3];
                const py = positions[i3 + 1];
                const pz = positions[i3 + 2];
                
                // Original position
                const ox = originalPositions[i3];
                const oy = originalPositions[i3 + 1];
                const oz = originalPositions[i3 + 2];
                
                // Distance to mouse (targetPoint)
                const dx = targetPoint.x - px;
                const dy = targetPoint.y - py;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                // If mouse is close, attract the particle
                if (distance < 15) {
                    const force = (15 - distance) / 15; // 0 to 1
                    positions[i3] += dx * force * 0.05;
                    positions[i3 + 1] += dy * force * 0.05;
                } else {
                    // Spring back to original position
                    positions[i3] += (ox - px) * 0.02;
                    positions[i3 + 1] += (oy - py) * 0.02;
                }
            }
            
            particlesGeometry.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initHeroBackground();

    // --- Neural Core (Interactive 3D Geometry in middle of page) ---
    const initNeuralCore = () => {
        const canvas = document.getElementById('core-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        // Use section dimensions
        const section = document.getElementById('neural-core');
        renderer.setSize(section.clientWidth, section.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, section.clientWidth / section.clientHeight, 0.1, 1000);
        camera.position.z = 12;

        // Complex geometry
        const geometry = new THREE.IcosahedronGeometry(4, 2);
        
        // Wireframe material
        const material = new THREE.MeshPhongMaterial({
            color: 0x00f2fe,
            emissive: 0x005bea,
            emissiveIntensity: 0.4,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });

        const core = new THREE.Mesh(geometry, material);
        scene.add(core);

        // Add inner core
        const innerGeometry = new THREE.IcosahedronGeometry(2.5, 1);
        const innerMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0844,
            emissive: 0xff0844,
            emissiveIntensity: 0.6,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        core.add(innerCore);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 50);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff0844, 2, 50);
        pointLight2.position.set(-10, -10, 10);
        scene.add(pointLight2);

        // Interaction
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let autoRotateSpeed = 0.005;

        canvas.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                core.rotation.y += deltaX * 0.01;
                core.rotation.x += deltaY * 0.01;
            }
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        // Touch support for mobile
        canvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
        canvas.addEventListener('touchend', () => isDragging = false);
        canvas.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault(); // prevent scrolling while interacting
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.y;
                core.rotation.y += deltaX * 0.01;
                core.rotation.x += deltaY * 0.01;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: false });

        const animate = () => {
            requestAnimationFrame(animate);
            if (!isDragging) {
                core.rotation.y += autoRotateSpeed;
                core.rotation.z += autoRotateSpeed * 0.5;
                innerCore.rotation.x -= autoRotateSpeed * 1.5;
                innerCore.rotation.y -= autoRotateSpeed;
            }
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = section.clientWidth / section.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(section.clientWidth, section.clientHeight);
        });
    };

    initNeuralCore();

    // --- Loading Sequence & Initial Animations ---
    const loaderTl = gsap.timeline();
    
    loaderTl.to('.loader-logo', { opacity: 1, duration: 0.8, y: 0 })
            .to('.loader-progress', { width: '100%', duration: 1.5, ease: "power2.inOut" })
            .to('#loader', { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.2 })
            .call(() => {
                // Remove loader from DOM
                const loader = document.getElementById('loader');
                if(loader) loader.style.display = 'none';

                // Trigger Hero Animations
                const heroTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
                heroTl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 })
                      .to('#hero-title', { opacity: 1, y: 0 }, "-=0.6")
                      .to('.hero-description', { opacity: 1, y: 0 }, "-=0.8")
                      .to('.hero-btns', { opacity: 1, y: 0 }, "-=0.8")
                      .to('.hero-stats', { opacity: 1, y: 0, duration: 1 }, "-=0.5");
            });

    // --- Scroll Animations (GSAP ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);

    // Fade up elements
    const fadeUpElements = gsap.utils.toArray('.about-text, .mini-card, .skill-category, .project-card, .contact-info, .contact-form, .stat-box, .section-subtitle');
    fadeUpElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }
        );
    });

    // Timeline dots animation
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item, i) => {
        const dot = item.querySelector('.timeline-dot');
        const content = item.querySelector('.timeline-content');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" })
          .fromTo(content, { opacity: 0, x: i % 2 === 0 ? 50 : -50 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "-=0.2");
    });

    // --- Text Scramble Effect ---
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    gsap.utils.toArray('.scramble-text').forEach(el => {
        const scrambler = new TextScrambler(el);
        const originalText = el.innerText;
        
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => scrambler.setText(originalText)
        });
    });

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeBtn.innerHTML = isLight ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
            lucide.createIcons();
        });
    }

    // --- Project Overlay Data & Logic ---
    const projectData = {
        'medlink': {
            title: 'MedLink AI — Healthcare Platform',
            tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'WebRTC', 'Groq Llama 3'],
            desc: `A comprehensive AI-powered healthcare application bridging the gap between patients and medical professionals. 
            
            Features include:
            • <strong>AI Symptom Checker:</strong> Integrated with Groq LLM API for rapid, intelligent preliminary assessments.
            • <strong>Telemedicine:</strong> Real-time video consultations built from scratch using WebRTC and Socket.io.
            • <strong>Patient Management:</strong> Secure authentication, medical record keeping, and medication tracking.
            • <strong>Emergency Routing:</strong> Location-based services to find nearby hospitals.`,
            link: 'https://github.com/saileshmishra'
        },
        'traffic': {
            title: 'Smart Traffic Management System',
            tech: ['YOLO', 'TensorFlow.js', 'Python', 'AWS ECS', 'Docker', 'React'],
            desc: `An intelligent urban traffic control system utilizing machine learning for real-time analysis.
            
            Features include:
            • <strong>Computer Vision:</strong> Processes live CCTV feeds using YOLO to count and classify vehicles.
            • <strong>Emergency Priority:</strong> Automatically detects ambulances/fire trucks and triggers signal overrides.
            • <strong>Cloud Dashboard:</strong> Centralized real-time monitoring built with React and hosted on AWS.
            • <strong>Predictive Modeling:</strong> Analyzes historical data to optimize signal timing based on day/time variances.`,
            link: 'https://github.com/saileshmishra'
        },
        'healthtrack': {
            title: 'HealthTrack — AI Fitness Dashboard',
            tech: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Prisma', 'OpenAI API'],
            desc: `A holistic health tracking application combining nutrition science with artificial intelligence.
            
            Features include:
            • <strong>AI Meal Planning:</strong> Leverages OpenAI's API to generate personalized weekly diet plans based on user macros and preferences.
            • <strong>ML Calorie Prediction:</strong> Custom TensorFlow.js model to predict caloric burn based on activity types and user metrics.
            • <strong>Analytics UI:</strong> Beautiful, interactive charts built with Chart.js and Tailwind CSS.
            • <strong>Robust Backend:</strong> Secure FastAPI backend with PostgreSQL database managed via Prisma ORM.`,
            link: 'https://github.com/saileshmishra'
        },
        'ecommerce': {
            title: 'E-Commerce Platform for Local Artisans',
            tech: ['React', 'Redux', 'Node.js', 'MongoDB', 'Redis', 'Tailwind CSS'],
            desc: `A full-stack, responsive marketplace designed to empower local creators to sell directly to consumers.
            
            Features include:
            • <strong>High Performance:</strong> Implemented Redis caching for product queries, significantly reducing database load and response times.
            • <strong>State Management:</strong> Complex frontend state handled efficiently via Redux toolkit.
            • <strong>Security:</strong> JWT-based authentication with strict role-based access control (Admin vs User).
            • <strong>Modern UI:</strong> Fully responsive design with micro-animations using Tailwind CSS.`,
            link: 'https://github.com/saileshmishra'
        }
    };

    const overlay = document.getElementById('project-overlay');
    const overlayBlur = document.getElementById('overlay-blur');
    const closeOverlayBtn = document.getElementById('close-overlay');
    const overlayBody = document.getElementById('project-details-body');

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const data = projectData[projectId];
            
            if (data) {
                overlayBody.innerHTML = `
                    <h2 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2;">${data.title}</h2>
                    <div style="display:flex; flex-wrap:wrap; gap:0.8rem; margin-bottom: 2rem;">
                        ${data.tech.map(t => `<span style="padding: 0.4rem 1.2rem; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 50px; font-size: 0.85rem; color: var(--primary);">${t}</span>`).join('')}
                    </div>
                    <div style="font-size: 1.1rem; line-height: 1.8; color: var(--text-main); margin-bottom: 2.5rem; white-space: pre-line;">
                        ${data.desc}
                    </div>
                    <a href="${data.link}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="github"></i> View Source Code
                    </a>
                `;
                lucide.createIcons();
                
                gsap.to([overlay, overlayBlur], { opacity: 1, visibility: 'visible', duration: 0.4 });
                gsap.fromTo(overlay, { y: 50, scale: 0.95 }, { y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    const closeProjectOverlay = () => {
        gsap.to([overlay, overlayBlur], { opacity: 0, duration: 0.3, onComplete: () => {
            overlay.style.visibility = 'hidden';
            overlayBlur.style.visibility = 'hidden';
        }});
        gsap.to(overlay, { y: 20, scale: 0.98, duration: 0.3 });
        document.body.style.overflow = 'auto';
    };

    if (closeOverlayBtn) closeOverlayBtn.addEventListener('click', closeProjectOverlay);
    if (overlayBlur) overlayBlur.addEventListener('click', closeProjectOverlay);

    // --- AI Assistant Logic ---
    const aiBubble = document.querySelector('.ai-bubble');
    const aiPopup = document.querySelector('.ai-popup');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');

    if (aiBubble && aiPopup) {
        aiBubble.addEventListener('click', () => {
            aiPopup.classList.toggle('active');
            if (aiPopup.classList.contains('active')) {
                aiInput.focus();
            }
        });
    }

    const addAIMessage = (text, isUser = false) => {
        const msg = document.createElement('p');
        msg.style.borderLeftColor = isUser ? 'var(--text-dim)' : 'var(--primary)';
        msg.innerHTML = isUser ? `<strong style="color:var(--text-main);">You:</strong> ${text}` : `<strong style="color:var(--primary);">AI:</strong> ${text}`;
        aiMessages.appendChild(msg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    const handleAIChat = () => {
        const query = aiInput.value.trim().toLowerCase();
        if (!query) return;

        addAIMessage(aiInput.value, true);
        aiInput.value = '';

        // Simple mock responses
        setTimeout(() => {
            let response = "I'm analyzing your request... Sailesh is a Full-Stack Developer specializing in MERN and AI. How can I help you specifically?";
            
            if (query.includes('skill') || query.includes('tech') || query.includes('stack')) {
                response = "Sailesh's core stack includes React.js, Node.js, Express, MongoDB, and Python. He's also certified in SAP ABAP Cloud and integrates AI via TensorFlow and APIs.";
            } else if (query.includes('project') || query.includes('work') || query.includes('medlink')) {
                response = "His flagship project is MedLink AI, a healthcare platform with real-time WebRTC consultations and Groq LLM symptom checking. You can see it in the 'Work' section.";
            } else if (query.includes('contact') || query.includes('hire') || query.includes('email')) {
                response = "You can reach Sailesh at saileshmishra2760@gmail.com or call him at +91 8144255945. Check the Connect section at the bottom!";
            } else if (query.includes('education') || query.includes('study')) {
                response = "He is currently pursuing a B.Tech in Computer Science at Silicon Institute of Technology, Sambalpur (2022-Present).";
            }
            
            addAIMessage(response);
        }, 800);
    };

    if (aiSend) {
        aiSend.addEventListener('click', handleAIChat);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAIChat();
        });
    }

    // --- Audio Toggle System ---
    let audioCtx = null;
    let ambientActive = false;
    let droneOsc = null;
    let droneGain = null;
    const audioToggle = document.getElementById('audio-toggle');

    const initAudio = () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
    };

    const startAmbient = () => {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        if (!ambientActive) {
            droneOsc = audioCtx.createOscillator();
            droneGain = audioCtx.createGain();
            
            // Deep ambient drone
            droneOsc.type = 'sine';
            droneOsc.frequency.setValueAtTime(45, audioCtx.currentTime); // Deep bass
            
            droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
            droneGain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 3); // Slow fade in
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, audioCtx.currentTime);
            
            droneOsc.connect(filter);
            filter.connect(droneGain);
            droneGain.connect(audioCtx.destination);
            
            droneOsc.start();
            ambientActive = true;
        }
    };

    const stopAmbient = () => {
        if (ambientActive && droneOsc && droneGain) {
            droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); // Fade out
            setTimeout(() => {
                droneOsc.stop();
                ambientActive = false;
            }, 1000);
        }
    };

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (!ambientActive) {
                startAmbient();
                audioToggle.innerHTML = '<i data-lucide="volume-2"></i>';
                audioToggle.style.color = 'var(--primary)';
            } else {
                stopAmbient();
                audioToggle.innerHTML = '<i data-lucide="volume-x"></i>';
                audioToggle.style.color = 'var(--text-dim)';
            }
            lucide.createIcons();
        });
    }

    // Play subtle UI sound on click
    const playClickSound = () => {
        if (ambientActive && audioCtx) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        }
    };

    document.querySelectorAll('a, button, .project-card').forEach(el => {
        el.addEventListener('click', playClickSound);
    });

});
