// ============================================================
//  NEON LEADS — Google Apps Script para Google Sheets
//  Recibe datos del formulario de contacto y los guarda en Sheet
//
//  INSTRUCCIONES DE INSTALACIÓN:
//  1. Abre Google Sheets → Extensiones → Apps Script
//  2. Borra el código que hay y pega todo este archivo
//  3. Guarda (Ctrl+S) con el nombre "base clientes"
//  4. Click en "Implementar" → "Nueva implementación"
//  5. Tipo: "Aplicación web"
//     - Ejecutar como: "Yo"
//     - Quién tiene acceso: "Cualquier persona"
//  6. Click "Implementar" → Copia la URL generada
//  7. Pega esa URL en techleads.html donde dice:
//     const SHEETS_URL = 'TU_URL_AQUI';
// ============================================================

// ID de tu Google Spreadsheet (está en la URL: /spreadsheets/d/ESTE_ID/edit)
// ⚠️ IMPORTANTE: Reemplaza esto con el ID REAL de tu hoja de cálculo
// El ID es la cadena larga entre /d/ y /edit en la URL de Google Sheets
// Ejemplo: si tu URL es https://docs.google.com/spreadsheets/d/1AbC_dEfGhI/edit
// entonces el ID es: 1AbC_dEfGhI
const SPREADSHEET_ID = '1vW0InQ8ac-4CnGH53NkwGeO2nRLigO1HGREG8vPmfpU';

// Nombre de la hoja donde se guardarán los datos
const SHEET_NAME = 'Clientes';

// ============================================================
//  FUNCIÓN PRINCIPAL — Se ejecuta al recibir el formulario
// ============================================================
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Extraer parámetros del request
    const params = e.parameter || {};

    const nombre  = (params.nombre  || '').substring(0, 200);   // Limitar largo
    const empresa = (params.empresa || '').substring(0, 200);
    const email   = (params.email   || '').substring(0, 200);
    const tipo    = (params.tipo    || '').substring(0, 200);
    const mensaje = (params.mensaje || '').substring(0, 2000);
    const fecha   = params.fecha   || new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' });

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Campos requeridos faltantes: nombre, email, mensaje'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Validación de email básica
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Email inválido'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Abrir la hoja de cálculo
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Crear la hoja si no existe y agregar encabezados
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'ID',
        'Fecha',
        'Nombre',
        'Empresa',
        'Email',
        'Tipo de Proyecto',
        'Mensaje',
        'Estado',
        'Notas'
      ]);

      // Dar formato a la fila de encabezados
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#050510');
      headerRange.setFontColor('#00ffff');
      headerRange.setFontWeight('bold');
      headerRange.setFontFamily('Courier New');
      sheet.setFrozenRows(1);

      // Anchos de columna
      sheet.setColumnWidth(1, 60);   // ID
      sheet.setColumnWidth(2, 160);  // Fecha
      sheet.setColumnWidth(3, 150);  // Nombre
      sheet.setColumnWidth(4, 150);  // Empresa
      sheet.setColumnWidth(5, 200);  // Email
      sheet.setColumnWidth(6, 180);  // Tipo
      sheet.setColumnWidth(7, 300);  // Mensaje
      sheet.setColumnWidth(8, 100);  // Estado
      sheet.setColumnWidth(9, 200);  // Notas
    }

    // Generar ID secuencial
    const lastRow = sheet.getLastRow();
    const newId   = lastRow; // La fila 1 es encabezado, fila 2 = ID 1, etc.

    // Insertar la nueva fila de datos
    sheet.appendRow([
      newId,
      fecha,
      nombre,
      empresa,
      email,
      tipo,
      mensaje,
      'Nuevo',     // Estado inicial
      ''           // Notas vacías
    ]);

    // Dar color a la nueva fila (alterna para mejor lectura)
    const newRowIndex = sheet.getLastRow();
    const newRowRange = sheet.getRange(newRowIndex, 1, 1, 9);
    if (newRowIndex % 2 === 0) {
      newRowRange.setBackground('#0a0a28');
    } else {
      newRowRange.setBackground('#050510');
    }
    newRowRange.setFontColor('#e0e8ff');

    // Marcar celda "Estado" en verde neón
    sheet.getRange(newRowIndex, 8).setFontColor('#00ff88').setFontWeight('bold');

    // Enviar email de notificación al equipo (opcional)
    // Descomenta la siguiente línea y pon el email del equipo:
    // sendNotificationEmail(nombre, empresa, email, tipo, mensaje, fecha);

    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Lead guardado correctamente',
        id: newId,
        timestamp: fecha
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log del error para depuración
    console.error('Error en handleRequest:', error.toString());

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Error interno: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
//  NOTIFICACIÓN POR EMAIL (opcional)
// ============================================================
function sendNotificationEmail(nombre, empresa, email, tipo, mensaje, fecha) {
  // ⚠️ CAMBIA ESTO con el email real de tu equipo
  const recipient = 'tu-equipo@tudominio.com';
  const subject   = `🔥 Nuevo Lead: ${nombre} (${empresa || 'Sin empresa'})`;
  const body = `
NUEVO LEAD EN NEON LEADS
========================

ID Fecha:   ${fecha}
Nombre:     ${nombre}
Empresa:    ${empresa || '—'}
Email:      ${email}
Proyecto:   ${tipo || '—'}

MENSAJE:
${mensaje}

---
Ver todos los leads: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
  `;

  GmailApp.sendEmail(recipient, subject, body);
}

// ============================================================
//  FUNCIÓN AUXILIAR: Crear hoja manualmente si quieres
//  Ejecuta esta función desde el editor de Apps Script
//  para inicializar la hoja con formato correcto
// ============================================================
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (sheet) {
    const confirm = Browser.msgBox(
      'La hoja "' + SHEET_NAME + '" ya existe. ¿Borrar y recrear?',
      Browser.Buttons.YES_NO
    );
    if (confirm !== 'yes') return;
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow(['ID', 'Fecha', 'Nombre', 'Empresa', 'Email', 'Tipo de Proyecto', 'Mensaje', 'Estado', 'Notas']);

  const headerRange = sheet.getRange(1, 1, 1, 9);
  headerRange.setBackground('#050510');
  headerRange.setFontColor('#00ffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Courier New');
  sheet.setFrozenRows(1);

  Browser.msgBox('✅ Hoja "' + SHEET_NAME + '" creada con éxito.');
}

// ============================================================
//  TEST: Ejecuta esto para verificar que todo funciona
//  Rellena la hoja con un lead de prueba
// ============================================================
function testInsert() {
  const fakeEvent = {
    parameter: {
      nombre:  'Test Usuario',
      empresa: 'Empresa Test',
      email:   'test@test.com',
      tipo:    'CRM / Gestión de Leads',
      mensaje: 'Esto es un mensaje de prueba desde el script.',
      fecha:   new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' })
    }
  };

  const result = handleRequest(fakeEvent);
  Logger.log(result.getContent());
}
