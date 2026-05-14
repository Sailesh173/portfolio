/* 
    Sailesh Kumar - Luxury Horizontal Experience
    Powered by GSAP & ScrollTo
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { 
            x: e.clientX, 
            y: e.clientY, 
            duration: 0.1 
        });
    });

    // --- Horizontal Scroll Logic ---
    const wrapper = document.querySelector('.horizontal-wrapper');
    const sections = gsap.utils.toArray('section');
    let currentIndex = 0;
    let isAnimating = false;

    const goToSection = (index) => {
        if (index < 0 || index >= sections.length || isAnimating) return;
        
        isAnimating = true;
        currentIndex = index;
        
        // Update Nav Links
        document.querySelectorAll('.nav-links a').forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });

        gsap.to(wrapper, {
            x: -index * 100 + 'vw',
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                isAnimating = false;
            }
        });
    };

    // Wheel Scroll Handling
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        
        if (e.deltaY > 50) {
            goToSection(currentIndex + 1);
        } else if (e.deltaY < -50) {
            goToSection(currentIndex - 1);
        }
    });

    // Nav Click Handling
    document.querySelectorAll('.nav-links a').forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSection(i);
        });
    });

    // --- Project Parallax ---
    const portals = document.querySelectorAll('.project-portal');
    portals.forEach(portal => {
        portal.addEventListener('mousemove', (e) => {
            const rect = portal.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            gsap.to(portal.querySelector('.portal-visual'), {
                x: moveX,
                y: moveY,
                duration: 0.4
            });
            
            gsap.to(portal.querySelector('.portal-content'), {
                x: -moveX / 2,
                y: -moveY / 2,
                duration: 0.4
            });
        });

        portal.addEventListener('mouseleave', () => {
            gsap.to(portal.querySelector('.portal-visual'), { x: 0, y: 0, duration: 0.8 });
            gsap.to(portal.querySelector('.portal-content'), { x: 0, y: 0, duration: 0.8 });
        });
    });

    // --- Cursor Interactions ---
    const interactives = document.querySelectorAll('a, .project-portal');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#d4af37', duration: 0.3 });
        });
    });
});
