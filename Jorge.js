const ALTO_INDICADORES = 400;
const MAX = 10;
/**
 * Colores de los niveles de alerta, del mayor al menor
 */
const COLORES = [
    "rgb(255, 0, 0)",
    "rgb(255, 140, 0)",
    "rgb(255, 255, 0)",
    "rgb(200, 240, 70)",
    "rgb(0, 200, 0)"
];

class Jorge {
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

    //Obtener las vistas del diálogo de alerta
    dlgAlerta = document.getElementById("dlg-alerta");
    tituloAlerta = document.getElementById("titulo-alerta");
    lblAlerta = document.getElementById("lbl-alerta");

    durmiendo = false;
    comidaExtra = 0;

    constructor() {
        this.dlgAlerta.mostrar = function () { //Para mostrar el diaolog
            //En este contexto, 'this' hace referencia al dialog
            if (!this.open) { //Si el dialogo no está abierto
                this.showModal(); //Mostrarlo
            }
        };

        //Obtener las vistas para los indicadores
        this.indicadores['SUENO'] = document.getElementById("div-indicador-sueno");
        this.indicadores['COMIDA'] = document.getElementById("div-indicador-comida");
        this.indicadores['BANO'] = document.getElementById("div-indicador-bano");

        //Comenzar el juego
        this.disminuirNivel('COMIDA');
        this.disminuirNivel('SUENO');
        this.disminuirNivel('BANO');
    }

    /**
     * Aumentar el nivel del indicador según su id, que debe ser uno de COMIDA, SUENO o BANO
     */
    aumentarNivel(idIndicador) {
        let espera = 3000; //Espera por defecto antes de volver a disminuir

        switch (idIndicador) {
            case 'COMIDA':
                espera = 3000;

                if (this.durmiendo == true) { //Si está durmiendo
                    //Mostrar una alerta
                    this.tituloAlerta.innerHTML = "Vaya";
                    this.lblAlerta.innerHTML = "Jorge el curioso no ha aprendido a comer dormido";
                    this.dlgAlerta.mostrar();

                    return; //No hacer nada más
                }

                if (this.niveles[idIndicador] == MAX) { //Si la comida ya está al máximo
                    this.comidaExtra++; //Aumentar a la comida extra

                    if (this.comidaExtra > 5) { //Si ya tiene 5 comidas extra
                        //Mostrar una alerta
                        this.tituloAlerta.innerHTML = "No le des tanta comida";
                        this.lblAlerta.innerHTML = "Jorge el curioso va a engordar demasiado";
                        this.dlgAlerta.mostrar();

                        return; //No hacer nada más
                    }
                }
                break;
            case 'SUENO':
                espera = 2000;

                //Cuando se cambia el estado de durmiendo, se detiene el aumento o disminución para comenzar con el respectivo proceso
                //Sólo se debería poder acceder a este bloque desde this.setDurmiendo()
                this.timeoutIds[idIndicador] = setTimeout(() => { //Aumentar el nivel constantemente
                    if (this.niveles[idIndicador] < MAX) { //Si el nivel no está al máximo
                        this.niveles[idIndicador]++; //Aumentar la cantidad
                    }

                    this.actualizarIndicador(idIndicador); //Actualizar su indicador

                    this.aumentarNivel(idIndicador); //Volver a aumentar
                }, espera);

                return;
            case 'BANO':
                espera = 6000;

                this.niveles[idIndicador] = MAX; //Cuando va al baño, el indicador en pantalla se vacia

                if (this.durmiendo == true) { //Si está durmiendo
                    //Mostrar una alerta
                    this.tituloAlerta.innerHTML = "No puede ser";
                    this.lblAlerta.innerHTML = "Jorge el curioso orinó la cama";
                    this.dlgAlerta.mostrar();
                } else { //Si no está durmiendo
                    //Mostrar una alerta
                    this.tituloAlerta.innerHTML = "Jorge el curioso fue al baño";
                    this.lblAlerta.innerHTML = "Ya se siente más ligero";
                    this.dlgAlerta.mostrar();
                }

                break;
            default:
                this.error();
                return;
        }

        clearTimeout(this.timeoutIds[idIndicador]); //No ejecutar la última disminución

        if (this.niveles[idIndicador] < MAX) { //Si el nivel no está al máximo
            this.niveles[idIndicador]++; //Aumentar la cantidad
        }

        this.actualizarIndicador(idIndicador); //Actualizar su indicador

        this.timeoutIds[idIndicador] = setTimeout(() => { //Despues de un tiempo (espera), disminuir el nivel
            this.disminuirNivel(idIndicador); //Volver a comenzar a disminuir
        }, espera);
    }

