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
// --- LÓGICA DEL CHATBOT IA (Directo en navegador) ---

// Tu clave expuesta (A tu riesgo)
const API_KEY = "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"; 

function toggleChat() {
    const container = document.getElementById('chat-container');
    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
}

async function enviarMensaje() {
    const input = document.getElementById('userInput');
    const chatBox = document.getElementById('chat-box');
    const mensaje = input.value;

    if (!mensaje) return;

    // 1. Mostrar tu mensaje
    chatBox.innerHTML += `<div style="text-align: right; margin: 5px 0;"><span style="background: #e1ffc7; padding: 5px 10px; border-radius: 10px; display: inline-block;">${mensaje}</span></div>`;
    input.value = '';

    // 2. Mostrar "Escribiendo..."
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `<div id="${loadingId}" style="text-align: left; margin: 5px 0;"><span style="color: gray; font-style: italic; font-size: 12px;">✨ Consultando astros...</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Petición DIRECTA a Groq (Sin Backend)
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
                        content: "Eres el Oráculo de 'Conectando Almas'. Responde breve, místico y empático. No uses markdown complejo."
                    },
                    {
                        role: "user",
                        content: mensaje
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const respuestaIA = data.choices[0].message.content;

        // 4. Mostrar respuesta
        document.getElementById(loadingId).remove();
        chatBox.innerHTML += `<div style="text-align: left; margin: 5px 0;"><span style="background: #f1f0f0; padding: 8px 12px; border-radius: 10px; display: inline-block; color: #333;">${respuestaIA}</span></div>`;

    } catch (error) {
        console.error(error);
        document.getElementById(loadingId).innerText = "❌ Error de conexión.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permitir enviar con Enter
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') enviarMensaje();
});
