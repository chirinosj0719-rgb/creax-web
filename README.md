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

Cada vez que se publica, se cambia el número `?v=` de `estilos.css` y `animacion.js` en las cinco páginas:
así el navegador de quien entra baja los estilos nuevos en vez de usar los que tenía guardados.
