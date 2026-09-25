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
      if (i === palabras.length - 1) pieza.classList.add("acento");
      linea.appendChild(pieza);
      titular.appendChild(linea);
      titular.appendChild(document.createTextNode(" "));
      piezas.push(pieza);
    });
  }

  /* --------------------------------------------------------------
     3. Rotación de bocetos: demuestra que la solución se adapta al rubro
     -------------------------------------------------------------- */
  var BOCETOS = {
    panaderia: {
      imagen: "assets/boceto-panaderia.png",
      alt: "Boceto de la web de una panadería, visto en un celular",
      puntos: [
        "Carta con sus fotos y sus precios, lista para pedir",
        "El pedido llega armado al WhatsApp, sin audios",
        "Galería, horario y ubicación del local"
      ]
    },
    dental: {
      imagen: "assets/boceto-dental.png",
      alt: "Boceto de la web de una clínica dental, visto en un celular",
      puntos: [
        "Cada tratamiento con lo que incluye y cuánto cuesta",
        "La cita se reserva por WhatsApp, sin llamadas",
        "El consultorio por dentro, horarios y cómo llegar"
      ]
    },
    gimnasio: {
      imagen: "assets/boceto-gimnasio.png",
      alt: "Boceto de la web de un gimnasio, visto en un celular",
      puntos: [
        "Planes, clases y precios en una sola pantalla",
        "Inscripción y consultas directo por WhatsApp",
        "Fotos del local, horarios y cómo llegar"
      ]
    }
  };
  Object.keys(BOCETOS).forEach(function (clave) {
    var previa = new Image();
    previa.src = BOCETOS[clave].imagen;
  });

  /* --------------------------------------------------------------
     4. Pestañas de la muestra: cambian la pantalla y lo que se lista
     -------------------------------------------------------------- */
  var pestanas = document.querySelectorAll(".pestana[data-boceto]");
  var pantalla = document.getElementById("bocetoMuestra");
  var lista = document.getElementById("muestraLista");

  function pintarBoceto(clave) {
    var datos = BOCETOS[clave];
    if (!datos || !pantalla) return;

    if (quieto) {
      pantalla.src = datos.imagen;
      pantalla.alt = datos.alt;
    } else {
      A.animate(pantalla, {
        opacity: [1, 0], scale: [1, 0.985], duration: 220, ease: salida,
        onComplete: function () {
          pantalla.src = datos.imagen;
          pantalla.alt = datos.alt;
          A.animate(pantalla, { opacity: [0, 1], scale: [0.985, 1], duration: 420, ease: salida });
        }
      });
    }

    if (lista) {
      lista.innerHTML = "";
      datos.puntos.forEach(function (punto) {
        var li = document.createElement("li");
        li.textContent = punto;
        lista.appendChild(li);
      });
      if (!quieto) {
        A.animate(lista.querySelectorAll("li"), {
          opacity: [0, 1], x: [-10, 0], duration: 460, delay: A.stagger(70), ease: salida
        });
      }
    }
  }

  pestanas.forEach(function (boton) {
    boton.addEventListener("click", function () {
      pestanas.forEach(function (otra) { otra.setAttribute("aria-selected", "false"); });
      boton.setAttribute("aria-selected", "true");
      pintarBoceto(boton.dataset.boceto);
    });
  });

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
      ["n8n decide qué hacer", "Según el horario, el producto o el tipo de consulta", "Las reglas son las del negocio: qué se responde solo y qué necesita a una persona."],
      ["Responde y registra", "Contesta al cliente y anota el pedido donde corresponde", "El cliente recibe la respuesta al momento y el pedido queda en la hoja, sin copiarlo."],
      ["Avisa al equipo", "El encargado recibe el pedido listo para atender", "Llega un aviso con todo lo que hace falta: nadie tiene que volver a preguntar."]
    ],
    panaderia: [
      ["Piden una torta por WhatsApp", "A las once de la noche, con el local cerrado", "El mensaje entra aunque no haya nadie mirando el celular."],
      ["n8n revisa la anticipación", "Las tortas se piden con un día de anticipación", "Si llega a tiempo, sigue; si no, ofrece lo que hay listo para mañana."],
      ["Confirma y anota", "Hora de recojo, total y datos en la hoja del día", "El cliente recibe la confirmación con el total y el pedido entra a la lista de producción."],
      ["Avisa a cocina", "La lista de mañana llega ordenada a primera hora", "Temprano, el equipo ya sabe qué hornear y para qué hora."]
    ],
    consultorio: [
      ["Un paciente pide cita", "Por WhatsApp o desde la web del consultorio", "Escribe como le escribiría a una persona; el flujo entiende qué necesita."],
      ["n8n mira la agenda", "Ofrece los horarios libres de Google Calendar", "Solo aparecen los espacios que de verdad están disponibles."],
      ["Reserva y registra", "La cita queda en la agenda y en la ficha del paciente", "Sin llamadas ni idas y vueltas: el paciente elige y queda reservado."],
      ["Recuerda un día antes", "El paciente confirma o reprograma con un toque", "Menos ausencias, y el consultorio sabe con tiempo si se libera un espacio."]
    ],
    tienda: [
      ["Preguntan si hay stock", "Por Instagram, con la foto de un producto", "La consulta más repetida del día, contestada sin que nadie tenga que leerla."],
      ["n8n consulta el inventario", "Revisa talla, color y cantidad en la hoja de stock", "Responde con lo que de verdad hay, no con lo que había la semana pasada."],
      ["Arma el pedido", "Datos de entrega y enlace de pago en un mensaje", "El cliente paga y el pedido queda registrado con su estado."],
      ["Avisa el despacho", "El cliente recibe el aviso cuando sale su envío", "Se terminan los «¿ya salió mi pedido?» en el chat."]
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

  /* ==============================================================
     De acá para abajo, solo si hay movimiento permitido
     ============================================================== */
  if (quieto) {
    document.querySelectorAll(".revelar").forEach(function (el) { el.style.opacity = "1"; });
    return;
  }

  /* --------------------------------------------------------------
     6. Entrada de la portada, de arriba hacia abajo
     -------------------------------------------------------------- */
  var hayPortada = !!document.querySelector(".portada");
  var entrada = hayPortada ? A.createTimeline({ defaults: { ease: salida, duration: 900 } }) : null;
  if (hayPortada) entrada
    .add(".portada .sello", { opacity: [0, 1], y: [14, 0], duration: 700 }, 0)
    .add(piezas, { opacity: [0, 1], y: ["105%", "0%"], rotate: [4, 0], delay: A.stagger(80) }, 120)
    .add(".portada .entrada", { opacity: [0, 1], y: [18, 0] }, 480)
    .add(".portada .acciones .boton", { opacity: [0, 1], y: [16, 0], delay: A.stagger(80) }, 600)
    .add(".escena-grande .ventana", { opacity: [0, 1], y: [56, 0], scale: [0.985, 1], duration: 1150 }, 340)
    .add(".escena-grande .fono", { opacity: [0, 1], y: [44, 0], duration: 1000 }, 560)
    .add(".escena-grande .dato", { opacity: [0, 1], scale: [0.88, 1], delay: A.stagger(120), ease: rebote }, 820)
    .add(".escena-grande .marca-flotante", { opacity: [0, 1], scale: [0.72, 1], delay: A.stagger(110), ease: rebote }, 960)
    .add(".escena-pie", { opacity: [0, 1] }, 1180);

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
