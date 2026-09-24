/* Escena de la portada: casa en el campo.
   Las formas son CSS (assets/estilos.css); aquí solo se añaden las piezas
   repetidas (estrellas, briznas, luciérnagas), el humo de la chimenea y la
   hora del día, que sale del reloj de quien mira la página. No se pide
   nada a ningún servidor ni se guarda nada. */
(function () {
  "use strict";

  var escena = document.getElementById("escena");
  if (!escena) return;
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MOMENTOS = ["alba", "dia", "tarde", "noche"];
  // posición del sol (o la luna) en % del marco, por momento
  var ASTRO = {
    alba:  { left: 8,  top: 40 },
    dia:   { left: 64, top: 10 },
    tarde: { left: 76, top: 38 },
    noche: { left: 70, top: 9 }
  };

  function momentoDe(hora) {
    if (hora >= 6 && hora < 9) return "alba";
    if (hora >= 9 && hora < 18) return "dia";
    if (hora >= 18 && hora < 21) return "tarde";
    return "noche";
  }

  function crear(clase, estilos, padre) {
    var el = document.createElement("span");
    el.className = clase;
    for (var k in estilos) el.style.setProperty(k, estilos[k]);
    (padre || escena).appendChild(el);
    return el;
  }

  function azar(min, max) { return min + Math.random() * (max - min); }

  // --- piezas repetidas ---
  var cielo = escena.querySelector(".estrellas");
  for (var i = 0; i < 46; i++) {
    crear("estrella", {
      left: azar(0, 100) + "%",
      top: azar(0, 100) + "%",
      "animation-delay": azar(-3, 0) + "s",
      transform: "scale(" + azar(0.6, 1.4) + ")"
    }, cielo);
  }
  for (i = 0; i < 22; i++) {
    crear("brizna", {
      left: azar(0, 100) + "%",
      height: azar(10, 22) + "px",
      transform: "rotate(" + azar(-12, 12) + "deg)",
      "animation-delay": azar(-4, 0) + "s"
    });
  }
  for (i = 0; i < 9; i++) {
    crear("luciernaga", {
      left: azar(5, 95) + "%",
      top: azar(66, 90) + "%",
      "animation-delay": azar(-6, 0) + "s",
      "animation-duration": azar(4, 8) + "s"
    });
  }

  // --- momento del día ---
  var manual = false;

  function pintar(momento) {
    escena.setAttribute("data-momento", momento);
    var astro = escena.querySelector(".astro");
    astro.style.left = ASTRO[momento].left + "%";
    astro.style.top = ASTRO[momento].top + "%";
  }

  function siguiente() {
    manual = true;
    var actual = escena.getAttribute("data-momento");
    pintar(MOMENTOS[(MOMENTOS.indexOf(actual) + 1) % MOMENTOS.length]);
  }

  escena.addEventListener("click", siguiente);
  escena.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); siguiente(); }
  });

  pintar(momentoDe(new Date().getHours()));
  setInterval(function () {
    if (!manual) pintar(momentoDe(new Date().getHours()));
  }, 60000);

  // --- humo de la chimenea ---
  if (quieto) return;
  var chimenea = escena.querySelector(".chimenea");
  var visible = true;

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
    }).observe(escena);
  }

  function bocanada() {
    if (!visible || document.hidden) return;
    var marco = escena.getBoundingClientRect();
    var c = chimenea.getBoundingClientRect();
    var humo = crear("humo", {
      left: ((c.left + c.width / 2 - marco.left) / marco.width * 100 - 2.5) + "%",
      top: ((c.top - marco.top) / marco.height * 100 - 3) + "%",
      "--dx": azar(15, 45) + "px"
    });
    humo.addEventListener("animationend", function () { humo.remove(); });
  }
  setInterval(bocanada, 800);
})();
