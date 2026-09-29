/* =============================================================================
   CreaX · movimiento de la web, con anime.js v4
   Cada animación tiene un motivo: guiar la lectura, mostrar que el boceto se
   adapta a cada rubro y explicar cómo viaja la información en un flujo.
   Si el visitante pidió menos movimiento, todo queda quieto.
   "?estatico" en la dirección también deja la página sin movimiento.
   ========================================================================== */

(function () {
  "use strict";

  var A = window.anime;
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || location.search.indexOf("estatico") > -1
    || !A;

  var salida = A ? A.cubicBezier(0.16, 1, 0.3, 1) : "linear";
  var rebote = A ? A.cubicBezier(0.34, 1.56, 0.64, 1) : "linear";

  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------
     1. La barra flotante se apoya cuando el visitante deja la portada
     -------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  if (nav && "IntersectionObserver" in window) {
    var centinela = document.createElement("div");
    centinela.setAttribute("aria-hidden", "true");
    centinela.style.cssText = "position:absolute;top:90px;left:0;height:1px;width:1px;pointer-events:none;";
    document.body.prepend(centinela);
    new IntersectionObserver(function (entradas) {
      nav.classList.toggle("encogida", !entradas[0].isIntersecting);
    }).observe(centinela);
  }

  /* --------------------------------------------------------------
     2. El titular se parte en palabras para poder escalonarlo
     -------------------------------------------------------------- */
  var titular = document.getElementById("titular");
  var piezas = [];
  if (titular) {
    var palabras = titular.textContent.trim().split(/\s+/);
    titular.textContent = "";
    palabras.forEach(function (palabra, i) {
      var linea = document.createElement("span");
      linea.className = "linea-palabra";
      var pieza = document.createElement("span");
      pieza.className = "pieza";
      pieza.textContent = palabra;
      var acentos = parseInt(titular.dataset.acento || "1", 10);
      if (i >= palabras.length - acentos) pieza.classList.add("acento");
      linea.appendChild(pieza);
      titular.appendChild(linea);
      titular.appendChild(document.createTextNode(" "));
      piezas.push(pieza);
    });
  }

  /* --------------------------------------------------------------
     5. Los pasos del método se encienden al llegar a la pantalla
     -------------------------------------------------------------- */
  var pasos = document.querySelectorAll(".paso");
  if (pasos.length && "IntersectionObserver" in window) {
    var mirón = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        entrada.target.classList.toggle("activo", entrada.isIntersecting);
      });
    }, { rootMargin: "-38% 0px -38% 0px" });
    pasos.forEach(function (paso) { mirón.observe(paso); });
  }

  /* --------------------------------------------------------------
     5b. Luz que sigue al cursor, en las tarjetas y en la portada
     -------------------------------------------------------------- */
  document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
    tarjeta.addEventListener("pointermove", function (evento) {
      var caja = tarjeta.getBoundingClientRect();
      tarjeta.style.setProperty("--mx", (evento.clientX - caja.left) + "px");
      tarjeta.style.setProperty("--my", (evento.clientY - caja.top) + "px");
    });
  });
  var portada = document.querySelector(".portada");
  if (portada) {
    portada.addEventListener("pointermove", function (evento) {
      var caja = portada.getBoundingClientRect();
      portada.style.setProperty("--gx", (evento.clientX - caja.left) + "px");
      portada.style.setProperty("--gy", (evento.clientY - caja.top) + "px");
    });
  }

  /* --------------------------------------------------------------
     5c. ¿Cuál le toca?: tres preguntas y la tabla marca la respuesta
     -------------------------------------------------------------- */
  var elegidor = document.getElementById("elegidor");
  if (elegidor) {
    var respuestas = {};
    var PLANES = {
      presentacion: { columna: 1, nombre: "Web de presentación",
        porque: "El cliente necesita entender qué hace el negocio y escribirle. Con la web de presentación y el botón directo al WhatsApp alcanza." },
      pedidos: { columna: 2, nombre: "Web con pedidos",
        porque: "El cliente arma su pedido en la web y llega completo al WhatsApp. Se cobra como hoy, sin comisiones de pasarela." },
      tienda: { columna: 3, nombre: "Tienda en línea",
        porque: "El cliente paga en la misma web y el stock se descuenta solo. Conviene cuando el volumen justifica la pasarela de pago." }
    };
    var tablaComparacion = document.getElementById("tablaComparacion");
    var veredictoNombre = document.getElementById("veredictoNombre");
    var veredictoPorque = document.getElementById("veredictoPorque");

    var decidir = function () {
      var clave = "presentacion";
      if (respuestas.cobro === "web") clave = "tienda";
      else if (respuestas.vende === "productos" && respuestas.volumen === "muchos") clave = "tienda";
      else if (respuestas.vende === "productos") clave = "pedidos";
      var plan = PLANES[clave];
      var extra = (clave !== "tienda" && respuestas.volumen !== "pocos")
        ? " Con ese volumen, conviene sumarle la automatización de WhatsApp." : "";
      veredictoNombre.textContent = plan.nombre;
      veredictoPorque.textContent = plan.porque + extra;
      if (tablaComparacion) {
        tablaComparacion.querySelectorAll("tr").forEach(function (fila) {
          Array.prototype.forEach.call(fila.children, function (celda, i) {
            celda.classList.toggle("col-activa", i === plan.columna);
          });
        });
      }
      if (!quieto) A.animate(veredictoNombre, { opacity: [0, 1], y: [12, 0], duration: 520, ease: salida });
    };

    elegidor.querySelectorAll(".pregunta").forEach(function (grupo) {
      var clave = grupo.dataset.pregunta;
      var botones = grupo.querySelectorAll(".opcion");
      botones.forEach(function (boton) {
        if (boton.getAttribute("aria-pressed") === "true") respuestas[clave] = boton.dataset.valor;
        boton.addEventListener("click", function () {
          botones.forEach(function (otro) { otro.setAttribute("aria-pressed", "false"); });
          boton.setAttribute("aria-pressed", "true");
          respuestas[clave] = boton.dataset.valor;
          decidir();
        });
      });
    });
    decidir();
  }

  /* --------------------------------------------------------------
     5d. El flujo cambia según el rubro, y cada paso se explica al tocarlo
     -------------------------------------------------------------- */
  var FLUJOS = {
    general: [
      ["Llega un mensaje", "WhatsApp, Instagram o el formulario de la web", "Todo lo que escriben entra por el mismo lado, venga de donde venga."],
      ["El sistema decide qué hacer", "Según el horario, el producto o el tipo de consulta", "Las reglas son las del negocio: qué se responde solo y qué necesita a una persona."],
      ["Responde y registra", "Contesta al cliente y anota el pedido donde corresponde", "El cliente recibe la respuesta al momento y el pedido queda anotado, sin copiarlo."],
      ["Avisa al equipo", "El encargado recibe el pedido listo para atender", "Llega un aviso con todo lo que hace falta: nadie tiene que volver a preguntar."]
    ],
    tienda: [
      ["Preguntan si hay stock", "Por Instagram, con la foto de un producto", "La consulta más repetida del día, contestada sin que nadie tenga que leerla."],
      ["Revisa el inventario", "Talla, color y cantidad disponibles", "Responde con lo que de verdad hay, no con lo que había la semana pasada."],
      ["Arma el pedido", "Datos de entrega y enlace de pago en un mensaje", "El cliente paga y el pedido queda registrado con su estado."],
      ["Avisa el despacho", "El cliente recibe el aviso cuando sale su envío", "Se terminan los «¿ya salió mi pedido?» en el chat."]
    ],
    servicios: [
      ["Llega una consulta", "Por WhatsApp, Instagram o la web", "El cliente cuenta su caso con sus palabras, a la hora que sea."],
      ["Ordena el caso", "Pide los datos que faltan: servicio, fecha y presupuesto", "Antes de hablar con el cliente, ya se sabe qué necesita."],
      ["Agenda la llamada", "Ofrece horarios libres y la deja en el calendario", "Sin idas y vueltas para cuadrar una reunión."],
      ["Hace el seguimiento", "Si el cliente no responde, le escribe a los días", "Ninguna oportunidad se enfría por falta de seguimiento."]
    ],
    consultorio: [
      ["Un paciente pide cita", "Por WhatsApp o desde la web", "Escribe como le escribiría a una persona; el sistema entiende qué necesita."],
      ["Revisa la agenda", "Ofrece los horarios que están libres", "Solo aparecen los espacios que de verdad están disponibles."],
      ["Reserva y registra", "La cita queda en la agenda y en la ficha del paciente", "Sin llamadas: el paciente elige y queda reservado."],
      ["Recuerda un día antes", "El paciente confirma o reprograma con un toque", "Menos ausencias, y se sabe con tiempo si se libera un espacio."]
    ]
  };
  var nodosFlujo = document.querySelectorAll(".nodo");
  var nodoDetalle = document.getElementById("nodoDetalle");
  var flujoActual = "general";
  if (nodosFlujo.length && nodoDetalle) {
    var pintarFlujo = function (clave) {
      flujoActual = clave;
      nodosFlujo.forEach(function (nodo, i) {
        var datos = FLUJOS[clave][i];
        if (!datos) return;
        nodo.classList.add("cambiando");
        setTimeout(function () {
          nodo.querySelector("b").textContent = datos[0];
          nodo.querySelector("span").textContent = datos[1];
          nodo.classList.remove("cambiando");
        }, quieto ? 0 : 220 + i * 70);
      });
      nodoDetalle.innerHTML = "<b>Toca un paso</b> para ver qué pasa ahí.";
    };
    var pestanasFlujo = document.querySelectorAll(".pestana[data-flujo]");
    pestanasFlujo.forEach(function (boton) {
      boton.addEventListener("click", function () {
        pestanasFlujo.forEach(function (otra) { otra.setAttribute("aria-selected", "false"); });
        boton.setAttribute("aria-selected", "true");
        pintarFlujo(boton.dataset.flujo);
      });
    });
    nodosFlujo.forEach(function (nodo, i) {
      nodo.setAttribute("tabindex", "0");
      var explicar = function () {
        var datos = FLUJOS[flujoActual][i];
        nodoDetalle.innerHTML = "<b>" + (i + 1) + ". " + datos[0] + ".</b> " + datos[2];
      };
      nodo.addEventListener("click", explicar);
      nodo.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); explicar(); }
      });
    });
  }

  /* --------------------------------------------------------------
     5e. Los socios se abren al tocarlos (en el celular no hay cursor)
     -------------------------------------------------------------- */
  document.querySelectorAll(".socio").forEach(function (socio) {
    var alternar = function () { socio.classList.toggle("abierto"); };
    socio.addEventListener("click", alternar);
    socio.addEventListener("keydown", function (evento) {
      if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); alternar(); }
    });
  });

  /* --------------------------------------------------------------
     5f. La escena de la portada rota: panadería, gimnasio y dentista,
         una a la vez, con la pantalla y la conversación de cada una
     -------------------------------------------------------------- */
  var ESCENAS = {
    panaderia: { nombre: "Panadería", icono: "ph-bread", color: "color-servicios",
      pregunta: "Hola, ¿tienen torta de chocolate para hoy?", respuesta: "¡Hola! Sí, te muestro lo que tenemos listo:",
      icono1: "ph-cake", opcion1: "Torta de chocolate", icono2: "ph-bread", opcion2: "Pan del día",
      eleccion: "Quiero la torta, para recoger a las 6", listo: "Pedido anotado", detalle: "Listo para las 6:00 p. m., sin copiar nada a mano" },
    gimnasio: { nombre: "Gimnasio", icono: "ph-barbell", color: "color-automatizaciones",
      pregunta: "Hola, ¿qué planes tienen?", respuesta: "¡Hola! Estos son los más pedidos:",
      icono1: "ph-calendar-check", opcion1: "Plan mensual", icono2: "ph-person-simple-run", opcion2: "Clases grupales",
      eleccion: "Quiero el mensual, ¿cómo me inscribo?", listo: "Inscripción registrada", detalle: "Ya está en la lista, sin llenar nada a mano" },
    dentista: { nombre: "Dentista", icono: "ph-tooth", color: "color-nosotros",
      pregunta: "Hola, ¿tienen cita para limpieza esta semana?", respuesta: "¡Hola! Estos son los horarios libres:",
      icono1: "ph-calendar-check", opcion1: "Jueves, 10:00 a. m.", icono2: "ph-calendar-check", opcion2: "Viernes, 4:00 p. m.",
      eleccion: "El jueves, por favor", listo: "Cita reservada", detalle: "Jueves a las 10:00 a. m., con recordatorio un día antes" }
  };
  var escenaPortada = document.getElementById("escena");
  var fonoPortada = document.getElementById("fono");
  if (escenaPortada && fonoPortada && !quieto) {
    var ordenEscenas = ["panaderia", "gimnasio", "dentista"];
    var escenaActual = 0;
    var pantallasEscena = escenaPortada.querySelectorAll(".ventana-pantallas img");
    var rubroEscena = document.getElementById("escenaRubro");
    var COLORES = ["color-servicios", "color-automatizaciones", "color-nosotros"];
    var pintarEscena = function (clave) {
      var datos = ESCENAS[clave];
      pantallasEscena.forEach(function (img) { img.classList.toggle("activa", img.dataset.rubro === clave); });
      rubroEscena.textContent = datos.nombre;
      COLORES.forEach(function (c) { rubroEscena.classList.remove(c); });
      rubroEscena.classList.add(datos.color);
      fonoPortada.classList.add("cambiando");
      setTimeout(function () {
        COLORES.forEach(function (c) { fonoPortada.classList.remove(c); });
        fonoPortada.classList.add(datos.color);
        document.getElementById("chatNombre").textContent = datos.nombre;
        document.getElementById("chatIcono").className = "ph " + datos.icono;
        fonoPortada.querySelectorAll("[data-campo]").forEach(function (el) {
          var campo = el.dataset.campo;
          if (campo.indexOf("icono") === 0) el.className = "ph " + datos[campo];
          else el.textContent = datos[campo];
        });
        fonoPortada.classList.remove("cambiando");
      }, 380);
    };
    rubroEscena.classList.add(ESCENAS.panaderia.color);
    setInterval(function () {
      if (document.hidden) return;
      escenaActual = (escenaActual + 1) % ordenEscenas.length;
      pintarEscena(ordenEscenas[escenaActual]);
    }, 4800);
  } else if (escenaPortada) {
    var chipRubro = document.getElementById("escenaRubro");
    if (chipRubro) chipRubro.classList.add("color-servicios");
  }

  /* --------------------------------------------------------------
     5g. La conversación de la laptop avanza a medida que se baja
     -------------------------------------------------------------- */
  var pistaConversacion = document.getElementById("conversacionPista");
  var mensajesConversacion = document.querySelectorAll("#convMensajes [data-paso]");
  var contadorConversacion = document.getElementById("convContador");
  if (pistaConversacion && mensajesConversacion.length) {
    var totalMensajes = mensajesConversacion.length;
    var visibles = 0;
    var mostrarHasta = function (n) {
      if (n === visibles) return;
      mensajesConversacion.forEach(function (msj, i) {
        var toca = i < n;
        if (toca && !msj.classList.contains("visto")) {
          msj.classList.add("visto");
          if (!quieto && msj.classList.contains("asistente") && i === n - 1) {
            msj.classList.add("escribiendo");
            setTimeout(function () { msj.classList.remove("escribiendo"); }, 750);
          }
        } else if (!toca) {
          msj.classList.remove("visto", "escribiendo");
        }
      });
      visibles = n;
      if (contadorConversacion) contadorConversacion.textContent = n;
    };
    if (quieto) {
      document.documentElement.classList.add("sin-movimiento");
      mostrarHasta(totalMensajes);
    } else {
      var esperando = false;
      var segunScroll = function () {
        esperando = false;
        var caja = pistaConversacion.getBoundingClientRect();
        var recorrido = caja.height - window.innerHeight;
        var avance = recorrido > 0 ? Math.min(1, Math.max(0, -caja.top / recorrido)) : 1;
        mostrarHasta(Math.max(1, Math.min(totalMensajes, Math.ceil(avance * totalMensajes))));
      };
      window.addEventListener("scroll", function () {
        if (!esperando) { esperando = true; requestAnimationFrame(segunScroll); }
      }, { passive: true });
      segunScroll();
    }
  }

  /* --------------------------------------------------------------
     5h. Plan Cuidado: cada opción muestra su vista en el panel
     -------------------------------------------------------------- */
  var opcionesCuidado = document.querySelectorAll(".cuidado-opcion");
  var vistasCuidado = document.querySelectorAll(".panel-vista");
  if (opcionesCuidado.length && vistasCuidado.length) {
    var elegirVista = function (clave) {
      opcionesCuidado.forEach(function (o) { o.setAttribute("aria-selected", o.dataset.vista === clave ? "true" : "false"); });
      vistasCuidado.forEach(function (v) { v.classList.toggle("activa", v.dataset.vista === clave); });
    };
    var tocadoCuidado = false;
    opcionesCuidado.forEach(function (opcion) {
      opcion.addEventListener("click", function () { tocadoCuidado = true; elegirVista(opcion.dataset.vista); });
    });
    if (!quieto) {                            // mientras nadie la toque, la interfaz se muestra sola
      var ordenCuidado = ["mantenimiento", "cambios", "reporte"];
      var pasoCuidado = 0;
      setInterval(function () {
        if (tocadoCuidado || document.hidden) return;
        pasoCuidado = (pasoCuidado + 1) % ordenCuidado.length;
        elegirVista(ordenCuidado[pasoCuidado]);
      }, 5200);
    }
  }

  /* ==============================================================
     De acá para abajo, solo si hay movimiento permitido
     ============================================================== */
  if (quieto) {
    document.documentElement.classList.remove("con-intro");
    document.querySelectorAll(".revelar").forEach(function (el) { el.style.opacity = "1"; });
    return;
  }

  /* --------------------------------------------------------------
     5z. La intro: los bloques se arman, el cursor arrastra el último a
         su lugar, aparece CreaX y la cortina sube. Una vez por visita;
         un clic la salta. La portada arranca recién cuando termina.
     -------------------------------------------------------------- */
  var raiz = document.documentElement;
  var intro = document.getElementById("intro");
  var conIntro = !!intro && raiz.classList.contains("con-intro");
  var alTerminarIntro = [];
  var introTerminada = !conIntro;
  var tareasHechas = false;
  var correrTareas = function () {            // la portada empieza a entrar mientras sube la cortina
    if (tareasHechas) return;
    tareasHechas = true;
    alTerminarIntro.forEach(function (tarea) { tarea(); });
  };
  var terminarIntro = function () {
    if (introTerminada) return;
    introTerminada = true;
    raiz.classList.remove("con-intro");
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    try { sessionStorage.setItem("creax-intro", "1"); } catch (e) { /* sin memoria de sesión: se verá otra vez */ }
    correrTareas();
  };
  if (conIntro) {
    A.createTimeline({ defaults: { ease: salida }, onComplete: terminarIntro })
      .add("#intro .ib", { opacity: [0, 1], scale: [0, 1], duration: 640, delay: A.stagger(90), ease: rebote }, 100)
      .add("#intro .ranura", { opacity: [0, 1], duration: 420 }, 480)
      .add("#intro .arrastre", { x: [58, 0], y: [58, 0], rotate: [-14, 0], duration: 950 }, 640)
      .add("#intro .arrastre", { scale: [1, 0.92, 1], duration: 300, ease: "outQuad" }, 1600)
      .add("#intro .intro-palabra", { opacity: [0, 1], y: [22, 0], duration: 650 }, 1450)
      .call(correrTareas, 2300)
      .add("#intro", { y: ["0%", "-100%"], duration: 760, ease: "inOutQuart" }, 2350);
    intro.addEventListener("click", terminarIntro);
    setTimeout(terminarIntro, 4300);        // red de seguridad: la página nunca queda tapada
  } else if (intro && intro.parentNode) {
    intro.parentNode.removeChild(intro);
  }

  /* --------------------------------------------------------------
     6. Entrada de la portada, de arriba hacia abajo
     -------------------------------------------------------------- */
  var hayPortada = !!document.querySelector(".portada");
  var entrada = hayPortada ? A.createTimeline({ defaults: { ease: salida, duration: 900 }, autoplay: !conIntro }) : null;
  if (hayPortada && conIntro) {
    entrada.seek(0);                          // bajo la cortina, la portada espera en su punto de partida
    alTerminarIntro.push(function () { entrada.play(); });
  }
  if (hayPortada) entrada
    .add(piezas, { opacity: [0, 1], y: ["105%", "0%"], rotate: [4, 0], delay: A.stagger(80) }, 120)
    .add(".portada .entrada", { opacity: [0, 1], y: [18, 0] }, 480)
    .add(".portada .acciones .boton", { opacity: [0, 1], y: [16, 0], delay: A.stagger(80) }, 600)
    .add(".escena-grande .ventana", { opacity: [0, 1], y: [56, 0], scale: [0.985, 1], duration: 1150 }, 340)
    .add(".escena-grande .fono", { opacity: [0, 1], y: [44, 0], duration: 1000 }, 560)
    .add(".escena-grande .dato", { opacity: [0, 1], scale: [0.88, 1], delay: A.stagger(120), ease: rebote }, 820)
    .add(".escena-grande .marca-flotante", { opacity: [0, 1], scale: [0.72, 1], delay: A.stagger(110), ease: rebote }, 960);

  /* --------------------------------------------------------------
     7. Las tarjetas flotan: la escena se siente viva
     -------------------------------------------------------------- */
  if (hayPortada) {
  A.animate(".dato-1", { y: [0, -10], duration: 3400, loop: true, alternate: true, ease: "inOutQuad" });
  A.animate(".dato-2", { y: [0, 9], duration: 3900, delay: 350, loop: true, alternate: true, ease: "inOutQuad" });
  A.animate(".dato-3", { y: [0, -8], duration: 4300, delay: 700, loop: true, alternate: true, ease: "inOutQuad" });
  A.animate(".marca-1", { y: [0, -11], duration: 4600, delay: 200, loop: true, alternate: true, ease: "inOutQuad" });
  A.animate(".marca-2", { y: [0, 10], duration: 5200, delay: 600, loop: true, alternate: true, ease: "inOutQuad" });
  A.animate(".marca-3", { y: [0, -9], duration: 4900, delay: 900, loop: true, alternate: true, ease: "inOutQuad" });
  }

  /* --------------------------------------------------------------
     8. Cada bloque aparece cuando entra en pantalla
     -------------------------------------------------------------- */
  var porRevelar = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    var cola = [];
    var vaciando = null;
    var observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        obs.unobserve(entrada.target);
        cola.push(entrada.target);
        clearTimeout(vaciando);
        vaciando = setTimeout(function () {
          var lote = cola.slice();
          cola.length = 0;
          A.animate(lote, {
            opacity: [0, 1], y: [26, 0], duration: 760, delay: A.stagger(70), ease: salida
          });
        }, 60);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    porRevelar.forEach(function (el) { observador.observe(el); });
  }

  /* --------------------------------------------------------------
     9. Cinta de rubros: avance continuo, sin cortes
     -------------------------------------------------------------- */
  var cinta = document.getElementById("cinta");
  if (cinta) {
    cinta.innerHTML += cinta.innerHTML;          // se duplica para que el bucle no tenga costura
    var marcha = A.animate(cinta, { x: ["0%", "-50%"], duration: 38000, loop: true, ease: "linear" });
    cinta.parentElement.addEventListener("pointerenter", function () { marcha.pause(); });
    cinta.parentElement.addEventListener("pointerleave", function () { marcha.play(); });
  }

  /* --------------------------------------------------------------
     10. Flujo de n8n: el pulso recorre los pasos, uno detrás de otro
     -------------------------------------------------------------- */
  var nodos = document.querySelectorAll(".nodo");
  if (nodos.length) {
    var pulso = A.createTimeline({ loop: true, defaults: { duration: 620, ease: salida } });
    nodos.forEach(function (nodo, i) {
      pulso
        .call(function () {
          nodos.forEach(function (otro) { otro.classList.remove("viva"); });
          nodo.classList.add("viva");
        }, i * 900)
        .add(nodo, { scale: [1, 1.022, 1] }, i * 900);
    });
    pulso.call(function () {
      nodos.forEach(function (otro) { otro.classList.remove("viva"); });
    }, nodos.length * 900 + 500);
  }

  /* --------------------------------------------------------------
     11. Botones magnéticos: siguen al cursor apenas un poco
     -------------------------------------------------------------- */
  document.querySelectorAll(".boton-principal, .pestana").forEach(function (boton) {
    var iman = A.createAnimatable(boton, { x: 420, y: 420, ease: salida });
    boton.addEventListener("pointermove", function (evento) {
      var caja = boton.getBoundingClientRect();
      iman.x((evento.clientX - caja.left - caja.width / 2) * 0.28);
      iman.y((evento.clientY - caja.top - caja.height / 2) * 0.34);
    });
    boton.addEventListener("pointerleave", function () { iman.x(0); iman.y(0); });
  });

  /* --------------------------------------------------------------
     12. Las tarjetas se inclinan apenas hacia el cursor
     -------------------------------------------------------------- */
  document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
    var giro = A.createAnimatable(tarjeta, { rotateX: 500, rotateY: 500, ease: salida });
    tarjeta.addEventListener("pointermove", function (evento) {
      var caja = tarjeta.getBoundingClientRect();
      var px = (evento.clientX - caja.left) / caja.width - 0.5;
      var py = (evento.clientY - caja.top) / caja.height - 0.5;
      giro.rotateX(py * -3);
      giro.rotateY(px * 4);
    });
    tarjeta.addEventListener("pointerleave", function () { giro.rotateX(0); giro.rotateY(0); });
  });

  /* --------------------------------------------------------------
     13. La escena de la portada sigue al cursor, por capas
     -------------------------------------------------------------- */
  var escenaGrande = document.querySelector(".escena-grande");
  if (escenaGrande && portada && window.matchMedia("(min-width: 900px)").matches) {
    portada.addEventListener("pointermove", function (evento) {
      var caja = portada.getBoundingClientRect();
      escenaGrande.style.setProperty("--px", (((evento.clientX - caja.left) / caja.width) - 0.5) * 2);
      escenaGrande.style.setProperty("--py", (((evento.clientY - caja.top) / caja.height) - 0.5) * 2);
    });
    portada.addEventListener("pointerleave", function () {
      escenaGrande.style.setProperty("--px", 0);
      escenaGrande.style.setProperty("--py", 0);
    });
  }

  /* --------------------------------------------------------------
     14. La constelación de bocetos se inclina hacia el cursor
     -------------------------------------------------------------- */
  var constelacion = document.getElementById("constelacion");
  if (constelacion && window.matchMedia("(min-width: 1000px)").matches) {
    var giroConstelacion = A.createAnimatable(constelacion, { rotateY: 900, rotateX: 900, ease: salida });
    var zonaConstelacion = constelacion.closest(".rubros-escenario") || constelacion;
    zonaConstelacion.addEventListener("pointermove", function (evento) {
      var caja = zonaConstelacion.getBoundingClientRect();
      giroConstelacion.rotateY((((evento.clientX - caja.left) / caja.width) - 0.5) * 9);
      giroConstelacion.rotateX((((evento.clientY - caja.top) / caja.height) - 0.5) * -7);
    });
    zonaConstelacion.addEventListener("pointerleave", function () {
      giroConstelacion.rotateY(0);
      giroConstelacion.rotateX(0);
    });
  }
})();
