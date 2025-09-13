const url = "http://localhost:3000/dioses"

const listaDioses = document.getElementById("lista-dioses")

const formDioses = document.getElementById("form-dioses")
const formDiosesAct = document.getElementById("form-dioses-actualizar")

const nombreDios = document.getElementById("nombre-dios")
const dominioDios = document.getElementById("dominio-dios")
const simboloDios = document.getElementById("simbolo-dios")
const poderDios = document.getElementById("poder-dios")
const ciudadDios = document.getElementById("ciudad-dios")

const nombreDiosAct = document.getElementById("nombre-dios-act")
const dominioDiosAct = document.getElementById("dominio-dios-act")
const simboloDiosAct = document.getElementById("simbolo-dios-act")
const poderDiosAct = document.getElementById("poder-dios-act")
const ciudadDiosAct = document.getElementById("ciudad-dios-act")


const formActContainer = document.getElementById("form-act-container")

const btnFiltarDioses = document.getElementById("filtar-dioses")
const btnFiltarDiosesPorAtributo = document.getElementById("filtar-dioses-atributo")
const atributo = document.getElementById("atributo")

const prueba = "poder"

let filtarDioses = false
let filtrarPorAtributoActivo = false

async function getDioses() {
    try {
        const response = await fetch(url)
        const data = await response.json()

        listaDioses.innerHTML = ""
        data.forEach(dios => {
            crearDios(dios)
        });
    } catch (error) {
        console.error(error)
    }
}

async function postDios() {

    const dios = {
        nombre: nombreDios.value.trim(),
        dominio: dominioDios.value.trim(),
        simbolo: simboloDios.value.trim(),
        poder: poderDios.value.trim(),
        ciudad: ciudadDios.value.trim()
    }

    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-type": "Application/json" },
            body: JSON.stringify(dios)
        })

        nombreDios.value = ""
        dominioDios.value = ""
        simboloDios.value = ""
        poderDios.value = ""
        ciudadDios.value = ""

        getDioses()
    } catch (error) {
        console.log(error)
    }
}

async function putDioses(id) {
    const diosQueActualizar = await getDiosesById(id)
    let diosActualizar = {
        nombre: nombreDiosAct.value.trim() || diosQueActualizar.nombre,
        dominio: dominioDiosAct.value.trim() || diosQueActualizar.domino,
        simbolo: simboloDiosAct.value.trim() || diosQueActualizar.simbolo,
        poder: poderDiosAct.value.trim() || diosQueActualizar.poder,
        ciudad: ciudadDiosAct.value.trim() || diosQueActualizar.ciudad
    }

    try {
        await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { "Content-type": "Application/json" },
            body: JSON.stringify(diosActualizar)
        })

        nombreDiosAct.value = ""
        dominioDiosAct.value = ""
        simboloDiosAct.value = ""
        poderDiosAct.value = ""
        ciudadDiosAct.value = ""

        ocultarFormActualizadion()

        getDioses()
    } catch (error) {
        console.log(error)
    }
}

async function getDiosesById(id) {
    try {
        const response = await fetch(`${url}/${id}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

async function deleteDios(id) {
    try {
        await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        getDioses()
    } catch (error) {
        console.log(error)
    }

}

function mostrarFormActualizacion(id) {
    formActContainer.classList.remove("ocultar")
    formActContainer.classList.add("mostrar")

    formDiosesAct.addEventListener("submit", (e) => {
        e.preventDefault()
        putDioses(id)
    })
}

function ocultarFormActualizadion() {
    formActContainer.classList.remove("mostrar")
    formActContainer.classList.add("ocultar")
}

function crearDios(dios) {
    console.log("AAAAAAAAAAA")
    const li = document.createElement("li")
    const btnActualizar = document.createElement("button")
    const btnEliminar = document.createElement("button")

    if (dios.poder >= 9000) li.classList.add("legendario")
    else if (dios.poder < 85) li.classList.add("normal")
    else if (dios.poder >= 85 && dios.poder < 94) li.classList.add("poderoso")
    else if (dios.poder >= 95) li.classList.add("supremo")

    btnActualizar.textContent = "Actualizar"
    btnEliminar.textContent = "Eliminar"

    btnActualizar.addEventListener("click", () => mostrarFormActualizacion(dios.id))
    btnEliminar.addEventListener("click", () => deleteDios(dios.id))

    if (filtrarPorAtributoActivo) {
        const attr = atributo.value.trim();
        if (attr in dios) {
            li.innerText = dios[attr];
        } else {
            alert(`El atributo "${attr}" no existe`);
            filtrarPorAtributoActivo = false;
            getDioses();
            return;
        }
    } 
    else if (!filtarDioses) {
        li.innerText = `${dios.nombre} - ${dios.dominio} - ${dios.simbolo} - ${dios.poder} - ${dios.ciudad}`;
    } 
    else {
        li.innerText = `${dios.nombre} - ${dios.dominio}`;
    }
    li.appendChild(btnActualizar)
    li.appendChild(btnEliminar)
    listaDioses.appendChild(li)
}



getDioses()


btnFiltarDioses.addEventListener("click", () => {
    filtarDioses = !filtarDioses
    getDioses()
})

formDioses.addEventListener("submit", (e) => {
    e.preventDefault()
    postDios()
})

btnFiltarDiosesPorAtributo.addEventListener("click", () => {
    console.log("BBBBBBBBBBBB")
    filtrarPorAtributoActivo = true
    getDioses()
})