/**
 * Script de Google Apps Script para el Backend de la Asociación Ampix.
 * 
 * Este script automatiza:
 * 1. La recepción de registros desde formularios externos (widgets HTML en Google Sites).
 * 2. La asignación automática de un ID de asociado correlativo (ej. AMP-2026-0001).
 * 3. El envío automatizado de correos de bienvenida en HTML con enlaces de inducción.
 * 4. La notificación al equipo de administración cuando una empresa se registra.
 * 
 * Instrucciones de instalación:
 * 1. Abre tu Google Sheet institucional.
 * 2. Ve a Extensiones > Apps Script.
 * 3. Copia todo este código y pégalo.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 * 5. Selecciona tipo "Aplicación web".
 * 6. Configura:
 *    - Descripción: Backend Ampix Fase 0
 *    - Ejecutar como: Tú (asoampix.es@gmail.com o ampix.eu@gmail.com)
 *    - Quién tiene acceso: Cualquiera (esto es obligatorio para recibir peticiones externas)
 * 7. Haz clic en "Implementar" y autoriza los accesos.
 * 8. Copia la "URL de la aplicación web" para pegarla en tus widgets HTML.
 */

function doPost(e) {
  var origin = "*";
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action; // "registrar_simpatizante", "registrar_empresa", "registrar_sugerencia"
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "registrar_simpatizante") {
      return registrarSimpatizante(ss, postData);
    } else if (action === "registrar_empresa") {
      return registrarEmpresa(ss, postData);
    } else if (action === "registrar_sugerencia") {
      return registrarSugerencia(ss, postData);
    } else {
      throw new Error("Acción desconocida: " + action);
    }
    
  } catch (error) {
    return retornarRespuesta({"result": "error", "message": error.toString()});
  }
}

// Configura OPTIONS para permitir solicitudes preflight CORS desde el sitio web
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function registrarSimpatizante(ss, data) {
  var sheet = ss.getSheetByName("DB_Simpatizantes");
  if (!sheet) {
    throw new Error("La hoja DB_Simpatizantes no existe.");
  }
  
  var timestamp = new Date();
  var nombre = data.nombre || "";
  var email = data.email || "";
  var telefono = data.telefono || "";
  var perfil = data.perfil || "";
  var rgpd = data.rgpd ? "SÍ" : "NO";
  
  if (!nombre || !email) {
    throw new Error("Nombre y Email son obligatorios.");
  }
  
  // Generar ID correlativo de asociado
  var idAsociado = generarSiguienteId(sheet);
  
  // Escribir en la hoja
  sheet.appendRow([timestamp, idAsociado, nombre, email, telefono, perfil, rgpd]);
  
  // Enviar email de bienvenida en segundo plano
  enviarEmailBienvenida(nombre, email, idAsociado, perfil);
  
  return retornarRespuesta({
    "result": "success",
    "message": "Registro completado con éxito",
    "id_asociado": idAsociado
  });
}

function registrarEmpresa(ss, data) {
  var sheet = ss.getSheetByName("DB_Empresas_Inversores");
  if (!sheet) {
    throw new Error("La hoja DB_Empresas_Inversores no existe.");
  }
  
  var timestamp = new Date();
  var razonSocial = data.razon_social || "";
  var sector = data.sector || "";
  var contacto = data.contacto || "";
  var email = data.email || "";
  var interes = data.interes || "";
  var estado = "Pendiente"; // Por defecto
  
  if (!razonSocial || !email || !contacto) {
    throw new Error("Razón Social, Contacto y Email son obligatorios.");
  }
  
  sheet.appendRow([timestamp, razonSocial, sector, contacto, email, interes, estado]);
  
  // Enviar email de notificación a administración
  enviarNotificacionAdministrador(razonSocial, contacto, email, interes);
  
  return retornarRespuesta({
    "result": "success",
    "message": "Datos de empresa registrados correctamente."
  });
}

function registrarSugerencia(ss, data) {
  var sheet = ss.getSheetByName("DB_Sugerencias");
  if (!sheet) {
    throw new Error("La hoja DB_Sugerencias no existe.");
  }
  
  var timestamp = new Date();
  var nombre = data.nombre || "Anónimo";
  var email = data.email || "No provisto";
  var plataforma = data.plataforma || "";
  var opinion = data.opinion || "";
  var puntuacion = data.puntuacion || "";
  
  if (!opinion) {
    throw new Error("La opinión no puede estar vacía.");
  }
  
  sheet.appendRow([timestamp, nombre, email, plataforma, opinion, puntuacion]);
  
  return retornarRespuesta({
    "result": "success",
    "message": "Sugerencia enviada correctamente."
  });
}

