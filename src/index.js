// // import { saludar } from './componentes/componentes.js'
import './styles.css';
import {_} from './assets/underscore-min'

const miModulo = (() => {
    //Crea un nuevo scope, que no tiene referencia por nombre, para que no pueda ser llamado.
    //aplica el modo estricto al codigo contenido
    'use strict';

    let     baraja     = [];

    const   simbolos   = ['C', 'D', 'S', 'H'],
            especiales = ['A', 'J', 'Q', 'K'];

    const   btnPedir      = document.querySelector('#btnPedirCarta'),
            btnDetener    = document.querySelector('#btnDetenerCarta'),
            btnNuevoJuego = document.querySelector('#btnNuevoJuego');

    const   divCartasJugadores     = document.querySelectorAll('.divCartas'),
            txtPuntajesJugadores   = document.querySelectorAll('small');

    let     puntosJugadores = [];

    //Inicializar Juego con una cantidad de 2 Jugadores, Inicializa en 0, los puntosJugadores
    const inicializarJuego = (numJugadores = 2) => {
        baraja = [];
        baraja = crearBaraja();       
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        divCartasJugadores.forEach  (element => element.innerHTML = '');
        txtPuntajesJugadores.forEach(element => element.innerText = 0 );
        crearEscenario();
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }
    
    const crearEscenario = () => {
        crearCarta('grey_back', 0);
        crearCarta('grey_back', 0);
        crearCarta('grey_back', puntosJugadores.length - 1);
        crearCarta('grey_back', puntosJugadores.length - 1);
    }
    //Crear Baraja
    const crearBaraja = () => {

        //Recorre 10 posiciones para crear cartas del 2 al 10.
        for (let i = 2; i <= 10; i++) {
            //Agrega el Simbolo correspondiente a cada posición.
            for (let simbolo of simbolos) {
                baraja.push(i + simbolo);
            }
        }

        //Recorre cada elemento del arreglo Simbolos.
        for (let simbolo of simbolos) {
            //Recorre cada elemento del arreglo especiales.
            for (let especial of especiales) {
                baraja.push(especial + simbolo)
            }
        }

        //Se usa la libreria Underscore para barajear las cartas de la baraja usando el método shuffle
        return _.shuffle(baraja);;

    }

    //Toma una carta de encima de la baraja.
    const pedirCarta = () => {
        if (baraja.length === 0) {
            //Lanza un error en consola.
            throw 'No hay cartas en la baraja';
        }
        return baraja.pop();
    }

    //Extrae la parte inicial del texto de la carta para validar el valor y retornar el correspondiente.
    const identificarValorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
            return (isNaN(valor)) ?
                ((valor === 'A') ? 11 : 10) :
                valor * 1;
    }

    //La última posición del arreglo puntosJugadores, será siempre para la máquina.
    const acumularPuntos = (carta,turno) => {
        puntosJugadores[turno]             = puntosJugadores[turno] + identificarValorCarta(carta);
        txtPuntajesJugadores[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) =>{
        const imgCarta     = document.createElement('img');
        imgCarta.src       = `assets/cartas/${ carta }.png`;
        imgCarta.classList = 'carta animated slideInLeft';
        divCartasJugadores[turno].append(imgCarta);
    }
    const imprimirAlerta = (mensaje, icono, color) => {
        Swal.fire({
            title: `${mensaje}`,
            iconHtml: `<span class="fa-regular fa-xl ${icono}"></span>`,
            color: `rgb(${color})`,
            backdrop: `
            rgba(${color},0.4)
            left top
            no-repeat
          `
        });
    }
    //Desestructura el arreglo puntos Jugadores 
    const determinarGanador = () => {

        const [puntosMinimos,
               puntajeMaquina] = puntosJugadores;

        setTimeout(() => {
            if (puntajeMaquina === puntosMinimos) {
                imprimirAlerta('Empate','fa-smile', '239, 127, 26');
            } else if (puntosMinimos > 21) {
                imprimirAlerta('Gana la Computadora','fa-sad-tear','248, 0, 0');                
            } else if (puntajeMaquina > 21) {
                imprimirAlerta('Gana el Jugador','fa-smile', '0, 143, 57');
            } else{
                imprimirAlerta('Gana la Computadora','fa-sad-tear','248, 0, 0');               
            }
        }, 1000);
    }

    //Turno Computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntajeMaquina = 0;

        do {    
            const carta    = pedirCarta();
            puntajeMaquina = acumularPuntos(carta,puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);         
                }
        while ((puntosMinimos > puntajeMaquina) && (puntosMinimos <= 21));
        
        determinarGanador();
    }

    //Eventos
    btnPedir.addEventListener('click', () => {
        const carta          = pedirCarta();
        const puntajeJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntajeJugador > 21) {
            turnoComputadora(puntosJugadores[0]);
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
        } 
        else if (puntajeJugador === 21) {
            turnoComputadora(puntosJugadores[0]);
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
        }
    });

    btnDetener.addEventListener('click', () => {
        turnoComputadora(puntosJugadores[0]);
        btnPedir.disabled = true;
        btnDetener.disabled = true;
    });

    btnNuevoJuego.addEventListener('click', () => {
          inicializarJuego();
     });


})();