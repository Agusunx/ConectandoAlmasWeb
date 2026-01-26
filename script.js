// ==========================================
// 1. FUNCIONES DE LA INTERFAZ (ACORDEÓN)
// ==========================================

/**
 * Controla la apertura y cierre de la información de los servicios.
 * Usa maxHeight para permitir una animación fluida con CSS.
 */
function toggleInfo(id) {
    const infoDiv = document.getElementById(id);
    const btn = infoDiv.previousElementSibling; // El botón "Saber más"
    const icon = btn.querySelector('i');

    // Si ya está abierto, lo cerramos
    if (infoDiv.style.maxHeight && infoDiv.style.maxHeight !== "0px") {
        infoDiv.style.maxHeight = "0px";
        infoDiv.style.padding = "0";
        icon.style.transform = "rotate(0deg)";
    } else {
        // Primero cerramos cualquier otro acordeón que esté abierto
        document.querySelectorAll('.info-oculta').forEach(el => {
            el.style.maxHeight = "0px";
            el.style.padding = "0";
            // Reseteamos los iconos de los otros botones
            const otherIcon = el.previousElementSibling.querySelector('i');
            if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        });

        // Abrimos el seleccionado calculando su altura real
        infoDiv.style.maxHeight = infoDiv.scrollHeight + "px";
        infoDiv.style.padding = "15px 0";
        icon.style.transform = "rotate(180deg)";
    }
}

// ==========================================
// 2. CHATBOT ASISTENTE (API GROQ)
// ==========================================

const API_KEY = "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"; //

const INFO_DEL_NEGOCIO = `
ERES EL ASISTENTE VIRTUAL DE FLOR, LA CREADORA DE CONECTANDO ALMAS.
TUS DATOS OFICIALES:
1. FOTOMANCIA ($38.000 ARS): Devolución por AUDIOS de WhatsApp. No es en vivo.
2. SESIÓN DE MÉDIUM ($55.000 ARS): VIDEOLLAMADA en vivo (1 hora).
3. ANÁLISIS DE VÍNCULO: Devolución por AUDIOS de WhatsApp.
REGLAS: Sé breve, místico y cálido. Si quieren contratar, envíalos a Instagram: https://www.instagram.com/conectandoalmas_medium/
`; //

function toggleChat() {
    const container = document.getElementById('chat-container');
    if (!container) return;
    const isHidden = container.style.display === 'none' || container.style.display === '';
    container.style.display = isHidden ? 'flex' : 'none';
}

async function enviarMensaje() {
    const input = document.getElementById('userInput');
    const chatBox = document.getElementById('chat-box');
    
    if (!input || !chatBox || !input.value.trim()) return;

    const mensaje = input.value.trim();
    
    // Mensaje del usuario en pantalla
    chatBox.innerHTML += `
        <div style="text-align: right; margin: 8px 0;">
            <span style="background: #e1bee7; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block; font-size: 14px; color: #2c0e3a;">
                ${mensaje}
            </span>
        </div>`;
    
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Animación de carga
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" style="text-align: left; margin: 8px 0;">
            <span style="color: #6a0dad; font-style: italic; font-size: 12px;">✨ Consultando con el universo...</span>
        </div>`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: INFO_DEL_NEGOCIO },
                    { role: "user", content: mensaje }
                ],
                temperature: 0.5
            })
        }); //

        const data = await response.json();
        const respuestaIA = data.choices[0].message.content;

        document.getElementById(loadingId)?.remove();
        
        // Formatear links de Instagram para que sean clickeables
        const textoConLinks = respuestaIA.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #6a0dad; font-weight: bold;">Instagram ↗</a>');

        chatBox.innerHTML += `
            <div style="text-align: left; margin: 8px 0;">
                <span style="background: #fbf7ff; padding: 10px 14px; border-radius: 15px 15px 15px 0; display: inline-block; color: #333; font-size: 14px; border: 1px solid #e1bee7; line-height: 1.4;">
                    ${textoConLinks}
                </span>
            </div>`;

    } catch (error) {
        if (document.getElementById(loadingId)) {
            document.getElementById(loadingId).innerText = "❌ No pude conectar con la energía. Intenta más tarde.";
        }
        console.error("Error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escuchar tecla Enter en el input del chat
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'userInput') {
        enviarMensaje();
    }
});

// Mensaje de bienvenida en consola al cargar
window.addEventListener('DOMContentLoaded', () => {
    console.log("Conectando Almas: Web lista y sistema místico activo.");
});