function generarSiguienteId(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return "AMP-2026-0001";
  }
  
  // Obtener el ID de la última fila (Columna B / 2)
  var lastIdStr = sheet.getRange(lastRow, 2).getValue().toString();
  var parts = lastIdStr.split("-");
  if (parts.length === 3) {
    var year = parts[1];
    var currentNum = parseInt(parts[2], 10);
    var nextNum = currentNum + 1;
    // Formatear con ceros a la izquierda (4 dígitos)
    var numStr = ("0000" + nextNum).slice(-4);
    return "AMP-" + year + "-" + numStr;
  }
  
  // Fallback en caso de que el formato no coincida
  return "AMP-2026-" + ("0000" + lastRow).slice(-4);
}

function enviarEmailBienvenida(nombre, email, idAsociado, perfil) {
  var subject = "¡Te damos la bienvenida a la Asociación Ampix! - Socio " + idAsociado;
  
  // Diseño premium de correo en HTML (Verde institucional y gris oscuro)
  var htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #2e7d32; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 1px;">Asociación Ampix</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.85;">Creatividad como Derecho Humano</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
        <p>Es un orgullo para nosotros darte la bienvenida oficial a la <strong>Asociación Ampix</strong>. Tu solicitud de registro se ha completado con éxito.</p>
        
        <div style="background-color: #f1f8e9; border-left: 4px solid #2e7d32; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <p style="margin: 0; font-size: 14px; color: #2e7d32;"><strong>Tu Identificador de Asociado:</strong></p>
          <p style="margin: 5px 0 0 0; font-size: 20px; font-family: monospace; font-weight: bold; letter-spacing: 1px; color: #1b5e20;">${idAsociado}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #558b2f;">Perfil registrado: ${perfil}</p>
        </div>
        
        <p>Como simpatizante y miembro del área de <strong>${perfil}</strong>, ahora tienes acceso a nuestras iniciativas iniciales:</p>
        
        <ul style="padding-left: 20px;">
          <li style="margin-bottom: 10px;"><strong>Aula de Formación:</strong> Accede a nuestro aula interactiva en <a href="https://classroom.google.com" style="color: #2e7d32; text-decoration: underline;">Google Classroom</a> con tu correo.</li>
          <li style="margin-bottom: 10px;"><strong>Reuniones de Comunidad:</strong> Participa en nuestras asambleas a través de <a href="https://meet.google.com" style="color: #2e7d32; text-decoration: underline;">Google Meet</a>.</li>
        </ul>
        
        <p>Adjunto a este correo encontrarás las próximas fechas y convocatorias en tu calendario de Google para que no te pierdas nada.</p>
        
        <div style="text-align: center; margin: 35px 0 15px 0;">
          <a href="https://www.ampix.es" style="background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">Visitar Sitio Web</a>
        </div>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #eaeaea;">
        <p style="margin: 0;">Asociación Cultural sin fines de lucro Ampix &copy; 2026</p>
        <p style="margin: 5px 0 0 0;">Este mensaje cumple con el RGPD y la LOPDGDD. Tus datos se tratan confidencialmente.</p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

function enviarNotificacionAdministrador(razonSocial, contacto, email, interes) {
  var adminEmail = Session.getActiveUser().getEmail(); // O escribir un email específico (ej. ampix.eu@gmail.com)
  var subject = "⚠️ Nuevo Registro de Empresa/Inversor: " + razonSocial;
  
  var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ffcc80; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #ff9800; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">Nueva Empresa Interesada</h2>
      </div>
      <div style="padding: 20px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p>Se ha registrado un nuevo interés corporativo en el portal de la Asociación Ampix:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eeeeee; width: 35%;">Razón Social:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${razonSocial}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Persona de Contacto:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${contacto}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Email Corporativo:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Modalidad de Interés:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeeeee;">${interes}</td>
          </tr>
        </table>
        <p>Este prospecto se ha agregado automáticamente a la hoja <strong>DB_Empresas_Inversores</strong> con estado <strong>"Pendiente"</strong>.</p>
        <p>Por favor, revisa el panel de AppSheet para gestionar este registro y coordinar una reunión de presentación.</p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}

function retornarRespuesta(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
