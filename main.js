/* 
    Sailesh Kumar - Cyber Architect Core
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Sidebar Navigation Highlighting
    const contentPanel = document.querySelector('.content-panel');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.side-nav a');

    contentPanel.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (contentPanel.scrollTop >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Hover Scaling for Cursor
    const interactives = document.querySelectorAll('a, .bento-card, .skill-tag');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 4, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });

    // Bento Card Entrance
    gsap.from('.bento-card', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
    });
});
