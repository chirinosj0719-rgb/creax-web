/* =============================================================================
   inicio.js · lo primero que corre en cada página (va en el <head>, sin defer).
   Antes estaba escrito dentro del HTML de las cinco páginas. Se sacó a este archivo
   para que la política de seguridad (CSP) pueda prohibir los scripts escritos
   dentro de la página, que es por donde entra una inyección de código (XSS).
   ========================================================================== */
/* siempre por HTTPS: si alguien entra por http, se pasa a https. GitHub Pages ya lo hace;
   esto lo asegura también cuando la web tenga su dominio propio. En la PC (localhost) no aplica. */
if (location.protocol === "http:" && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
  location.replace("https:" + location.href.slice(location.protocol.length));
}
document.documentElement.classList.add("con-js");
/* la intro del logo: una vez por visita, y nunca si pidieron menos movimiento o es una captura */
try {
  if (!sessionStorage.getItem("creax-intro") && !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      location.search.indexOf("estatico") < 0) {
    document.documentElement.classList.add("con-intro");
    setTimeout(function () { document.documentElement.classList.remove("con-intro"); }, 5000);
  }
} catch (e) {}
