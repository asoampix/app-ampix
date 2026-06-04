# Guía Paso a Paso para Configurar la Web de Poupee Crochet

¡Felicidades! Aquí tienes el manual completo para montar la web de **Maria Fernanda** (`poupee.com.es`) utilizando su cuenta de Google `poupee.com.es@gmail.com`. 

Todos los widgets interactivos personalizados ya están creados en tu carpeta local. A continuación, verás cómo unirlos todos de forma muy sencilla.

---

## 🛠️ Paso 1: Configurar Google Calendar para Clases Virtuales (con Google Meet)

Google Calendar incluye una función gratuita llamada **"Calendario de Citas" (Appointment Schedule)**. Permite que tus alumnos entren a tu web, vean tus días y horas libres, seleccionen una hora, reserven y automáticamente les genere una sala de **Google Meet**.

### Configuración:
1. Inicia sesión en [Google Calendar](https://calendar.google.com/) con la cuenta `poupee.com.es@gmail.com`.
2. En la esquina superior izquierda, haz clic en **"Crear"** (botón "+") y selecciona **"Calendario de citas"**.
3. Configura los detalles de tus clases de Crochet:
   - **Título:** "Clase Particular de Crochet - Maria Fernanda"
   - **Duración de la cita:** 1 hora (60 minutos).
   - **Disponibilidad:** Elige los días y horas de la semana en los que Maria Fernanda puede dar clase.
   - **Co-programación:** Puedes poner un límite de reservas por día o exigir que reserven con mínimo 12 horas de antelación.
4. En **"Ubicación y conferencias"**, selecciona **"Videoconferencia de Google Meet"**. (Esto es vital: Google creará y enviará el enlace de Meet automáticamente a cada alumno).
5. Guarda el calendario de citas.
6. Haz clic en **"Compartir"** y verás un enlace. Guarda ese enlace, ¡lo usaremos para que la gente reserve! (También podrás incrustar este calendario directamente en Google Sites).

---

## 📧 Paso 2: Activar el Boletín de Suscriptores (Google Sheets)

Para captar correos gratis sin pagar plataformas caras, usaremos una hoja de cálculo en la cuenta de Google como base de datos de suscriptores.

### Configuración:
1. Entra a [Google Drive](https://drive.google.com/) con la cuenta `poupee.com.es@gmail.com`.
2. Crea una nueva **Hoja de cálculo de Google** y nómbrala como `Suscriptores Web`.
3. Nombra la primera pestaña de abajo como **`Suscriptores`** (respetando la S mayúscula).
4. En la primera fila escribe las cabeceras:
   - Celda A1: `Fecha`
   - Celda B1: `Nombre`
   - Celda C1: `Email`
5. En el menú superior de la hoja de cálculo, haz clic en **Extensiones > Apps Script**.
6. Borra todo el código que aparezca por defecto.
7. Abre el archivo local [google_sheets_script.js](file:///c:/Users/Master/.gemini/antigravity/scratch/development_workspace/Prueba%201/google_sheets_script.js), copia todo su contenido y pégalo en el editor de Apps Script.
8. Guarda los cambios haciendo clic en el icono del disquete 💾.
9. Haz clic en el botón azul **"Implementar"** (esquina superior derecha) y selecciona **"Nueva implementación"**.
10. Haz clic en el engranaje ⚙️ al lado de "Seleccionar tipo" y elige **"Aplicación web"**.
11. Configura lo siguiente:
    - **Descripción:** `Backend Suscriptores Poupee`
    - **Ejecutar como:** `Tú (poupee.com.es@gmail.com)`
    - **Quién tiene acceso:** `Cualquiera` (Es importante elegir "Cualquiera" para que el formulario web pueda guardar los datos).
12. Haz clic en **Implementar**.
13. Google te pedirá "Autorizar acceso". Concede los permisos con la cuenta `poupee.com.es@gmail.com`. *(Si te sale una advertencia de seguridad, haz clic en "Configuración avanzada" y luego en "Ir a Proyecto sin título (no seguro)").*
14. Copia la **"URL de la aplicación web"** que te proporciona al finalizar (es un enlace largo que termina en `/exec`).

### Vincular el Script al Widget:
1. Abre el archivo local [newsletter_widget.html](file:///c:/Users/Master/.gemini/antigravity/scratch/development_workspace/Prueba%201/newsletter_widget.html) en un editor de texto (como el Bloc de Notas o VS Code).
2. Busca la línea número **250** aproximadamente, donde dice:
   ```javascript
   const SCRIPT_URL = "URL_DE_TU_APPS_SCRIPT";
   ```
3. Reemplaza `"URL_DE_TU_APPS_SCRIPT"` con la URL de aplicación web que acabas de copiar de Google Apps Script. Debería quedar algo así:
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Guarda el archivo. ¡Tu boletín ya está listo para captar correos en vivo!

---

## 🌐 Paso 3: Crear la Web en Google Sites e Insertar los Widgets

### Crear el Sitio:
1. Entra a [Google Sites](https://sites.google.com/) con la cuenta de Google del negocio.
2. Crea un sitio web en **Blanco** o elige una plantilla que te guste.
3. Ponle el título principal a tu web (ej: *Poupee Crochet*). Puedes subir una imagen de fondo acogedora para la cabecera.

### Insertar el Catálogo y Carrito (`catalog_widget.html`):
1. En Google Sites, ve al panel derecho y selecciona la pestaña **Insertar**.
2. Haz clic en **"Insertar"** (icono `< >` o de esferas de enlace) y selecciona la pestaña **"Insertar código"** (en lugar de "Por URL").
3. Copia todo el contenido del archivo local [catalog_widget.html](file:///c:/Users/Master/.gemini/antigravity/scratch/development_workspace/Prueba%201/catalog_widget.html) y pégalo en el cuadro de texto.
4. Haz clic en **Siguiente** y luego en **Insertar**.
5. Ajusta el tamaño del bloque estirando los bordes azules en Google Sites para que el catálogo de productos se vea completo sin barras de desplazamiento internas.

### Insertar las Tarjetas de Información y Wallapop (`info_links_widget.html`):
1. Justo debajo del catálogo, vuelve a hacer clic en **Insertar > Insertar código**.
2. Copia todo el contenido del archivo local [info_links_widget.html](file:///c:/Users/Master/.gemini/antigravity/scratch/development_workspace/Prueba%201/info_links_widget.html) y pégalo.
3. Dale a **Insertar** y ajusta el tamaño del recuadro.

### Insertar el Formulario del Boletín (`newsletter_widget.html`):
1. Más abajo en la página (o en la sección de contacto), haz clic en **Insertar > Insertar código**.
2. Copia todo el contenido del archivo local modificado [newsletter_widget.html](file:///c:/Users/Master/.gemini/antigravity/scratch/development_workspace/Prueba%201/newsletter_widget.html) y pégalo.
3. Dale a **Insertar** y ajústalo para que quede centrado.

---

## 🔗 Paso 4: Conectar tu Dominio de GoDaddy (`Poupee.com.es`) a Google Sites

Para que tu web no tenga un enlace largo de Google y se abra escribiendo `www.poupee.com.es`, sigue estos pasos:

### 1. En Google Sites:
1. Abre tu sitio en modo edición en Google Sites.
2. En la parte superior derecha, haz clic en el icono de **Configuración** (la rueda dentada ⚙️).
3. Selecciona **"Dominios personalizados"** y haz clic en **"Iniciar configuración"**.
4. Selecciona **"Usar un dominio de un tercero"**.
5. Escribe tu dominio completo: `www.poupee.com.es` (es obligatorio incluir las `www`).
6. Google te indicará que verifiques la propiedad del dominio. Te dará un código de verificación especial (un registro TXT) que debes agregar en GoDaddy. Sigue las instrucciones de pantalla para validar. Una vez validado, te dirá que apuntes el dominio a `ghs.googlehosted.com.`.

### 2. En GoDaddy:
1. Inicia sesión en tu cuenta de **GoDaddy**.
2. Ve a la sección **"Mis productos"** y busca tu dominio `poupee.com.es`.
3. Haz clic en **"DNS"** o **"Administrar zonas DNS"**.
4. En la tabla de registros DNS:
   - **Busca el registro de tipo CNAME con el Nombre/Host `www`.**
   - Edítalo para que apunte a: `ghs.googlehosted.com.` (asegúrate de incluir el punto al final si GoDaddy lo permite).
   - *Si te pidió verificar la propiedad en el paso anterior*, añade un nuevo registro de tipo **TXT** con el Nombre `@` y el valor que te dio Google.
5. **Configurar Redirección (Opcional pero Recomendado):**
   - Para que si alguien escribe `poupee.com.es` (sin las www) también entre a tu web:
   - En la misma página de DNS de GoDaddy, busca abajo la sección **"Reenvío"** o **"Forwarding"**.
   - Añade un reenvío de Dominio a: `https://www.poupee.com.es` (tipo 301 Permanente, solo HTTP/HTTPS).
6. Guarda todos los cambios en GoDaddy.
7. Vuelve a Google Sites, completa el asistente de dominio personalizado y haz clic en **Publicar** (botón azul arriba a la derecha).

*Nota: La propagación de los DNS de GoDaddy puede tardar desde unos minutos hasta 24-48 horas en activarse del todo.*

---

## 🌟 Consejos de Venta y Wallapop para Maria Fernanda

1. **Fotografía de Producto:** Las fotos actuales que generamos de ejemplo tienen un estilo profesional y acogedor. Cuando subas fotos reales, intenta que tengan luz natural brillante y un fondo ordenado (estilo rústico, maderas o telas claras).
2. **Usa Bizum como Gancho:** En España, Bizum es el método preferido de pago. Añadir la aclaración *"Aceptamos Bizum y Pago en mano"* genera muchísima confianza y acelera la compra.
3. **El Enlace de Wallapop:** En la tarjeta de Wallapop, hemos puesto el enlace directo a tu Capibara. Si publicas más amigurumis, puedes actualizar el enlace en `info_links_widget.html` para que apunte directamente al **perfil de vendedor** de Maria Fernanda en Wallapop, así verán todos sus productos activos.
