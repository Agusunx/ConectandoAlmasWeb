// ==========================================
// 1. FUNCIONES GENERALES DE LA PÁGINA
// ==========================================

// Función para mostrar/ocultar la info de los servicios (Acordeón)
// Reemplaza tu función toggleInfo por esta:
function toggleInfo(id) {
    const infoDiv = document.getElementById(id);
    const button = infoDiv.previousElementSibling; // El botón
    const icon = button.querySelector('i');

    if (infoDiv.style.maxHeight) {
        infoDiv.style.maxHeight = null;
        infoDiv.style.padding = "0 0";
        icon.style.transform = "rotate(0deg)";
    } else {
        infoDiv.style.maxHeight = infoDiv.scrollHeight + "px";
        infoDiv.style.padding = "10px 0";
        icon.style.transform = "rotate(180deg)";
    }
}

// ==========================================
// 2. ANIMACIÓN DE CARGA INICIAL
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    console.log("Web de Conectando Almas lista.");
    const titulo = document.querySelector('.titulo-mistico');
    
    if(titulo) {
        titulo.style.opacity = '0';
        titulo.style.transform = 'translateY(20px)';
        titulo.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        
        setTimeout(() => {
            titulo.style.opacity = '1';
            titulo.style.transform = 'translateY(0)';
        }, 300);
    }
});

// ==========================================
// 3. CHATBOT INTELIGENTE (ASISTENTE DE VENTAS)
// ==========================================

// NOTA: En un proyecto profesional, esta KEY no debería estar aquí. 
// Deberías usar una variable de entorno o un backend pequeño.
const API_KEY = "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"; 

const INFO_DEL_NEGOCIO = `
ERES EL ASISTENTE VIRTUAL DE FLOR, LA CREADORA DE CONECTANDO ALMAS.
TUS DATOS OFICIALES:
1. FOTOMANCIA ($38.000 ARS): Devolución por AUDIOS de WhatsApp. No es en vivo.
2. SESIÓN DE MÉDIUM ($55.000 ARS): VIDEOLLAMADA en vivo (1 hora).
3. ANÁLISIS DE VÍNCULO: Devolución por AUDIOS de WhatsApp.
REGLAS: Sé breve, místico y cálido. Si quieren contratar, envíalos a Instagram: https://www.instagram.com/conectandoalmas_medium/
`;

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
    
    // 1. Mensaje del usuario
    chatBox.innerHTML += `
        <div style="text-align: right; margin: 8px 0;">
            <span style="background: #e1bee7; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block; font-size: 14px; color: #2c0e3a;">
                ${mensaje}
            </span>
        </div>`;
    
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Animación de carga
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" style="text-align: left; margin: 8px 0;">
            <span style="color: #6a0dad; font-style: italic; font-size: 12px;">✨ Flor está consultando la info...</span>
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
        });

        const data = await response.json();
        const respuestaIA = data.choices[0].message.content;

        // Limpiar cargador
        document.getElementById(loadingId)?.remove();
        
        // Formatear links
        const textoConLinks = respuestaIA.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #6a0dad; font-weight: bold;">Instagram ↗</a>');

        // 3. Mostrar respuesta de la IA
        chatBox.innerHTML += `
            <div style="text-align: left; margin: 8px 0;">
                <span style="background: #fbf7ff; padding: 10px 14px; border-radius: 15px 15px 15px 0; display: inline-block; color: #333; font-size: 14px; border: 1px solid #e1bee7; line-height: 1.4;">
                    ${textoConLinks}
                </span>
            </div>`;

    } catch (error) {
        document.getElementById(loadingId).innerText = "❌ No pude conectar con la energía. Intenta más tarde.";
        console.error("Error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escuchar la tecla Enter de forma global para el input
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'userInput') {
        enviarMensaje();
    }
});

