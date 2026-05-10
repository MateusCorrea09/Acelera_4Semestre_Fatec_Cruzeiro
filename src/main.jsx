import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Seus componentes
import MyGlobalStyles from './assets/styles/globalstyles'
import Login from './container/Login'
import HomeProfessor from './container/HomeProfessor'
import Homealuno from './container/Homealuno'
import ManagerTurma from './container/ManagerTurma'
import CreateQuiz2 from './container/CreateQuiz2'
import Reports from './container/Reports'
// ... outros imports

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MyGlobalStyles />
      <Routes>
        {/* Página inicial é o Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas do Professor */}
        <Route path="/home-professor" element={<HomeProfessor />} />
        <Route path="/gerenciar-turmas" element={<ManagerTurma />} />
        <Route path="/criar-quiz" element={<CreateQuiz2 />} />
        <Route path="/relatorios" element={<Reports />} />

        {/* Rotas do Aluno */}
        <Route path="/home-aluno" element={<Homealuno />} />
        
        {/* Redireciona qualquer rota inexistente para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)