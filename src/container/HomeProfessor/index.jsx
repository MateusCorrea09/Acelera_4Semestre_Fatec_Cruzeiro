import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import * as S from './style';
import InfoCard from '../../components/InfoCard';
import { Modal, NotificationModal } from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

function HomeProfessor() {

  const navigate = useNavigate();

  // =========================================================================
  // ESTADOS
  // =========================================================================

  const [turmas, setTurmas] = useState([]);
  const [idTurmaAtiva, setIdTurmaAtiva] = useState(null);

  const [nomeTurmaAtiva, setNomeTurmaAtiva] =
    useState('Carregando...');

  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [isNotifOpen, setIsNotifOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  // =========================================================================
  // PROFESSOR LOGADO
  // =========================================================================

  const idProfessorLogado =
    localStorage.getItem('idUsuario');

  // =========================================================================
  // HEADERS
  // =========================================================================

  const requestHeaders = {
    'Content-Type': 'application/json',

    ...(idProfessorLogado && {
      'x-professor-id': idProfessorLogado
    })
  };

  // =========================================================================
  // BUSCAR TURMAS
  // =========================================================================

  useEffect(() => {

    if (
      !idProfessorLogado ||
      idProfessorLogado === 'null'
    ) {
      return;
    }

    carregarTurmas();
    carregarNotificacoes();

  }, [idProfessorLogado]);

  // =========================================================================
  // CARREGAR TURMAS
  // =========================================================================

  const carregarTurmas = async () => {

    try {

      const response = await fetch(
        `http://localhost:3001/turmas-professor/${idProfessorLogado}`,
        {
          method: 'GET',
          headers: requestHeaders
        }
      );

      const data = await response.json();

      if (!Array.isArray(data)) {

        setTurmas([]);
        setLoading(false);

        return;
      }

      setTurmas(data);

      if (data.length > 0) {

        const turmaSalva =
          localStorage.getItem('idTurmaAtiva');

        const turmaEncontrada =
          data.find(
            (t) =>
              String(t.id) ===
              String(turmaSalva)
          );

        const turmaInicial =
          turmaEncontrada || data[0];

        setIdTurmaAtiva(turmaInicial.id);

        setNomeTurmaAtiva(
          turmaInicial.nome
        );

        localStorage.setItem(
          'idTurmaAtiva',
          turmaInicial.id
        );

      } else {

        setNomeTurmaAtiva(
          'Nenhuma turma cadastrada'
        );
      }

    } catch (error) {

      console.error(error);

      setTurmas([]);
    }
  };

  // =========================================================================
  // CARREGAR NOTIFICAÇÕES
  // =========================================================================

  const carregarNotificacoes = async () => {

    try {

      const response = await fetch(
        `http://localhost:3001/professor/${idProfessorLogado}/notificacoes-pendentes`,
        {
          method: 'GET',
          headers: requestHeaders
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {

        setNotifications(data);

      } else {

        setNotifications([]);
      }

    } catch (error) {

      console.error(error);

      setNotifications([]);
    }
  };

  // =========================================================================
  // BUSCAR ALUNOS MATRICULADOS
  // =========================================================================

  useEffect(() => {

    if (
      !idTurmaAtiva ||
      idTurmaAtiva === 'null'
    ) {
      return;
    }

    carregarAlunos();

  }, [idTurmaAtiva]);

  // =========================================================================
  // CARREGAR ALUNOS
  // =========================================================================

  const carregarAlunos = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/alunos/turma/${idTurmaAtiva}`,
        {
          method: 'GET',
          headers: requestHeaders
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {

        setAlunos(data);

      } else {

        setAlunos([]);
      }

    } catch (error) {

      console.error(error);

      setAlunos([]);

    } finally {

      setLoading(false);
    }
  };

  // =========================================================================
  // APROVAR / RECUSAR
  // =========================================================================

  const handleDecidirSolicitacao =
    async (
      idTurma,
      idAluno,
      acao
    ) => {

      try {

        const response = await fetch(
          'http://localhost:3001/turmas/decidir-solicitacao',
          {
            method: 'PUT',

            headers: requestHeaders,

            body: JSON.stringify({
              idTurma,
              idAluno,
              acao
            })
          }
        );

        const data =
          await response.json();

        if (!data.success) {

          alert(
            data.error ||
            'Erro ao processar solicitação'
          );

          return;
        }

        // ============================================
        // REMOVE NOTIFICAÇÃO
        // ============================================

        setNotifications((prev) =>
          prev.filter(
            (n) =>
              !(
                n.idAluno === idAluno &&
                n.idTurma === idTurma
              )
          )
        );

        // ============================================
        // RECARREGA ALUNOS
        // ============================================

        carregarAlunos();

      } catch (error) {

        console.error(error);

        alert(
          'Erro ao decidir solicitação'
        );
      }
    };

  // =========================================================================
  // ALTERAR TURMA
  // =========================================================================

  const alterarTurma = (
    id,
    nome
  ) => {

    setIdTurmaAtiva(id);

    setNomeTurmaAtiva(nome);

    localStorage.setItem(
      'idTurmaAtiva',
      id
    );
  };

  // =========================================================================
  // ABRIR MODAL
  // =========================================================================

  const abrirDetalhes = (aluno) => {

    setSelectedStudent(aluno);

    setIsModalOpen(true);
  };

  // =========================================================================
  // MENU
  // =========================================================================

  const menuConfig = [

    {
      label: "Dashboard",
      onClick: () =>
        navigate('/home-professor')
    },

    {
      label: "Atividade",
      onClick: () =>
        navigate('/criar-quiz')
    },

    {
      label: "Minhas Salas",
      onClick: () =>
        navigate('/gerenciar-turmas')
    },

    {
      label: "Relatórios",
      onClick: () =>
        navigate('/relatorios')
    },

    {
      label: "Sair",

      onClick: () => {

        localStorage.clear();

        navigate('/');
      }
    }
  ];

  // =========================================================================
  // RENDER
  // =========================================================================

  return (

    <DashboardLayout
      sidebarTitle="Professor"
      menuItems={menuConfig}
      userName={`Prof. ${localStorage.getItem('userName') ||
        'Professor'
        }`}
    >

      <S.Panel>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '100%'
          }}
        >

          <S.SearchBar style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Pesquisar aluno(a)"
            />
          </S.SearchBar>

          {/* SELECT TURMAS */}

          {turmas.length > 1 ? (

            <select
              value={idTurmaAtiva || ''}

              onChange={(e) => {

                const selecionada =
                  turmas.find(
                    (t) =>
                      String(t.id) ===
                      String(e.target.value)
                  );

                if (selecionada) {

                  alterarTurma(
                    selecionada.id,
                    selecionada.nome
                  );
                }
              }}
            >

              {turmas.map((t) => (

                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.nome}
                </option>
              ))}

            </select>

          ) : (

            turmas.length === 1 && (

              <span>
                📍 {turmas[0].nome}
              </span>
            )
          )}

          {/* SININHO */}

          {/* SININHO */}

          <div
            style={{
              position: 'relative'
            }}
          >

            <button
              onClick={() =>
                setIsNotifOpen(!isNotifOpen)
              }

              style={{
                position: 'relative',
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              🔔

              {notifications.length > 0 && (

                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </button>

            <NotificationModal
              isOpen={isNotifOpen}
              notifications={notifications}
              onDecidir={
                handleDecidirSolicitacao
              }
            />

          </div>
        </div>

        {/* LISTA */}

        <S.InteractionsArea>

          <div className="label-tab">

            {nomeTurmaAtiva}

          </div>

          <S.CarouselTrack>

            {loading ? (

              <p>Carregando alunos...</p>

            ) : alunos.length === 0 ? (

              <p>
                Nenhum aluno matriculado
                nesta turma.
              </p>

            ) : (

              alunos.map((aluno, index) => (

                <motion.div
                  key={
                    aluno.id ||
                    index
                  }

                  initial={{
                    opacity: 0,
                    y: 20
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  transition={{
                    delay: index * 0.1
                  }}
                >

                  <InfoCard
                    icon="👨‍🎓"

                    title={
                      aluno.nome
                    }

                    tag={
                      aluno.sala
                    }

                    footerText={
                      <>
                        RESULTADO
                        <br />

                        {
                          aluno.nota !== null
                            ? aluno.nota
                            : '---'
                        }
                      </>
                    }

                    onClick={() =>
                      abrirDetalhes(aluno)
                    }
                  />

                </motion.div>
              ))
            )}

          </S.CarouselTrack>

        </S.InteractionsArea>

        <S.FooterPanel>
          Resumo da aula de hoje
        </S.FooterPanel>

      </S.Panel>

      {/* MODAL */}

      <Modal
        isOpen={isModalOpen}

        onClose={() =>
          setIsModalOpen(false)
        }

        title="Detalhes do Aluno"
      >

        {selectedStudent && (

          <>
            <h2>
              Desempenho de {
                selectedStudent.nome
              }
            </h2>

            <p>
              <strong>Acertos:</strong>

              {
                selectedStudent.acertos ||
                0
              }
            </p>

            <p>
              <strong>Avaliação:</strong>

              {
                selectedStudent.desempenho ||
                'Sem dados'
              }
            </p>
          </>
        )}

      </Modal>

    </DashboardLayout>
  );
}

export default HomeProfessor;