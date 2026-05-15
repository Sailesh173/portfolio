/* 
    Sailesh Kumar Mishra - Core Interactivity v8.0
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });
    }

    // Simple Hover Scaling
    const interactives = document.querySelectorAll('a, .project-card, .cert-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) gsap.to(cursor, { scale: 4, backgroundColor: 'rgba(255, 26, 26, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) gsap.to(cursor, { scale: 1, backgroundColor: '#ff1a1a', duration: 0.3 });
        });
    });

    // Smooth Scroll Reveal (Minimalist)
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            });
        });
    }
});
