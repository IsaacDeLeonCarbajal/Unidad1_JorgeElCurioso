const ALTO_INDICADORES = 400;
const MAX = 6;
/**
 * Colores de los niveles de alerta, del mayor al menor
 */
const COLORES = [
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(0, 128, 0)"
];

class Pou {
    niveles = {
        'COMIDA': MAX,
        'SUENO': MAX,
        'BANO': MAX
    };
    indicadores = {
        'COMIDA': null,
        'SUENO': null,
        'BANO': null
    };
    timeoutIds = {
        'COMIDA': NaN,
        'SUENO': NaN,
        'BANO': NaN
    };

    durmiendo = false;

    constructor() {
        this.indicadores['COMIDA'] = document.getElementById("div-indicador-comida");
        this.indicadores['SUENO'] = document.getElementById("div-indicador-bano");
        this.indicadores['BANO'] = document.getElementById("div-indicador-sueno");

        this.disminuirNivel('COMIDA');
    }

    aumentarNivel(idIndicador) {
        let espera = 3000;

        switch (idIndicador) {
            case 'COMIDA':
                espera = 3000;
                break;
            case 'SUENO':
                espera = 3000;
                break;
            case 'BANO':
                espera = 3000;
                break;
            default:
                alert("ERROR EN LA PAGINA");
                return;
        }

        clearTimeout(this.timeoutIds[idIndicador]); //No ejecutar la última disminución

        if (this.niveles[idIndicador] < MAX) {
            this.niveles[idIndicador]++; //Aumentar la cantidad
        }

        this.actualizarIndicador(idIndicador); //Actualizar su indicador

        this.timeoutIds[idIndicador] = setTimeout(() => {
            this.disminuirNivel(idIndicador); //Volver a comenzar a disminuir
        }, espera);
    }

    disminuirNivel(idIndicador) {
        let espera = 3000;

        switch (idIndicador) {
            case 'COMIDA':
                espera = 2000;
                break;
            case 'SUENO':
                espera = 2000;
                break;
            case 'BANO':
                espera = 2000;
                break;
            default:
                alert("ERROR EN LA PAGINA");
                return;
        }

        this.timeoutIds[idIndicador] = setTimeout(() => {
            if (this.niveles[idIndicador] > 0) { //Si aún tiene
                this.niveles[idIndicador]--; //Disminuir la cantidad
            } else { //Si ya no tiene
                return; //No hacer nada más
            }

            this.actualizarIndicador(idIndicador);

            // console.log("Pixeles = " + pixs + ", " + (ALTO_INDICADORES - pixs) + "px");
            // console.log("COMIDA = " + this.comida);

            this.disminuirNivel(idIndicador); //Volver a disminuir despues de unos segundos
        }, espera);
    }

    actualizarIndicador(idIndicador) {
        let pixs = parseInt(ALTO_INDICADORES * (this.niveles[idIndicador] / MAX));

        //Actualizar la interfaz
        this.indicadores[idIndicador].style.height = pixs + "px"; //Actualizar la altura
        this.indicadores[idIndicador].style.top = (ALTO_INDICADORES - pixs) + "px"; //Actualizar la posicion
        this.indicadores[idIndicador].style.backgroundColor = COLORES[parseInt(this.niveles[idIndicador] / 2)]; //Actualizar el color
    }

}
