const ALTO_INDICADORES = 400;
const MAX = 12;
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

    dlgAlerta = document.getElementById("dlg-alerta");
    tituloAlerta = document.getElementById("titulo-alerta");
    lblAlerta = document.getElementById("lbl-alerta");

    durmiendo = false;
    comidaExtra = 0;

    constructor() {
        this.dlgAlerta.mostrar = function () { //Mostrar el diaolog
            //En este contexto, 'this' hace referencia al dialog
            if (!this.open) { //Si el dialogo no está abierto
                this.showModal(); //Mostrarlo
            }
        };

        this.indicadores['SUENO'] = document.getElementById("div-indicador-sueno");
        this.indicadores['COMIDA'] = document.getElementById("div-indicador-comida");
        this.indicadores['BANO'] = document.getElementById("div-indicador-bano");

        this.disminuirNivel('COMIDA');
        this.disminuirNivel('SUENO');
        this.disminuirNivel('BANO');
    }

    aumentarNivel(idIndicador) {
        let espera = 3000;

        switch (idIndicador) {
            case 'COMIDA':
                espera = 3000;

                if (this.durmiendo == true) {
                    this.tituloAlerta.innerHTML = "No puede ser";
                    this.lblAlerta.innerHTML = "Tu Pou no ha aprendido a comer dormido";
                    this.dlgAlerta.mostrar();

                    return;
                }

                if (this.niveles[idIndicador] == MAX) {
                    this.comidaExtra++;

                    if (this.comidaExtra > 5) {
                        this.tituloAlerta.innerHTML = "No le des tanta comida";
                        this.lblAlerta.innerHTML = "Tu Pou va a engordar demasiado";
                        this.dlgAlerta.mostrar();

                        return;
                    }
                }
                break;
            case 'SUENO':
                espera = 3000;

                this.timeoutIds[idIndicador] = setTimeout(() => {
                    if (this.niveles[idIndicador] < MAX) {
                        this.niveles[idIndicador]++; //Aumentar la cantidad
                    }

                    this.actualizarIndicador(idIndicador); //Actualizar su indicador

                    this.aumentarNivel(idIndicador); //Volver a comenzar a aumentar
                }, espera);

                return;
            case 'BANO':
                espera = 6000;

                this.niveles[idIndicador] = MAX; //Cuando va al baño, el indicador en pantalla se vacia

                if (this.durmiendo == true) {
                    this.tituloAlerta.innerHTML = "No puede ser";
                    this.lblAlerta.innerHTML = "Tu Pou orinó la cama";
                    this.dlgAlerta.mostrar();
                } else {
                    this.tituloAlerta.innerHTML = "Tu pou fue al baño";
                    this.lblAlerta.innerHTML = "Ya se siente más ligero";
                    // this.dlgAlerta.mostrar();
                }
                break;
            default:
                this.error();
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
        let textoLblDialog;
        let textoTituloDialog;

        switch (idIndicador) {
            case 'COMIDA':
                espera = 2000;
                textoTituloDialog = "Tu Pou se está muriendo de hambre";
                textoLblDialog = "Aliméntalo";
                this.comidaExtra = 0; //Si se empieza a dismuir la comida, ya no debería tener comida extra
                break;
            case 'SUENO':
                espera = 4000;
                textoTituloDialog = "Tu Pou se está muriendo de sueño";
                textoLblDialog = "Déjalo dormir un poco";
                break;
            case 'BANO':
                espera = 1000;
                textoTituloDialog = "Tu Pou casi se orina encima";
                textoLblDialog = "Déjalo ir al baño";
                break;
            default:
                this.error();
                return;
        }

        this.timeoutIds[idIndicador] = setTimeout(() => {
            if (this.niveles[idIndicador] > 0) { //Si aún tiene
                this.niveles[idIndicador]--; //Disminuir la cantidad
            } else { //Si ya no tiene
                this.timeoutIds[idIndicador] = setTimeout(() => {
                    //Mostrar una alerta con el mensaje adecuado
                    this.tituloAlerta.innerHTML = textoTituloDialog;
                    this.lblAlerta.innerHTML = textoLblDialog;
                    this.dlgAlerta.mostrar();
                }, 5000);

                return; //No hacer nada más
            }

            this.actualizarIndicador(idIndicador);

            this.disminuirNivel(idIndicador); //Volver a disminuir despues de unos segundos
        }, espera);
    }

    actualizarIndicador(idIndicador) {
        let pixs = parseInt(ALTO_INDICADORES * (this.niveles[idIndicador] / MAX));

        switch (idIndicador) {
            case 'COMIDA':
            case 'SUENO':
                //Actualizar la interfaz
                this.indicadores[idIndicador].style.height = pixs + "px"; //Actualizar la altura
                this.indicadores[idIndicador].style.top = (ALTO_INDICADORES - pixs) + "px"; //Actualizar la posicion
                this.indicadores[idIndicador].style.backgroundColor = COLORES[parseInt(this.niveles[idIndicador] / 4)]; //Actualizar el color
                break;
            case 'BANO':
                //Actualizar la interfaz
                //Este se muestra al revés de los otros dos indicadores
                this.indicadores[idIndicador].style.height = (ALTO_INDICADORES - pixs) + "px"; //Actualizar la altura
                this.indicadores[idIndicador].style.top = pixs + "px"; //Actualizar la posicion
                this.indicadores[idIndicador].style.backgroundColor = COLORES[parseInt(this.niveles[idIndicador] / 4)]; //Actualizar el color
                break;
            default:
                this.error();
                return;
        }
    }

    setDurmiendo(durmiendo) {
        this.durmiendo = durmiendo;

        clearTimeout(this.timeoutIds['SUENO']); //No ejecutar la última disminución o aumento

        if (this.durmiendo == true) {
            this.aumentarNivel('SUENO');
        } else {
            this.disminuirNivel('SUENO');
        }
    }

    error() {
        this.tituloAlerta.innerHTML = "ERROR";
        this.lblAlerta.innerHTML = "Ha ocurrido algo inesperado en la pagina";
        this.dlgAlerta.mostrar();

        //Detener el juego
        clearTimeout(this.timeoutIds['COMIDA']);
        clearTimeout(this.timeoutIds['SUENO']);
        clearTimeout(this.timeoutIds['BANO']);
    }

}
