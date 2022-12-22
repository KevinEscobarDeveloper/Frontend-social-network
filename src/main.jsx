//Importaciones obligatorias de react
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

//Importar assets (recursos: hojas de estilo, imagenes, fuentes)
import "./assets/fonts/fontawesome-free-6.1.2-web/css/all.css";
import "./assets/css/normalize.css";
import "./assets/css/styles.css";
import "./assets/css/responsive.css"

//Carhar configuración react-time-ago
import TimeAgo from 'javascript-time-ago';

import es from 'javascript-time-ago/locale/es.json';

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);

//Arrancar app de react
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />

)
