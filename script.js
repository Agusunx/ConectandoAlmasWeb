// ==========================================
// 1. FUNCIONES GENERALES DE LA PÁGINA
// ==========================================

// Función para mostrar/ocultar la info educativa (Acordeón)
function toggleInfo(id) {
    var infoDiv = document.getElementById(id);
    if (infoDiv.style.display === "block") {
        infoDiv.style.display = "none";
    } else {
        infoDiv.style.display = "block";
    }
}

// ==========================================
// 2. ANIMACIÓN DE CARGA INICIAL
// ==========================================
window.addEventListener('load', () => {
    console.log("Web de Conectando Almas lista.");
    const titulo = document.querySelector('h1');
    
    // Solo ejecutamos si existe el título para no dar error
    if(titulo) {
        titulo.style.opacity = '0';
        titulo.style.transform = 'translateY(20px)';
        titulo.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            titulo.style.opacity = '1';
            titulo.style.transform = 'translateY(0)';
        }, 300);
    }
});

// ==========================================
// 3. CHATBOT INTELIGENTE (ASISTENTE DE VENTAS)
// ==========================================

const API_KEY = "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"; 

// INFORMACIÓN OFICIAL DEL NEGOCIO
const INFO_DEL_NEGOCIO = `
ERES EL ASISTENTE VIRTUAL DE FLOR, LA CREADORA DE CONECTANDO ALMAS.

TUS DATOS OFICIALES Y SERVICIOS:

1. FOTOMANCIA ($38.000 ARS):
   - ¿Qué es?: Es una lectura profunda de la energía de una persona a través de su fotografía. Se ven bloqueos, estado emocional y tendencias futuras.
   - ¿Cómo se hace?: Se realiza a distancia. Flor te envía la devolución completa mediante **AUDIOS de WhatsApp** y fotos explicativas. No hace falta estar conectado en vivo.

2. SESIÓN DE MÉDIUM ($55.000 ARS):
   - ¿Qué es?: Es un encuentro sagrado para intentar conectar y recibir mensajes de seres queridos que han fallecido.
   - ¿Cómo se hace?: Se realiza únicamente por **VIDEOLLAMADA** (en vivo con Flor). Requiere agendar turno previo.

3. ANÁLISIS DE VÍNCULO (Parejas/Relaciones):
   - ¿Qué es?: Se analiza la compatibilidad energética, los contratos de almas y el karma entre dos personas (pareja, ex, familiar).
   - ¿Cómo se hace?: Se realiza a distancia y la devolución se entrega mediante **AUDIOS de WhatsApp**.

CONTACTO Y RESERVAS:
- Instagram: https://www.instagram.com/conectandoalmas_medium/
- WhatsApp: (Menciona que pidan el link de WhatsApp al Instagram si no lo tienen).

REGLAS DE COMPORTAMIENTO:
1. Sé breve, cálido y místico.
2. Explica siempre la modalidad (si es audio o videollamada) para que el cliente sepa qué esperar.
3. PARA CONTRATAR: Diles "Para agendar tu sesión o enviar tu foto, escríbele directamente a Flor por Instagram aquí: https://www.instagram.com/conectandoalmas_medium/".
4. Si preguntan cosas fuera del tema (política, matemática, recetas), responde resumido amablemente que solo hablas de los servicios de Conectando Almas.
`;

// Función para abrir/cerrar el chat
function toggleChat() {
    const container = document.getElementById('chat-container');
    
    // Verificación robusta para evitar errores
    if (!container) {
        console.error("No se encontró el elemento 'chat-container'. Revisa tu HTML.");
        return;
    }

    if (!container.style.display || container.style.display === 'none') {
        container.style.display = 'flex';
    } else {
        container.style.display = 'none';
    }
}

// Función principal para enviar mensaje a la IA
async function enviarMensaje() {
    const input = document.getElementById('userInput');
    const chatBox = document.getElementById('chat-box');
    
    if (!input || !chatBox) return; // Protección por si no cargó el HTML

    const mensaje = input.value;
    if (!mensaje) return;

    // 1. Mostrar mensaje del usuario
    chatBox.innerHTML += `<div style="text-align: right; margin: 5px 0;"><span style="background: #e1ffc7; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block; font-size: 14px;">${mensaje}</span></div>`;
    input.value = '';

    // 2. Mostrar animación "Consultando..."
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `<div id="${loadingId}" style="text-align: left; margin: 5px 0;"><span style="color: #6a0dad; font-style: italic; font-size: 12px;">✨ Flor está consultando la info...</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

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
                    {
                        role: "system",
                        content: INFO_DEL_NEGOCIO
                    },
                    {
                        role: "user",
                        content: mensaje
                    }
                ],
                temperature: 0.4
            })
        });

        const data = await response.json();
        const respuestaIA = data.choices[0].message.content;

        // 3. Mostrar respuesta
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        // Convertimos enlaces a clicables
        const respuestaFormateada = respuestaIA.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #6a0dad; font-weight: bold; text-decoration: none;">Ver en Instagram ↗</a>');

        chatBox.innerHTML += `<div style="text-align: left; margin: 5px 0;"><span style="background: #f3e5f5; padding: 10px 14px; border-radius: 15px 15px 15px 0; display: inline-block; color: #333; font-size: 14px; border: 1px solid #e1bee7; line-height: 1.4;">${respuestaFormateada}</span></div>`;

    } catch (error) {
        console.error("Error en la API:", error);
        const loader = document.getElementById(loadingId);
        if (loader) loader.innerText = "❌ Error de conexión.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permitir enviar con Enter (Verificando que exista el input)
const inputField = document.getElementById('userInput');
if (inputField) {
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') enviarMensaje();
    });
}

