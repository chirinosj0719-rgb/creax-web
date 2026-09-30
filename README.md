# Web de CreaX · borrador

Borrador de la web de CreaX para revisión del equipo. No es la versión publicada:
las páginas llevan `noindex`, así que no aparecen en buscadores.

**Verla en línea:** https://chirinosj0719-rgb.github.io/creax-web/

## Páginas

| Página | Qué tiene |
|---|---|
| `index.html` | Portada con la escena (web + WhatsApp), resultados y las tres líneas de trabajo |
| `servicios.html` | Tipos de web, selector "¿cuál le toca?", tabla comparativa y condiciones |
| `automatizaciones.html` | Flujo de n8n interactivo por rubro, integraciones y casos por rubro |
| `bocetos.html` | Cómo se hace el boceto y los tres ejemplos, recorribles |
| `nosotros.html` | Los cuatro socios, compromisos y el proceso de un proyecto |

Los tres bocetos de ejemplo (`assets/ejemplos/`) son negocios de muestra, no clientes.
Sus fotos son libres (CC0); los créditos están en cada carpeta `fotos/CREDITOS.txt`.

## Pendiente

- Datos de contacto reales: correo, Instagram y LinkedIn (marcados con `<!-- CONTACTO -->` en cada página). El WhatsApp ya es el de Juan Diego.
- Vista de celular.
- Quitar el `noindex` cuando se publique como web oficial, con el dominio propio.

## Cómo se trabaja

Es HTML, CSS y JavaScript sin compilación: se abre `index.html` en el navegador.
Estilos en `estilos.css`, movimiento e interacción en `animacion.js` (usa anime.js, copiado en `assets/`).
`ejemplos.py` regenera los bocetos de muestra y se corre desde la carpeta `Desarrollo` de CreaX, porque usa `nuevo.py`.

Cada vez que se publica, se cambia el número `?v=` de `estilos.css`, `animacion.js` e `inicio.js` en las cinco páginas:
así el navegador de quien entra baja los estilos nuevos en vez de usar los que tenía guardados.

## Seguridad

La web es estática y la sirve GitHub Pages. No hay servidor, base de datos, cuentas ni
contraseñas. El repositorio es público: todo lo que se sube, se ve.

- **Secretos:** ninguna clave, token ni contraseña va en este repositorio. El `.gitignore`
  bloquea `.env`, `*.key`, `*.pem` y `*-token.txt`.
- **Política de seguridad de contenido (CSP)** en el `<head>` de las cinco páginas:
  - solo se cargan archivos del propio sitio;
  - no corren scripts escritos dentro del HTML: todo el JavaScript va en `inicio.js`
    (lo primero, en el `<head>`) o en `animacion.js`;
  - no se permiten formularios, iframes ni plugins.
- **Si algún día se carga algo de afuera** (fuentes, un video, un formulario), hay que
  agregar ese dominio a la CSP de las cinco páginas. Si no, no carga.
- **Contenido dinámico:** se arma con elementos del DOM y `textContent`, nunca con
  `innerHTML` y datos.
- **Almacenamiento en el navegador:** solo `creax-intro` en `sessionStorage`, para no
  repetir la intro. Nunca datos personales ni tokens.
- **Enlaces que abren pestaña nueva:** siempre con `rel="noopener"`.
- **Pendiente para cuando haya dominio y hosting propio:** encabezados HTTP que GitHub
  Pages no permite poner, como `frame-ancestors` (evitar que otra web la muestre dentro
  de un marco), `X-Content-Type-Options` y `Strict-Transport-Security`.
