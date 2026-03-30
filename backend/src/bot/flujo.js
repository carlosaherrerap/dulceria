/**
 * Lógica de fases y flujo de conversación para el Bot de Renzos.
 * Maneja el estado de la conversación (plantilla de pedido) para evitar preguntas redundantes.
 */

const FASES = {
    INICIO: 'inicio',
    SUGERENCIAS: 'sugerencias',
    RESERVA: 'reserva',
    PAGO: 'pago',
    RECLAMO: 'reclamo'
};

const plantillas_cache = new Map(); // En producción, usar Redis o DB

/**
 * Obtiene o inicializa la plantilla de sesión del cliente
 */
function getPlantillaCliente(jid) {
    if (!plantillas_cache.has(jid)) {
        plantillas_cache.set(jid, {
            fase: FASES.INICIO,
            datos: {
                ocasion: null,
                producto: null,
                cantidad: null,
                sabor: null,
                relleno: null,
                colores: null,
                decoracion: null
            }
        });
    }
    return plantillas_cache.get(jid);
}

/**
 * Procesa la entrada del cliente para llenar la plantilla automáticamente
 */
function procesarEntrada(jid, mensaje) {
    const sesion = getPlantillaCliente(jid);
    const m = mensaje.toLowerCase();

    // Lógica simple de extracción de datos (IA haría esto mejor, pero aquí hay una base)
    if (m.includes('cumpleaños')) sesion.datos.ocasion = 'cumpleaños';
    if (m.includes('keke') || m.includes('torta')) sesion.datos.producto = 'torta';
    if (m.includes('chocolate')) sesion.datos.sabor = 'chocolate';
    if (m.includes('manjar')) sesion.datos.relleno = 'manjar';

    // Detectar números para cantidad (Evitar si el mensaje es solo un número pequeño de opción de menú)
    const matches = m.match(/\b\d+\b/);
    if (matches) {
        const val = parseInt(matches[0]);
        // Si el mensaje es solo el número y es < 10, probablemente es una opción de menú, no cantidad
        if (m.trim().length > 2 || val > 10) {
            sesion.datos.cantidad = val;
        }
    }

    return sesion;
}

/**
 * Verifica qué datos faltan para la reserva
 */
function getSiguientePregunta(jid) {
    const sesion = getPlantillaCliente(jid);
    const d = sesion.datos;

    if (!d.producto) return "¿Qué producto deseas pedir? (Kekes, alfajores, tortas...)";
    if (!d.cantidad) return `Excelente elección de ${d.producto}, ¿qué cantidad necesitas?`;
    if (!d.sabor) return "¿De qué sabor te gustaría el interior?";
    if (!d.relleno) return "¿Lo deseas con algún relleno especial? (Manjar, fudge, arequipe)";

    return "¡Perfecto! Ya tengo los datos base. ¿Procedemos con la reserva de tu pedido?";
}

module.exports = {
    FASES,
    getPlantillaCliente,
    procesarEntrada,
    getSiguientePregunta
};