    /**
     * Disminuir el nivel del indicador según su id, que debe ser uno de COMIDA, SUENO o BANO
     */
    disminuirNivel(idIndicador) {
        let espera = 3000; //Espera por defecto antes de volver a disminuir
        let textoLblDialog; //Texto para el label del dialogo de alerta
        let textoTituloDialog; //Texto para el titulo del dialogo de alerta

        switch (idIndicador) {
            case 'COMIDA':
                espera = 2000;

                //Alerta a mostrar si no se atiende al mono
                textoTituloDialog = "Jorge el curioso se está muriendo de hambre";
                textoLblDialog = "Aliméntalo";

                this.comidaExtra = 0; //Si se empieza a dismuir la comida, ya no debería tener comida extra

                break;
            case 'SUENO':
                espera = 4000;

                //Alerta a mostrar si no se atiende al mono
                textoTituloDialog = "Jorge el curioso se está muriendo de sueño";
                textoLblDialog = "Déjalo dormir un poco";

                break;
            case 'BANO':
                espera = 1500;

                //Alerta a mostrar si no se atiende al mono
                textoTituloDialog = "Jorge el curioso casi se orina encima";
                textoLblDialog = "Déjalo ir al baño";

                break;
            default:
                this.error();
                return;
        }

        this.timeoutIds[idIndicador] = setTimeout(() => { //Despues de un tiempo (espera), disminuir el nivel de nuevo
            if (this.niveles[idIndicador] > 0) { //Si el nivel no está al mínimo
                this.niveles[idIndicador]--; //Disminuir el nivel
            } else { //Si el nivel está al mínimo
                this.timeoutIds[idIndicador] = setTimeout(() => { //Mostrar una alerta despues de un tiempo
                    //Mostrar una alerta con el mensaje, según lo requiera el mono
                    this.tituloAlerta.innerHTML = textoTituloDialog;
                    this.lblAlerta.innerHTML = textoLblDialog;
                    this.dlgAlerta.mostrar();
                }, 5000);

                return; //No hacer nada más
            }

            this.actualizarIndicador(idIndicador); //Actualizar su indicador

            this.disminuirNivel(idIndicador); //Volver a disminuir despues de unos segundos
        }, espera);
    }

    /**
     * Actualizar la vista del indicador según su id, que debe ser uno de COMIDA, SUENO o BANO
     */
    actualizarIndicador(idIndicador) {
        let pixs = parseInt(ALTO_INDICADORES * (this.niveles[idIndicador] / MAX)); //Calcular la altura de la vista del indicador

        switch (idIndicador) {
            case 'COMIDA':
            case 'SUENO':
                //Actualizar la interfaz
                this.indicadores[idIndicador].style.height = pixs + "px"; //Actualizar la altura
                this.indicadores[idIndicador].style.top = (ALTO_INDICADORES - pixs) + "px"; //Actualizar la posicion
                this.indicadores[idIndicador].style.backgroundColor = COLORES[parseInt(this.niveles[idIndicador] / 2)]; //Actualizar el color
                break;
            case 'BANO':
                //Actualizar la interfaz
                //Este se muestra al revés de los otros dos indicadores
                this.indicadores[idIndicador].style.height = (ALTO_INDICADORES - pixs) + "px"; //Actualizar la altura
                this.indicadores[idIndicador].style.top = pixs + "px"; //Actualizar la posicion
                this.indicadores[idIndicador].style.backgroundColor = COLORES[parseInt(this.niveles[idIndicador] / 2)]; //Actualizar el color
                break;
            default:
                this.error();
                return;
        }
    }

    /**
     * Actualizar el estado de durmiendo y aumentar o disminuir el nivel de sueño, según sea el caso.
     * 
     * Este debería ser el único metodo que llame a los otros dos, ya que es el que decide si se debe disminuir o aumentar
     * 
     * @param {boolean} durmiendo Nuevo estado de durmiendo
     */
    setDurmiendo(durmiendo) {
        this.durmiendo = durmiendo; //Actualizar el estado

        clearTimeout(this.timeoutIds['SUENO']); //No ejecutar la última disminución o aumento

        if (this.durmiendo == true) { //Si está durmiendo
            this.aumentarNivel('SUENO'); //Aumentar el nivel
        } else { //Si no está durmiendo
            this.disminuirNivel('SUENO'); //Disminuir el nivel
        }
    }

    /**
     * Si ocurre un error, mostrar un mensaje de error
     */
    error() {
        //Mostrar una alerta con el mensaje de error
        this.tituloAlerta.innerHTML = "ERROR";
        this.lblAlerta.innerHTML = "Ha ocurrido algo inesperado en la pagina";
        this.dlgAlerta.mostrar();

        //Detener el juego
        clearTimeout(this.timeoutIds['COMIDA']);
        clearTimeout(this.timeoutIds['SUENO']);
        clearTimeout(this.timeoutIds['BANO']);
    }

}
