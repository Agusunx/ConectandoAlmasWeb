document.addEventListener("DOMContentLoaded", () => {
    // 1. Efecto Scroll Reveal (Aparecer al bajar)
    const cards = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        cards.forEach((card) => {
            const elementTop = card.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                card.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    // Ejecutar una vez al inicio para ver las primeras
    revealOnScroll();

    // 2. Navbar cambia de color al bajar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 5, 20, 0.95)";
            navbar.style.padding = "10px 5%";
        } else {
            navbar.style.background = "rgba(10, 5, 20, 0.85)";
            navbar.style.padding = "15px 5%";
        }
    });
});
