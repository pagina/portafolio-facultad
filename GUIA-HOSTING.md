# 🚀 Guía de Hosting — NEON LEADS

Opciones para subir el sitio al aire, de más fácil a más pro.

---

## ⚡ OPCIÓN 1 — GitHub Pages (GRATIS, recomendado para empezar)

**Ideal para:** maqueta, portafolio, presentaciones a clientes  
**Costo:** $0  
**Dominio:** `tuusuario.github.io/neonleads`  
**Tiempo:** ~5 minutos

### Pasos:
```bash
# 1. Crea un repo en github.com llamado "neonleads"
# 2. Sube el archivo:
git init
git add techleads.html
git mv techleads.html index.html   # renómbralo a index.html
git commit -m "first commit"
git remote add origin https://github.com/TUUSUARIO/neonleads.git
git push -u origin main

# 3. En GitHub → Settings → Pages → Source: "Deploy from branch: main"
# 4. Listo en 2 min en: https://TUUSUARIO.github.io/neonleads
```

**Dominio propio:** En Settings → Pages → Custom domain → escribe `neonleads.dev`  
(Necesitas apuntar los DNS de tu dominio a GitHub: `185.199.108.153`)

---

## ⚡ OPCIÓN 2 — Netlify (GRATIS, drag & drop)

**Ideal para:** deploy rápido sin terminal  
**Costo:** $0 (plan gratuito muy generoso)  
**Dominio:** `neonleads.netlify.app`  
**Tiempo:** 30 segundos literalmente

### Pasos:
1. Ve a **[netlify.com](https://netlify.com)** → Sign Up con GitHub
2. Arrastra el archivo `index.html` a la zona de deploy
3. ¡Listo! URL instantánea tipo `https://amazing-name-123.netlify.app`
4. En Site Settings → Domain → Add custom domain → `neonleads.dev`

**Ventajas extras:**
- HTTPS automático (SSL gratis)
- Deploy automático desde GitHub
- Formularios nativos (alternativa a Google Sheets)
- CDN global incluido

---

## ⚡ OPCIÓN 3 — Vercel (GRATIS, el favorito de devs)

**Ideal para:** cuando el proyecto crezca a Next.js/React  
**Costo:** $0  
**Dominio:** `neonleads.vercel.app`  
**Tiempo:** ~3 minutos

```bash
# Instala Vercel CLI
npm install -g vercel

# En la carpeta del proyecto
vercel

# Te hace 3 preguntas y despliega solo
# URL lista: https://neonleads.vercel.app
```

---

## 🔥 OPCIÓN 4 — Cloudflare Pages (GRATIS, el más rápido)

**Ideal para:** máximo rendimiento global, muchas visitas  
**Costo:** $0  
**Dominio:** `neonleads.pages.dev`  
**Tiempo:** ~5 minutos

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
2. Conecta tu repo de GitHub
3. Build settings: ninguno (es HTML puro)
4. Deploy automático en cada `git push`

**Ventaja:** CDN en 200+ ciudades del mundo, sin límite de bandwidth.

---

## 💰 OPCIÓN 5 — VPS (cuando tengas usuarios reales)

**Ideal para:** producción real con backend propio  
**Costo:** desde $6 USD/mes (DigitalOcean, Hetzner, Contabo)

```bash
# En tu VPS con Ubuntu:
sudo apt update
sudo apt install nginx

# Copia el archivo
sudo cp index.html /var/www/html/index.html

# Nginx ya lo sirve en tu IP pública
# Agrega tu dominio y certbot para SSL:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d neonleads.dev
```

**Proveedores recomendados:**
| Proveedor | Precio | RAM | Bueno para |
|---|---|---|---|
| Hetzner | €3.5/mes | 2GB | Best value Europa |
| DigitalOcean | $6/mes | 1GB | Fácil de usar |
| Contabo | €4/mes | 4GB | Mucha RAM barata |
| Render | $0-7/mes | 512MB | Deploy desde GitHub |

---

## 🗺️ RESUMEN — ¿Cuál elegir?

```
¿Solo quieres mostrar la maqueta rápido?
  → NETLIFY (drag & drop, 30 segundos)

¿Trabajas con git y quieres automatizar?
  → GITHUB PAGES o VERCEL

¿Quieres máxima velocidad global gratis?
  → CLOUDFLARE PAGES

¿Ya tienes usuarios y necesitas backend?
  → VPS (Hetzner o DigitalOcean)
```

---

## 🔗 Conectar el formulario a Google Sheets

### Paso a paso:

1. **Crea el Google Sheet**
   - Ve a [sheets.google.com](https://sheets.google.com) → Crear nueva hoja
   - Copia el ID de la URL: `docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`

2. **Instala el Apps Script**
   - En la hoja: **Extensiones → Apps Script**
   - Borra el código existente y pega el contenido de `apps-script-google-sheets.js`
   - Cambia `TU_SPREADSHEET_ID_AQUI` por el ID copiado en el paso 1
   - Guarda con `Ctrl+S`

3. **Despliega como Web App**
   - Click **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Click **Implementar** → Autoriza los permisos
   - **Copia la URL** que aparece

4. **Conecta al HTML**
   - Abre `techleads.html`
   - Busca: `const SHEETS_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec'`
   - Reemplaza con la URL del paso 3
   - También actualiza el código del fetch para que sea real (reemplaza el `await new Promise...` simulado):

```javascript
// Reemplaza la simulación por esto en submitForm():
const response = await fetch(SHEETS_URL + '?' + params.toString(), {
  method: 'GET',
  mode: 'no-cors'
});
// Con no-cors no podemos leer la respuesta, pero el dato se guarda igual
status.className = 'form-status success';
status.textContent = '✓ MENSAJE ENVIADO — Te contactamos en menos de 24 horas.';
```

5. **Conecta WhatsApp**
   - Busca todos los `521XXXXXXXXXX` en el HTML
   - Reemplaza con el número real en formato internacional sin `+` ni espacios
   - Ejemplo México: `5215512345678`

---

## 🔒 Seguridad básica recomendada

- [ ] Activar HTTPS (todas las opciones gratis lo incluyen)
- [ ] Agregar CAPTCHA al formulario (hCaptcha es gratis y respetuoso de privacidad)
- [ ] Limitar el Apps Script con validación de dominio origen
- [ ] No exponer el SPREADSHEET_ID en el frontend (el Apps Script actúa como proxy ✅)

---

*Generado para NEON LEADS Tech Collective — 2026*
