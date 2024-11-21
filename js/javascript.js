let cuestionarioCounter = 1;

function queryAncestorSelector(node, selector) {
    let parent = node.parentNode;
    let all = document.querySelectorAll(selector);
    let found = false;

    while (parent !== document && !found) {
        for (let i = 0; i < all.length && !found; i++) {
            found = (all[i] === parent);
        }
        parent = (!found) ? parent.parentNode : parent;
    }
    return (found) ? parent : null;
}

function borraPregunta(event) {
    const bloque = queryAncestorSelector(event.target, '.bloque');

    if (bloque) {
        const cuestionario = queryAncestorSelector(bloque, 'section');

        bloque.remove();

        const bloquesRestantes = cuestionario.querySelectorAll('.bloque');

        if (bloquesRestantes.length === 0) {
            cuestionario.remove();

            const indiceEntrada = document.querySelector(`a[href="#${cuestionario.id}"]`);
            if (indiceEntrada) {
                indiceEntrada.parentNode.remove();
            }
        }
    }
}

function addCruz(bloque) {
    const cruz = document.createElement("div");
    cruz.className = "borra";
    cruz.textContent = "\u2612";

    cruz.addEventListener("click", borraPregunta);

    bloque.insertBefore(cruz, bloque.firstChild);
}

function addFormPregunta(section) {
    const sectionId = section.id;

    const formulario = document.createElement("div");
    formulario.className = "formulario";

    formulario.innerHTML = `
        <ul>
            <li>
                <label for="${sectionId}_pregunta">Enunciado de la pregunta:</label>
                <input type="text" name="${sectionId}_pregunta" id="${sectionId}_pregunta">
            </li>
            <li>
                <label>Respuesta:</label>
                <input type="radio" name="${sectionId}_respuesta" value="verdadero" id="${sectionId}_v" checked>
                <label for="${sectionId}_v" class="radio">Verdadero</label>
                <input type="radio" name="${sectionId}_respuesta" value="falso" id="${sectionId}_f">
                <label for="${sectionId}_f" class="radio">Falso</label>
            </li>
            <li>
                <input type="button" value="Añadir nueva pregunta">
            </li>
        </ul>
    `;

    const primeraPregunta = section.querySelector(".bloque");
    if (primeraPregunta) {
        section.insertBefore(formulario, primeraPregunta);
    } else {
        section.appendChild(formulario);
    }

    const botonAñadir = formulario.querySelector("input[type='button']");
    botonAñadir.addEventListener("click", (event) => addPregunta(event));

    return formulario; // Devuelve el nodo del formulario
}

function addPregunta(event) {
    const formulario = event.target.closest('.formulario');
    const section = queryAncestorSelector(formulario, 'section');

    const enunciado = formulario.querySelector(`input[name="${section.id}_pregunta"]`).value.trim();
    const respuesta = formulario.querySelector(`input[name="${section.id}_respuesta"]:checked`).value;

    if (enunciado === "") {
        alert("Por favor, rellena el enunciado de la pregunta.");
        return;
    }

    const nuevoBloque = document.createElement("div");
    nuevoBloque.className = "bloque";

    const preguntaDiv = document.createElement("div");
    preguntaDiv.className = "pregunta";
    preguntaDiv.textContent = enunciado;

    const respuestaDiv = document.createElement("div");
    respuestaDiv.className = "respuesta";
    respuestaDiv.setAttribute("data-valor", respuesta === "verdadero");

    nuevoBloque.appendChild(preguntaDiv);
    nuevoBloque.appendChild(respuestaDiv);

    const primeraPregunta = section.querySelector(".bloque");
    if (primeraPregunta) {
        section.insertBefore(nuevoBloque, primeraPregunta);
    } else {
        section.appendChild(nuevoBloque);
    }

    addCruz(nuevoBloque);

    formulario.querySelector(`input[name="${section.id}_pregunta"]`).value = "";
    formulario.querySelectorAll(`input[name="${section.id}_respuesta"]`).forEach(radio => {
        radio.checked = radio.defaultChecked;
    })
}

function addCuestionario(event) {
    event.preventDefault();

    const formulario = document.getElementById('nuevoCuestionario');
    const tema = formulario.querySelector('#tema').value.trim();

    if (tema === "") {
        alert("Por favor, rellena el tema del cuestionario.");
        return;
    }

    // Crear una nueva sección
    const nuevaSeccion = document.createElement("section");
    nuevaSeccion.id = `c${cuestionarioCounter++}`;

    // Usar el componente encabezado-cuestionario
    const encabezado = document.createElement('encabezado-cuestionario');
    encabezado.setAttribute('data-tema', tema);
    nuevaSeccion.appendChild(encabezado);

    // Añadir el formulario de preguntas
    const formularioNodo = addFormPregunta(nuevaSeccion);

    // Añadir la nueva sección al main
    const main = document.querySelector("main");
    main.appendChild(nuevaSeccion);

    // Limpiar el formulario de nuevo cuestionario
    formulario.querySelector('#tema').value = "";

    // Añadir el enlace de navegación
    const nav = document.querySelector('nav ul');
    const nuevaEntrada = document.createElement('li');
    const enlace = document.createElement('a');
    enlace.href = `#${nuevaSeccion.id}`;
    enlace.textContent = tema;
    nuevaEntrada.appendChild(enlace);
    nav.appendChild(nuevaEntrada);
}



function init() {
    const botonCrear = document.querySelector('input[name="crea"]');
    botonCrear.addEventListener("click", addCuestionario);

    const bloques = document.querySelectorAll(".bloque");
    bloques.forEach(bloque => addCruz(bloque));

    const secciones = document.querySelectorAll("section");
    secciones.forEach(section => {
        const formularioNodo = addFormPregunta(section);
        const imgNode = section.querySelector('h2 img');
    });
}


// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", init);
