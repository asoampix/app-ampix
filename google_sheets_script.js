/**
 * Script de Google Apps Script para almacenar suscriptores desde la web Poupee Crochet.
 * 
 * Instrucciones de instalación en Google Sheets:
 * 1. Crea una hoja de cálculo de Google nueva en tu cuenta (ej. "Suscriptores Poupee").
 * 2. Nombra la primera pestaña como "Suscriptores".
 * 3. En la fila 1, escribe las columnas: 
 *    Columna A: Fecha | Columna B: Nombre | Columna C: Email
 * 4. Haz clic en "Extensiones" > "Apps Script".
 * 5. Borra el código existente y pega este archivo.
 * 6. Haz clic en "Implementar" > "Nueva implementación".
 * 7. Selecciona tipo "Aplicación web".
 * 8. Configura:
 *    - Descripción: Backend Suscriptores Web
 *    - Ejecutar como: Tú (tu cuenta de gmail)
 *    - Quién tiene acceso: Cualquiera (incluso anónimos)
 * 9. Haz clic en "Implementar", autoriza los accesos de Google y copia la "URL de la aplicación web" para pegarla en tu widget HTML de la web.
 */

function doPost(e) {
  try {
    // Abrir la hoja de cálculo por su ID o la activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Suscriptores");
    if (!sheet) {
      // Si no existe la pestaña, la creamos
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Suscriptores");
      sheet.appendRow(["Fecha", "Nombre", "Email"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();
    var name = data.name || "Sin nombre";
    var email = data.email;
    
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error",
        "message": "Falta el correo electrónico."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Añadir los datos a la hoja
    sheet.appendRow([timestamp, name, email]);
    
    // Devolver respuesta de éxito
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Suscripción registrada correctamente."
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// Permitir solicitudes preflight CORS (OPTIONS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
