/* 
    Sailesh Kumar - Core Interactivity
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

    // Hover Scaling for Cursor
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(212, 175, 55, 0.2)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#d4af37', duration: 0.3 });
        });
    });

    // Reveal Animations on Scroll
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.querySelectorAll('.gradient-text, p, .glass-card, .project-card'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    });
});
