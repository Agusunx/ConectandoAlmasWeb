// Función para mostrar/ocultar la info educativa
function toggleInfo(id) {
    var infoDiv = document.getElementById(id);
    
    if (infoDiv.style.display === "block") {
        infoDiv.style.display = "none";
    } else {
        infoDiv.style.display = "block";
    }
}

// Animación de carga inicial
window.addEventListener('load', () => {
    console.log("Web de Conectando Almas lista.");
    const titulo = document.querySelector('h1');
    titulo.style.opacity = '0';
    titulo.style.transform = 'translateY(20px)';
    titulo.style.transition = 'opacity 1s ease, transform 1s ease';
    
    setTimeout(() => {
        titulo.style.opacity = '1';
        titulo.style.transform = 'translateY(0)';
    }, 300);
});