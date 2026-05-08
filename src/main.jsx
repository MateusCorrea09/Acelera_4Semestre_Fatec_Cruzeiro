import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './container/Homealuno'
import MyGlobalStyles from './assets/styles/globalstyles'
import HomeProfessor from './container/HomeProfessor'
import RegistroUsuario from './container/RegistroUsuario'
import Login from './container/Login'
import Homealuno from './container/Homealuno'
import ManagerTurma from './container/ManagerTurma'
import CreateQuiz2 from './container/CreateQuiz2'
import Reports from './container/Reports'
import QuizSession from './container/QuizSession'
import StudentHistory from './container/StudentHistory'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyGlobalStyles />
    <StudentHistory/>

  </React.StrictMode>,
)
