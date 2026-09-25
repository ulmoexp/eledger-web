/* Escena de la portada: casa en el campo.
   Las formas son CSS (assets/estilos.css). Aquí va el reloj: con la hora de
   quien mira la página se calcula la luz minuto a minuto (la paleta se
   interpola entre madrugada, alba, día, tarde, anochecer y noche), el sol y
   la luna recorren su arco y las ventanas se encienden y se apagan. También
   las piezas que van y vienen: estrellas (y alguna fugaz), humo, hojas,
   mariposas, luciérnagas, el gato y la rueda de la caja fuerte.
   Un clic adelanta la escena, en cámara rápida, hasta el siguiente momento
   del día. No se pide nada a ningún servidor ni se guarda nada. */
(function () {
  "use strict";

  var escena = document.getElementById("escena");
  if (!escena) return;
  // «reducir movimiento» solo apaga la cámara rápida del clic (salta sin
  // animarla); el resto de la escena se mueve igual, a petición del usuario
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------ colores
  function color(valor) {
    if (typeof valor === "number") return valor;
    var m = /^#(..)(..)(..)$/.exec(valor);
    if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), 1];
    m = /rgba\(([^)]+)\)/.exec(valor);
    var v = m[1].split(",").map(Number);
    return [v[0], v[1], v[2], v[3]];
  }
  function texto(c) {
    if (typeof c === "number") return String(Math.round(c * 1000) / 1000);
    return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," +
      Math.round(c[2]) + "," + Math.round(c[3] * 1000) / 1000 + ")";
  }
  function mezclar(a, b, t) {
    var p = {};
    for (var k in a) {
      var x = color(a[k]), y = color(b[k]);
      if (typeof x === "number") { p[k] = x + (y - x) * t; continue; }
      p[k] = texto([0, 1, 2, 3].map(function (i) { return x[i] + (y[i] - x[i]) * t; }));
    }
    return p;
  }
  function con(base, cambios) {
    var p = {};
    for (var k in base) p[k] = base[k];
    for (k in cambios) p[k] = cambios[k];
    return p;
  }

  // ------------------------------------------------------------ paletas
  // Mismos nombres que las variables CSS de .escena. Colores en hex o rgba;
  // "niebla" y "noche" son números (0-1).
  var DIA = {
    "cielo-a": "#B9D6DD", "cielo-b": "#F1EEDF", "astro": "#F2C94C",
    "monte-1": "#A9BE98", "monte-2": "#8BAA83", "prado": "#7A9E6E",
    "prado-2": "#6A8F60", "pared": "#E3D5B8", "pared-raya": "rgba(120,90,50,0.13)",
    "tejado": "#8C4A3A", "madera": "#5B3A29", "ventana": "#A9C2C6",
    "copa": "#4F7A55", "copa-2": "#5E8C62", "camino": "#D6C49A",
    "valla": "#EDE3CC", "nube": "rgba(255,255,255,0.85)",
    "humo": "rgba(240,240,240,0.7)", "niebla": 0, "noche": 0
  };
  var ALBA = con(DIA, {
    "cielo-a": "#C4BEDA", "cielo-b": "#F6D8C4", "astro": "#F6B889",
    "monte-1": "#A7AE9C", "monte-2": "#8B9A83", "prado": "#75906A",
    "prado-2": "#66825D", "ventana": "#C9C6D2", "nube": "rgba(255,240,235,0.85)",
    "niebla": 0.55, "noche": 0.05
  });
  var TARDE = con(DIA, {
    "cielo-a": "#E7A782", "cielo-b": "#F7DDB3", "astro": "#E98A4E",
    "monte-1": "#A49A7A", "monte-2": "#8A8566", "prado": "#7C8A5C",
    "prado-2": "#6D7A50", "pared": "#E6CBA2", "ventana": "#D9B79A",
    "copa": "#4E6A45", "copa-2": "#5D7A4F", "camino": "#D9B98A",
    "nube": "rgba(255,235,215,0.8)", "noche": 0.05
  });
  var NOCHE = {
    "cielo-a": "#141C2B", "cielo-b": "#33415A", "astro": "#E98A4E",
    "monte-1": "#2F3D44", "monte-2": "#26343A", "prado": "#22322C",
    "prado-2": "#1C2A25", "pared": "#5C5A5A", "pared-raya": "rgba(0,0,0,0.18)",
    "tejado": "#3E2A28", "madera": "#2A1E19", "ventana": "#2E3A4C",
    "copa": "#1D2D26", "copa-2": "#243730", "camino": "#4A4A45",
    "valla": "#6B6A66", "nube": "rgba(120,135,160,0.35)",
    "humo": "rgba(150,160,175,0.45)", "niebla": 0, "noche": 1
  };
  // El paso de la tarde a la noche en línea recta daba un marrón sucio: el
  // anochecer tiene su propia paleta, morada. Y la madrugada, la suya.
  var ANOCHECER = {
    "cielo-a": "#2B3052", "cielo-b": "#A7727A", "astro": "#E98A4E",
    "monte-1": "#5E5A62", "monte-2": "#4C4A52", "prado": "#44503F",
    "prado-2": "#3A4636", "pared": "#9E8C82", "pared-raya": "rgba(0,0,0,0.15)",
    "tejado": "#5E3530", "madera": "#3B2A22", "ventana": "#4A4E66",
    "copa": "#33453A", "copa-2": "#3C5042", "camino": "#8C7A68",
    "valla": "#A89F92", "nube": "rgba(200,160,170,0.5)",
    "humo": "rgba(190,180,190,0.55)", "niebla": 0.15, "noche": 0.6
  };
  var MADRUGADA = con(mezclar(NOCHE, ALBA, 0.4), {
    "cielo-a": "#232B48", "cielo-b": "#7D6F8E", "noche": 0.7
  });

  // hora del día -> paleta; entre dos, se interpola
  var TRAMOS = [
    [0, NOCHE], [5.25, NOCHE], [6.1, MADRUGADA], [7.0, ALBA], [8.75, DIA],
    [17.25, DIA], [19.25, TARDE], [20.6, ANOCHECER], [21.75, NOCHE], [24, NOCHE]
  ];

  // --- sol y luna: cuándo salen, cuánto duran arriba y su arco (% del marco) ---
  var SOL = { sale: 6.6, dura: 13.8, izq: 3, ancho: 84, bajo: 62, alto: 52 };
  var LUNA = { sale: 20.2, dura: 11, izq: 8, ancho: 82, bajo: 64, alto: 50 };

  // --- cuándo hay luz en cada ventana (horas; pueden pasar de las 24) ---
  var LUCES = {
    v1: [[18.75, 24.75], [6.5, 8.0]],     // el salón: hasta pasada la medianoche
    v2: [[19.25, 22.5]],                  // la habitación de la caja fuerte
    buhardilla: [[20.0, 23.5], [6.25, 7.25]]
  };

  function paletaDe(h) {
    for (var i = 1; i < TRAMOS.length; i++) {
      if (h <= TRAMOS[i][0]) {
        var a = TRAMOS[i - 1], b = TRAMOS[i];
        var t = (h - a[0]) / (b[0] - a[0]);
        // suavizado: que los colores no cambien a golpes al pasar de tramo
        return mezclar(a[1], b[1], t * t * (3 - 2 * t));
      }
    }
    return NOCHE;
  }

  function momentoDe(h) {
    if (h >= 5.5 && h < 8.75) return "alba";
    if (h >= 8.75 && h < 18.25) return "dia";
    if (h >= 18.25 && h < 21.25) return "tarde";
    return "noche";
  }

  // ------------------------------------------------------------ pintar
  var astro = escena.querySelector(".astro");
  var luna = escena.querySelector(".luna");
  var ventanas = {
    v1: escena.querySelector(".ventana.v1"),
    v2: escena.querySelector(".ventana.v2"),
    buhardilla: escena.querySelector(".buhardilla")
  };
  var nocheAhora = 0;

  function arco(el, h, a) {
    if (!el) return;
    var t = ((h - a.sale) % 24 + 24) % 24 / a.dura;
    if (t > 1) {                          // bajo el horizonte: escondido
      el.style.top = "90%";
      return;
    }
    el.style.left = (a.izq + a.ancho * t) + "%";
    el.style.top = (a.bajo - a.alto * Math.sin(Math.PI * t)) + "%";
  }

  function encendida(h, rangos) {
    for (var i = 0; i < rangos.length; i++) {
      var r = rangos[i];
      if ((h >= r[0] && h < r[1]) || (h + 24 >= r[0] && h + 24 < r[1])) return true;
    }
    return false;
  }

  function pintar(h) {
    var p = paletaDe(h);
    for (var k in p) {
      escena.style.setProperty("--" + k, typeof p[k] === "number" ? texto(p[k]) : p[k]);
    }
    nocheAhora = p.noche;
    escena.setAttribute("data-momento", momentoDe(h));
    arco(astro, h, SOL);
    arco(luna, h, LUNA);
    for (var v in ventanas) {
      if (ventanas[v]) ventanas[v].classList.toggle("encendida", encendida(h, LUCES[v]));
    }
  }

  // ------------------------------------------------------------ el reloj
  // desfase: lo que el visitante ha adelantado la escena con clics. La hora
  // real sigue corriendo por debajo.
  var desfase = 0;
  var enCamara = false;

  function horaReal() {
    var d = new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  }
  function horaEscena() { return ((horaReal() + desfase) % 24 + 24) % 24; }

  // al hacer clic, hasta el siguiente de estos momentos
  var PARADAS = [7.25, 13.0, 19.75, 23.25];

  function adelantar() {
    if (enCamara) return;
    var desde = horaEscena();
    var hasta = PARADAS.filter(function (x) { return x > desde + 0.25; })[0];
    if (hasta === undefined) hasta = PARADAS[0] + 24;
    var salto = hasta - desde;
    if (quieto) {
      desfase += salto;
      pintar(horaEscena());
      return;
    }
    // cámara rápida: unas tres horas de reloj en algo más de un segundo
    var dura = Math.min(3200, 700 + salto * 380);
    var inicio = null;
    enCamara = true;
    requestAnimationFrame(function paso(ahora) {
      if (inicio === null) inicio = ahora;
      var t = Math.min(1, (ahora - inicio) / dura);
      var suave = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      pintar((desde + salto * suave) % 24);
      if (t < 1) { requestAnimationFrame(paso); return; }
      desfase += salto;
      enCamara = false;
    });
  }

  escena.addEventListener("click", adelantar);
  escena.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); adelantar(); }
  });

  pintar(horaEscena());
  setInterval(function () { if (!enCamara) pintar(horaEscena()); }, 20000);

  // ------------------------------------------------------------ piezas fijas
  function crear(clase, estilos, padre) {
    var el = document.createElement("span");
    el.className = clase;
    for (var k in estilos) el.style.setProperty(k, estilos[k]);
    (padre || escena).appendChild(el);
    return el;
  }
  function azar(min, max) { return min + Math.random() * (max - min); }
  function quitarAlAcabar(el) {
    el.addEventListener("animationend", function (e) {
      if (e.target === el) el.remove();
    });
  }

  var cielo = escena.querySelector(".estrellas");
  for (var i = 0; i < 46; i++) {
    crear("estrella", {
      left: azar(0, 100) + "%",
      top: azar(0, 100) + "%",
      // cada una sale con un grado de oscuridad distinto: van apareciendo
      "--umbral": azar(0.25, 0.8).toFixed(2),
      "--duracion": azar(4, 8) + "s",
      "--retardo": azar(-5, 0) + "s",
      transform: "scale(" + azar(0.6, 1.4) + ")"
    }, cielo);
  }
  for (i = 0; i < 22; i++) {
    // sin briznas encima del camino, que baja entre el 22% y el 42%
    var x = azar(0, 80);
    crear("brizna", {
      left: (x < 22 ? x : x + 20) + "%",
      height: azar(10, 22) + "px",
      "--duracion": azar(4.5, 6.5) + "s",
      "--retardo": azar(-4, 0) + "s"
    });
  }
  for (i = 0; i < 9; i++) {
    crear("luciernaga", {
      left: azar(5, 95) + "%",
      top: azar(66, 90) + "%",
      "--retardo": azar(-6, 0) + "s",
      "--duracion": azar(7, 11) + "s"
    });
  }
  ["#F2C94C", "#F4F1E8", "#E98A4E"].forEach(function (c, n) {
    crear("mariposa", {
      left: (azar(4, 14) + n * 26) + "%",
      top: azar(64, 78) + "%",
      "--color": c,
      "--retardo": azar(-16, 0) + "s"
    });
  });
  // la sombra: una persona de medio cuerpo, cabeza, cuello y hombros
  var sombra = ventanas.v1 ? crear("sombra", {}, ventanas.v1) : null;
  if (sombra) {
    sombra.innerHTML = '<svg viewBox="0 0 40 56" aria-hidden="true" fill="rgba(58,34,20,0.62)">' +
      '<ellipse cx="20" cy="13" rx="7.5" ry="8.5"/>' +
      '<path d="M16.5 20 h7 v6 h-7 Z"/>' +
      '<path d="M3 56 C3 40 7 31 14 29 C17 28 23 28 26 29 C33 31 37 40 37 56 Z"/>' +
      '</svg>';
  }
  var rueda = escena.querySelector(".rueda");

  // El gato, de perfil y mirando a la izquierda. Las patas del lado de
  // allá, más oscuras, van detrás del cuerpo; las de este lado, delante.
  var PELO = "#C9803F", RAYA = "#9C5A26", LEJOS = "#A8652F", CLARO = "#E4B27A";
  var gato = crear("gato", {});
  gato.innerHTML =
    '<span class="miau">¡miau!</span>' +
    '<svg viewBox="0 0 100 64" aria-hidden="true">' +
    '<g class="cola"><path d="M81 31 C92 29 98 18 94 7 C93 4 89 4 89 8 C92 17 88 25 79 26 Z" fill="' + PELO + '"/></g>' +
    '<g class="pelaje">' +
      '<rect class="pata p2" x="44" y="36" width="5.5" height="23" rx="2.7" fill="' + LEJOS + '"/>' +
      '<rect class="pata p4" x="76" y="34" width="5.5" height="25" rx="2.7" fill="' + LEJOS + '"/>' +
      '<g class="cuerpo-gato">' +
        '<path d="M32 32 C30 22 42 18 58 19 C72 19 84 21 85 30 C86 39 78 43 62 43 C48 43 34 42 32 32 Z" fill="' + PELO + '"/>' +
        '<path d="M38 39 C48 44 66 44 77 40" stroke="' + CLARO + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M53 20 C55 26 54 31 51 35 M62 19.5 C64 26 63 31 60 35 M71 20.5 C73 26 72 31 69 34" stroke="' + RAYA + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M15 17 L13 3 L23 12 Z M24 11 L32 1.5 L34 15 Z" fill="' + PELO + '"/>' +
        '<path d="M16 14 L15.5 7 L20 11.5 Z M26.5 11 L30.5 6 L31.5 13 Z" fill="#E8A59A"/>' +
        '<circle cx="24" cy="23" r="11.5" fill="' + PELO + '"/>' +
        '<path d="M22 12.5 L22.5 16.5 M26 12 L26 16 M30 13.5 L29 17" stroke="' + RAYA + '" stroke-width="1.6" stroke-linecap="round"/>' +
        '<ellipse cx="15" cy="27" rx="5.5" ry="4.2" fill="' + CLARO + '"/>' +
        '<path d="M10.5 24.3 L13.5 24 L12 26.2 Z" fill="#7A3B2E"/>' +
      '</g>' +
      '<rect class="pata p1" x="37" y="36" width="5.5" height="23" rx="2.7" fill="' + PELO + '"/>' +
      '<rect class="pata p3" x="69" y="34" width="5.5" height="25" rx="2.7" fill="' + PELO + '"/>' +
    '</g>' +
    '<ellipse class="ojo" cx="19" cy="20.5" rx="2.1" ry="2.6"/>' +
    '<ellipse class="brillo" cx="19" cy="20.5" rx="2.1" ry="2.6"/>' +
    '<rect class="parpado" x="16.4" y="17.6" width="5.2" height="5.8" fill="' + PELO + '"/>' +
    '<path d="M12 27 L1 24.5 M12 28 L1.5 29.5 M13 29 L3 33" stroke="#F4E7D0" stroke-width="0.7" stroke-linecap="round"/>' +
    '</svg>';

  // ------------------------------------------------------------ lo que va y viene
  // Nada se lanza si la escena no se ve o la pestaña está en segundo plano.
  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
    }).observe(escena);
  }
  function activa() { return visible && !document.hidden; }

  // cada cosa a su ritmo, con algo de azar para que no se note el reloj
  function cadaTanto(min, max, fn) {
    setTimeout(function vuelta() {
      if (activa()) fn();
      setTimeout(vuelta, azar(min, max));
    }, azar(min, max));
  }

  // dónde está un elemento, en % del marco (lo que se mueve, como las nubes,
  // hay que mirarlo en el momento)
  function dondeEsta(el) {
    var marco = escena.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return {
      x: (r.left - marco.left) / marco.width * 100,
      y: (r.top - marco.top) / marco.height * 100,
      ancho: r.width / marco.width * 100,
      alto: r.height / marco.height * 100
    };
  }

  // humo de la chimenea
  var chimenea = escena.querySelector(".chimenea");
  function bocanada(fuerte) {
    var c = dondeEsta(chimenea);
    quitarAlAcabar(crear("humo", {
      left: (c.x + c.ancho / 2 - 2.5) + "%",
      top: (c.y - 3) + "%",
      "--dx": azar(15, 45) + "px",
      width: fuerte ? azar(6, 8) + "%" : ""
    }));
  }
  setInterval(function () { if (activa()) bocanada(false); }, 1500);

  // hojas que caen del árbol
  function hoja(viento) {
    var arriba = azar(32, 48);
    quitarAlAcabar(crear(Math.random() < 0.3 ? "hoja ocre" : "hoja", {
      left: azar(64, 82) + "%",
      top: arriba + "%",
      "--dx": (viento ? azar(-120, -50) : azar(-40, 30)) + "px",
      "--dy": ((azar(78, 88) - arriba) / 100 * escena.clientHeight) + "px",
      "animation-duration": azar(7.5, 10.5) + "s"
    }));
  }

  function varias(n, cada, fn) {
    for (var i = 0; i < n; i++) setTimeout(fn, i * cada);
  }

  // ------------------------------------------------------------ al pasar el ratón
  // Van antes del corte de «reducir movimiento»: los provoca quien mira, no
  // pasan solos. Cada cosa descansa un poco antes de poder repetirse.
  function alPasar(el, fn, descanso) {
    if (!el) return;
    var libre = true;
    el.addEventListener("mouseenter", function () {
      if (!libre) return;
      libre = false;
      fn();
      setTimeout(function () { libre = true; }, descanso || 1200);
    });
  }

  alPasar(chimenea, function () { varias(3, 350, function () { bocanada(true); }); }, 2500);
  // lo que es de un solo disparo se quita al acabar, y así acaba siempre
  // en reposo aunque el ratón se vaya a medias
  function unDisparo(el, clase) {
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
  }
  var arbol = escena.querySelector(".arbol");
  arbol.addEventListener("animationend", function (e) {
    if (e.animationName === "sacudida") arbol.classList.remove("sacude");
  });
  alPasar(arbol, function () {
    unDisparo(arbol, "sacude");
    varias(Math.round(azar(2, 4)), 260, function () { hoja(false); });
  }, 1400);
  escena.querySelectorAll(".nube").forEach(function (nube) {
    alPasar(nube, function () {
      varias(9, 130, function () {
        var n = dondeEsta(nube);
        quitarAlAcabar(crear("gota", {
          left: (n.x + azar(0.15, 0.85) * n.ancho) + "%",
          top: (n.y + n.alto) + "%",
          "--caida": ((62 - n.y) / 100 * escena.clientHeight) + "px",
          "animation-duration": azar(0.6, 1) + "s"
        }));
      });
    }, 1600);
  });
  luna.addEventListener("animationend", function (e) {
    if (e.animationName === "brillo-fuerte") luna.classList.remove("brilla");
  });
  alPasar(luna, function () {
    unDisparo(luna, "brilla");
    varias(3, 350, function () {
      var l = dondeEsta(luna);
      quitarAlAcabar(crear("destello", {
        left: (l.x + azar(-8, l.ancho + 6)) + "%",
        top: (l.y + azar(-8, l.alto + 6)) + "%"
      }));
    });
  });
  function pasaAlguien() {
    if (!sombra) return;
    sombra.classList.remove("pasa");
    void sombra.offsetWidth;              // para que la animación vuelva a empezar
    sombra.classList.add("pasa");
  }
  alPasar(ventanas.v1, pasaAlguien, 7200);

  // la caja fuerte: alguien prueba la combinación, falla, y la caja vibra
  // con el piloto en rojo
  var caja = escena.querySelector(".caja-fuerte");
  var piloto = escena.querySelector(".piloto");
  if (rueda && caja) {
    rueda.addEventListener("animationend", function (e) {
      if (e.animationName === "intento") rueda.classList.remove("intenta");
      if (e.animationName === "combinacion") rueda.classList.remove("girando");
    });
    caja.addEventListener("animationend", function (e) {
      if (e.animationName === "vibrar") caja.classList.remove("falla");
    });
    alPasar(ventanas.v2, function () {
      rueda.classList.remove("girando");
      unDisparo(rueda, "intenta");
      setTimeout(function () {
        unDisparo(caja, "falla");
        if (piloto) piloto.classList.add("rojo");
      }, 1900);
      setTimeout(function () { if (piloto) piloto.classList.remove("rojo"); }, 3200);
    }, 3200);
  }

  // una mariposa asustada sale volando y, al rato, vuelve con un fundido
  escena.querySelectorAll(".mariposa").forEach(function (m) {
    m.addEventListener("animationend", function (e) {
      if (e.animationName !== "huir") return;
      m.classList.add("oculta");
      m.classList.remove("huye");
      setTimeout(function () { m.classList.remove("oculta"); }, azar(4000, 7000));
    });
    alPasar(m, function () { m.classList.add("huye"); }, 8000);
  });
  alPasar(gato, function () {
    gato.classList.add("salta", "maulla");
    setTimeout(function () { gato.classList.remove("salta"); }, 500);
    setTimeout(function () { gato.classList.remove("maulla"); }, 1400);
  }, 1500);

  // hojas que caen del árbol
  cadaTanto(7000, 14000, function () { hoja(false); });

  // rachas de viento: el árbol y la hierba se agitan y vuelan unas hojas
  cadaTanto(35000, 70000, function () {
    escena.classList.add("racha");
    for (var n = Math.round(azar(1, 3)); n > 0; n--) setTimeout(hoja, azar(0, 2000), true);
    setTimeout(function () { escena.classList.remove("racha"); }, 4100);
  });

  // bandadas de pájaros, de día: cada una cruza una vez, a su altura y en
  // su sentido
  function bandada() {
    if (nocheAhora > 0.5) return;
    var grupo = crear("pajaros" + (Math.random() < 0.5 ? " al-reves" : ""), {
      top: azar(8, 32) + "%",
      "animation-duration": azar(22, 32) + "s"
    });
    for (var n = Math.round(azar(2, 4)); n > 0; n--) {
      crear("pajaro", {
        left: azar(0, 70) + "%",
        top: azar(0, 60) + "%",
        "animation-delay": azar(-0.9, 0) + "s"
      }, grupo);
    }
    quitarAlAcabar(grupo);
  }
  setTimeout(function () { if (activa()) bandada(); }, 1200);
  cadaTanto(20000, 40000, bandada);

  // estrellas fugaces, solo con la noche cerrada
  cadaTanto(25000, 50000, function () {
    if (nocheAhora < 0.8) return;
    quitarAlAcabar(crear("fugaz", {
      left: azar(30, 85) + "%",
      top: azar(4, 26) + "%"
    }));
  });

  // alguien pasa por delante de la luz del salón
  cadaTanto(30000, 60000, function () {
    if (ventanas.v1 && ventanas.v1.classList.contains("encendida")) pasaAlguien();
  });

  // la rueda de la caja fuerte, de vez en cuando (y al pasar el ratón, en CSS)
  if (rueda) {
    cadaTanto(45000, 90000, function () {
      if (!rueda.classList.contains("intenta")) rueda.classList.add("girando");
    });
  }

  // El gato cruza por fases: anda hasta la mitad, se sienta un rato
  // (parpadea, mueve la cola) y sigue. Con «transition» en left, y el JS
  // encadena los tramos, para que las patas solo se muevan cuando anda.
  var paseando = false;
  function tramo(hasta, segundos, luego) {
    gato.classList.add("anda");
    gato.style.transition = "left " + segundos + "s linear";
    gato.style.left = hasta + "%";
    setTimeout(function () { gato.classList.remove("anda"); luego(); }, segundos * 1000);
  }
  function pasear() {
    if (paseando) return;
    paseando = true;
    gato.style.transition = "none";
    gato.style.left = "104%";
    void gato.offsetWidth;
    tramo(azar(40, 55), azar(9, 12), function () {
      gato.classList.add("sentado");
      setTimeout(function () {
        gato.classList.remove("sentado");
        tramo(-14, azar(9, 12), function () { paseando = false; });
      }, azar(4000, 7000));
    });
  }
  setTimeout(function () { if (activa()) pasear(); }, azar(8000, 15000));
  cadaTanto(50000, 90000, pasear);
})();
