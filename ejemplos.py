"""Arma los tres bocetos de ejemplo que se muestran en la web de CreaX.

    python ejemplos.py

Usa el mismo generador que los bocetos de verdad (Desarrollo/nuevo.py), así que
cualquier mejora en el boceto de un cliente se ve también acá. Los negocios son
de muestra y van sin nombre: no son clientes ni prospectos, y las fotos son libres (CC0), puestas
en assets/ejemplos/<rubro>/fotos con su archivo de créditos.

Después de correrlo, las capturas del celular se sacan con Playwright:
    npx playwright screenshot --viewport-size=390,760 --wait-for-timeout=2500 \
        assets/ejemplos/panaderia/index.html assets/boceto-panaderia.png
"""
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent))

from nuevo import PERFILES, boceto_html, fotos_de   # noqa: E402

EJEMPLOS = {
    "panaderia": dict(
        negocio=dict(nombre="Panadería", categoria="Panadería y pastelería", distrito="Lima",
                     horario="Lun a Sáb · 7:00 a. m. – 9:00 p. m.",
                     direccion=""),
        rubro="Gastronomía",
        perfil=dict(
            titular="Pan recién horneado, *todos los días.*",
            promesa="Pan del día, pasteles por encargo y tu pedido listo en un mensaje.",
            items=[("Pan de masa madre", "Fermentado 24 horas, horneado cada mañana", "S/ 14.00"),
                   ("Croissant de mantequilla", "Hojaldre recién salido del horno", "S/ 6.50"),
                   ("Torta de chocolate", "Por porción o entera, con un día de anticipación", "S/ 12.00"),
                   ("Galletas de avena", "Caja de seis, hechas en casa", "S/ 18.00"),
                   ("Café filtrado", "Grano peruano, para llevar o en el local", "S/ 8.00"),
                   ("Sándwich en baguette", "Jamón, queso y palta, hecho al momento", "S/ 16.00")],
            galeria=["La vitrina", "El horno", "Los salados del día", "El pan del día"])),
    "dental": dict(
        negocio=dict(nombre="Dentista", categoria="Consultorio dental", distrito="Lima",
                     horario="Lun a Vie · 9:00 a. m. – 7:00 p. m.",
                     direccion=""),
        rubro="Salud",
        perfil=dict(
            titular="Tu sonrisa, *sin esperas.*",
            promesa="Reserva tu cita por WhatsApp, sin llamadas ni esperas, y ven cuando te quede bien.",
            items=[("Consulta y diagnóstico", "Evaluación completa, incluye radiografía", "S/ 60.00"),
                   ("Limpieza dental", "Profilaxis y destartraje, 45 minutos", "S/ 120.00"),
                   ("Blanqueamiento", "Una sesión en consultorio, resultado el mismo día", "S/ 450.00"),
                   ("Ortodoncia", "Brackets metálicos, incluye el primer control", "Desde S/ 1,200"),
                   ("Endodoncia", "Tratamiento de conducto, una o dos sesiones", "Desde S/ 350"),
                   ("Odontopediatría", "Atención para niños, primera cita", "S/ 80.00")],
            galeria=["El consultorio", "La atención", "La sala de espera", "El equipo"])),
    "gimnasio": dict(
        negocio=dict(nombre="Gimnasio", categoria="Gimnasio y entrenamiento", distrito="Lima",
                     horario="Lun a Dom · 6:00 a. m. – 11:00 p. m.",
                     direccion=""),
        rubro="Bienestar",
        perfil=dict(
            titular="Entrena fuerte, *a tu ritmo.*",
            promesa="Todos los planes y horarios a la vista, y tu hora reservada en un solo mensaje.",
            items=[("Pase del día", "Acceso libre a máquinas y clases", "S/ 25.00"),
                   ("Plan mensual", "Sin matrícula, acceso ilimitado", "S/ 140.00"),
                   ("Entrenamiento funcional", "Grupos de seis, tres veces por semana", "S/ 180.00"),
                   ("Entrenamiento personal", "Sesión uno a uno con entrenador", "S/ 70.00"),
                   ("Yoga y movilidad", "Clases de lunes a sábado, cupos limitados", "S/ 120.00"),
                   ("Plan trimestral", "Tres meses, con evaluación física incluida", "S/ 360.00")],
            galeria=["La sala de máquinas", "Las clases", "Los vestuarios", "La zona funcional"])),
}

BASE = dict(telefono="", whatsapp="", maps="", web="", instagram="", facebook="", puntaje="",
            motivos="", resenas="", calificacion="", ruc="", razon_social="", contacto="", origen="")


def main():
    for clave, receta in EJEMPLOS.items():
        carpeta = AQUI / "assets" / "ejemplos" / clave
        carpeta.mkdir(parents=True, exist_ok=True)
        negocio = dict(BASE, rubro=receta["rubro"], **receta["negocio"])
        perfil = dict(PERFILES[receta["rubro"]], **receta["perfil"])
        fotos = fotos_de(carpeta / "fotos")
        pagina = carpeta / "index.html"
        pagina.write_text(boceto_html(negocio, perfil=perfil, fotos=fotos, ejemplo=True), encoding="utf-8")
        print(f"{clave}: {pagina.relative_to(AQUI)} · {len(fotos.get('items', []))} fotos de producto,"
              f" {len(fotos.get('galeria', []))} de galería")


if __name__ == "__main__":
    main()
