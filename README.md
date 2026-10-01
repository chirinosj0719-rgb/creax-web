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

Los tres ejemplos (`assets/ejemplos/`: repostería, clínica dental y gimnasio) son negocios de muestra, no clientes.
Están hechos a mano y cada uno tiene su propio estilo de diseño (editorial, limpio y oscuro), para mostrar variedad.
Sus fotos son libres (CC0); los créditos están en cada carpeta `fotos/CREDITOS.txt`.

Las cuatro páginas internas abren con una **cabecera viva**: la palabra clave del título en un bloque de tinta
y, al lado, un dibujo que se mueve para explicar la página (la ventana que arma los cuatro niveles de web,
el flujo que recorre un mensaje, la página que se dibuja a lápiz en tres estilos y los cuatro socios como
los bloques del logo). El dibujo es SVG dentro de cada página, sus estilos están al final de `estilos.css`
("CABECERAS VIVAS") y su movimiento en la sección 17 de `animacion.js`. Sin movimiento queda quieto.
Los íconos que van dentro de esos dibujos se escriben por su código; por eso cada página los nombra en un
comentario justo antes del dibujo, para que `aligerar.py` no los saque de la fuente.

## Pendiente

- Datos de contacto reales: correo, Instagram y LinkedIn (marcados con `<!-- CONTACTO -->` en cada página). El WhatsApp ya es el de Juan Diego.
- Quitar el `noindex` cuando se publique como web oficial, con el dominio propio.

## Cómo se trabaja

Es HTML, CSS y JavaScript sin compilación: se abre `index.html` en el navegador.
Estilos en `estilos.css`, movimiento e interacción en `animacion.js` (usa anime.js, copiado en `assets/`).
`capturas.js` saca las capturas de los tres ejemplos que usan la portada y Bocetos: con la web servida en local
(`python -m http.server 8094`), se corre `node capturas.js`. Si se cambia un ejemplo, se vuelve a correr.

Cada vez que se publica, se cambia el número `?v=` de `estilos.css`, `animacion.js`, `inicio.js` e `iconos.css` en las ocho páginas (las cinco, privacidad, términos y 404):
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
- **Almacenamiento en el navegador:** `creax-intro` en `sessionStorage`, para no repetir la
  intro, y `creax-cookies` en `localStorage`, con la elección del aviso de cookies. Ninguna
  cookie. Nunca datos personales ni tokens.
- **HTTPS:** GitHub Pages lo fuerza; además `inicio.js` pasa a `https` si alguien entra por `http`.
- **Enlaces que abren pestaña nueva:** siempre con `rel="noopener"`.
- **Pendiente para cuando haya dominio y hosting propio:** encabezados HTTP que GitHub
  Pages no permite poner, como `frame-ancestors` (evitar que otra web la muestre dentro
  de un marco), `X-Content-Type-Options` y `Strict-Transport-Security`.

## Lanzamiento (30/09/2026)

- **Páginas legales:** `privacidad.html` y `terminos.html`, enlazadas desde el pie. Los datos de la
  empresa (razón social, RUC, domicilio) se completan cuando esté constituida. Conviene que un abogado
  las revise antes de la web oficial.
- **Aviso de cookies:** lo arma `animacion.js` (5d). La web no usa cookies; el aviso lo explica y guarda
  la elección. «Cookies», en el pie, lo vuelve a abrir. No sale con `?estatico`.
- **Tarjeta «Cuéntanos de tu proyecto»** (portada): valida cada campo y arma el mensaje de WhatsApp;
  no guarda ni envía nada. Antispam: un campo trampa invisible y un tiempo mínimo antes de enviar.
- **Buscadores y redes:** cada página tiene título, descripción y etiquetas Open Graph y Twitter, con
  `assets/social.png` (1200×630). Hay `sitemap.xml`, `robots.txt`, `site.webmanifest` e íconos
  (`favicon-32.png`, `apple-touch-icon.png`, `icono-192.png`, `icono-512.png`).
- **Página 404:** `404.html` lleva `<base href="/creax-web/">` para funcionar desde cualquier dirección.
- **Velocidad:** las fuentes van en WOFF2 y solo con los caracteres del español, y los íconos, solo los
  que se usan. **Si se agrega un ícono nuevo, correr `python aligerar.py`** (si no, no se ve).
- **El día que se compre el dominio:**
  - quitar el `noindex` de las páginas;
  - cambiar `https://chirinosj0719-rgb.github.io/creax-web/` por el dominio en las etiquetas Open
    Graph, en `sitemap.xml` y en `robots.txt`, y el `<base>` de `404.html` a `"/"`;
  - en GitHub, Settings → Pages: marcar «Enforce HTTPS» para el dominio.
  Mientras la web viva en `github.io/creax-web`, el `robots.txt` no cuenta: los buscadores lo leen solo
  en la raíz del dominio.
- **Analítica:** pendiente de elegir proveedor. Si usa cookies, se carga solo cuando la persona acepta
  en el aviso (`creax-cookies` = `todas`), y hay que sumar su dominio a la CSP.
