const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { getChatCompletion } = require('../services/deepseek');
const { procesarEntrada, getSiguientePregunta } = require('./flujo');
const { query } = require('../db/pool');

// Configuración de logs
const logger = pino({ level: 'info' });

async function initWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../../auth_info_baileys'));
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // Ya lo manejamos manualmente
        logger,
        browser: ['Pasteleria Renzos', 'Chrome', '1.0.0'], // Identificación personalizada
        getMessage: async (key) => ({ conversation: 'hola' }),
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('--- NUEVO CÓDIGO QR GENERADO ---');
            qrcode.generate(qr, { small: true });
            console.log('Escanea el código de arriba con tu WhatsApp para vincular el bot.');
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode : 0;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`Conexión cerrada [${statusCode}]. Reconectando: ${shouldReconnect}`);

            if (shouldReconnect) {
                setTimeout(() => initWhatsApp(), 5000); // Esperar 5s antes de reintentar
            } else {
                console.log('Sesión cerrada permanentemente. Elimina auth_info_baileys y reinicia para generar nuevo QR.');
            }
        } else if (connection === 'open') {
            console.log('¡Bot conectado y listo para recibir mensajes!');
        }
    });

    // Manejo de mensajes entrantes
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;

        for (const msg of m.messages) {
            if (!msg.key.fromMe && msg.message) {
                const from = msg.key.remoteJid;
                const body = msg.message.conversation ||
                    msg.message.extendedTextMessage?.text ||
                    msg.message.imageMessage?.caption || "";

                if (!body) continue;

                console.log(`Mensaje recibido de ${from}: ${body}`);

                try {
                    // 0. Registrar/Verificar usuario en la base de datos
                    const tel = from.split('@')[0];
                    const userCheck = await query('SELECT * FROM usuarios WHERE telefono = $1 OR codigo = $2', [tel, tel]);
                    if (userCheck.rowCount === 0) {
                        try {
                            await query(
                                'INSERT INTO usuarios (nombre, codigo, telefono) VALUES ($1, $2, $3)',
                                [`Cliente WhatsApp ${tel}`, tel, tel]
                            );
                            console.log(`Nuevo cliente registrado automáticamente: ${tel}`);
                        } catch (e) {
                            console.error('Error al registrar cliente automático:', e);
                        }
                    }

                    // 1. Procesar entrada para llenar plantilla (extraer datos como sabor, producto, etc.)
                    const sesion = procesarEntrada(from, body);

                    // 2. Obtener catálogo real de la DB para inyectar en el contexto
                    const productosRes = await query(`
                        SELECT p.nombre as producto, pr.tipo, pr.cantidad, pr.unidad, pr.precio 
                        FROM productos p 
                        JOIN presentaciones pr ON p.id = pr.producto_id 
                        WHERE p.activo = true AND pr.activo = true
                        `);
                    const catalogo = productosRes.rows;

                    // 3. Leer contexto de sistema
                    const contextoBotPath = path.join(process.cwd(), 'contexto_bot');
                    let basePrompt = fs.readFileSync(contextoBotPath, 'utf8');

                    // Sobrescribir saludo si es el inicio (según pedido del usuario)
                    if (body.toLowerCase() === 'hola' || body.toLowerCase() === 'buenos dias') {
                        basePrompt = `¡Hola! 😃 Soy bot - Renzo 👋 ¡A tus órdenes! *¿En qué puedo ayudarte hoy ?*\n\n1️⃣ Sugerencias\n2️⃣ Reserva\n3️⃣ Compra al instante\n4️⃣ Promociones & descuentos\n5️⃣ Estado de mi pedido\n6️⃣ Reclamos\n\nElige un número o cuéntame brevemente qué necesitas.`;
                    }

                    // 4. Crear prompt dinámico incluyendo el estado actual y el catálogo real
                    const promptConEstado = `${basePrompt}
                    \nCATÁLOGO REAL DISPONIBLE(Usa estos datos, no inventes precios):
                        ${JSON.stringify(catalogo, null, 2)}
                    \nCONTEXTO ACTUAL DEL PEDIDO DEL CLIENTE:
                        ${JSON.stringify(sesion.datos, null, 2)}
                    \nRegla de oro: Si el cliente pide algo que NO está en el catálogo, responde: "Lo sentimos, no nos queda este producto por ahora :("
                    \nRegla de mensajes: Separa tus respuestas con "---" si quieres que se envíen en mensajes distintos.`;

                    // 5. Obtener respuesta de DeepSeek
                    const aiResponse = await getChatCompletion(body, [], promptConEstado);

                    // 6. Enviar respuesta (Soporta multi-mensaje si se usa "---")
                    const messages = aiResponse.split('---');
                    for (const mText of messages) {
                        const trimmed = mText.trim();
                        if (trimmed) {
                            await sock.sendMessage(from, { text: trimmed });
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay natural
                        }
                    }

                } catch (error) {
                    console.error('Error procesando mensaje:', error);
                }
            }
        }
    });

    return sock;
}

module.exports = { initWhatsApp };
