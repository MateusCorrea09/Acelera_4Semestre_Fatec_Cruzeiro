import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './container/home-Aluno'
import MyGlobalStyles from './assets/styles/globalstyles'
import HomeProfessor from './container/home-Professor'
import RegistroUsuario from './container/RegistroUsuario'
import Login from './container/Login'
import Homealuno from './container/home-Aluno'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyGlobalStyles />
    <Homealuno />

  </React.StrictMode>,
)
