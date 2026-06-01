import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import * as S from './style';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/InfoCard';
import { NotificationButton } from '../../components/Buttons';
import { Modal, NotificationModal } from '../../components/Modal';

function Homealuno() {

    const navigate = useNavigate();

    const [notifications, setNotifications] =
        useState([]);

    const [HistoricoQuiz, setHistoricoQuiz] =
        useState([]);

    const [quizzesDisponiveis, setQuizzesDisponiveis] =
        useState([]);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [selectedQuiz, setSelectedQuiz] =
        useState(null);

    const [isNotifOpen, setIsNotifOpen] =
        useState(false);

    const [isQuizModalOpen, setIsQuizModalOpen] =
        useState(false);

    // =====================================================
    // ABRIR DETALHES DO QUIZ DO HISTÓRICO
    // =====================================================

    const abrirDetalhes = (quiz) => {

        setSelectedQuiz(quiz);

        setIsModalOpen(true);
    };

    // =====================================================
    // CARREGAR DADOS
    // =====================================================

    useEffect(() => {

        const idAluno =
            localStorage.getItem('idAluno');

        if (!idAluno) return;

        // ==========================================
        // HISTÓRICO
        // ==========================================

        fetch(
            `http://localhost:3001/aluno/${idAluno}/dashboard`
        )
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {

                    setHistoricoQuiz(data);

                } else {

                    setHistoricoQuiz([]);
                }

            })
            .catch(err => {

                console.error(
                    'Erro dashboard:',
                    err
                );
            });

        // ==========================================
        // NOTIFICAÇÕES
        // ==========================================

        fetch(
            `http://localhost:3001/aluno/${idAluno}/notificacoes`
        )
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {

                    setNotifications(data);

                } else {

                    setNotifications([]);
                }

            })
            .catch(err => {

                console.error(
                    'Erro notificações:',
                    err
                );
            });

        // ==========================================
        // QUIZZES DISPONÍVEIS
        // ==========================================

        fetch(
            `http://localhost:3001/aluno/${idAluno}/quizzes`
        )
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {

                    setQuizzesDisponiveis(data);

                } else {

                    setQuizzesDisponiveis([]);
                }

            })
            .catch(err => {

                console.error(
                    'Erro quizzes:',
                    err
                );
            });

    }, []);

    // =====================================================
    // MENU
    // =====================================================

    const menuConfig = [

        {
            label: "Dashboard",
            onClick: () => navigate('/home-aluno')
        },

        {
            label: "Minha Sala",
            onClick: () => console.log("Minha Sala")
        },

        {
            label: "Histórico",
            onClick: () =>
                navigate('/StudentHistory')
        },

        {
            label: "Sair",
            onClick: () => {

                localStorage.clear();

                window.location.href = "/";
            }
        }
    ];

    // =====================================================
    // INICIAR QUIZ
    // =====================================================

    const iniciarQuiz = (quiz) => {

    localStorage.setItem(
        'quizSelecionado',
        quiz.IDQUIZ_PK
    );

    localStorage.setItem(
        'tituloQuiz',
        quiz.TITULO
    );

    console.log(
        'ID QUIZ:',
        quiz.IDQUIZ_PK
    );

    navigate('/QuizPage');
};

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DashboardLayout
            sidebarTitle="Aluno"
            menuItems={menuConfig}
            userName={
                localStorage.getItem('userName')
                || 'Aluno'
            }
        >

            <S.Panel>

                {/* ===================================== */}
                {/* TOPO */}
                {/* ===================================== */}

                <S.SearchBar>

                    <input
                        type="text"
                        placeholder="Pesquisar atividade"
                    />

                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >

                        {/* BOTÃO QUIZ */}

                        <button
                            onClick={() =>
                                setIsQuizModalOpen(true)
                            }
                            style={{
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 15px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            📝 Quiz
                        </button>
                        <NotificationModal
                            isOpen={isNotifOpen}
                            notifications={notifications}
                        />

                    </div>

                </S.SearchBar>

                {/* ===================================== */}
                {/* HISTÓRICO */}
                {/* ===================================== */}

                <S.InteractionsArea>

                    <div className="label-tab">
                        Histórico de Atividades
                    </div>

                    <S.CarouselTrack>

                        {HistoricoQuiz.length === 0 ? (

                            <p>
                                Nenhum quiz realizado.
                            </p>

                        ) : (

                            HistoricoQuiz.map(
                                (quiz, index) => (

                                    <motion.div
                                        key={
                                            quiz.id ||
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
                                            delay:
                                                index * 0.15
                                        }}
                                    >

                                        <InfoCard
                                            icon="📝"

                                            title={
                                                quiz.nome
                                            }

                                            tag={
                                                quiz.data
                                            }

                                            footerText={
                                                <>
                                                    SUA NOTA
                                                    <br />

                                                    {
                                                        quiz.pontuacao
                                                    }
                                                </>
                                            }

                                            onClick={() =>
                                                abrirDetalhes(
                                                    quiz
                                                )
                                            }
                                        />

                                    </motion.div>
                                )
                            )
                        )}

                    </S.CarouselTrack>

                </S.InteractionsArea>

                <S.FooterPanel>
                    Resumo da aula de hoje
                </S.FooterPanel>

            </S.Panel>

            {/* ===================================== */}
            {/* MODAL QUIZZES DISPONÍVEIS */}
            {/* ===================================== */}

            <Modal
                isOpen={isQuizModalOpen}
                onClose={() =>
                    setIsQuizModalOpen(false)
                }
                title="Quizzes Disponíveis"
            >

                {quizzesDisponiveis.length === 0 ? (

                    <p>
                        Nenhum quiz disponível.
                    </p>

                ) : (

                    quizzesDisponiveis.map(
                        (quiz) => (

                            <div
                                key={
                                    quiz.IDQUIZ_PK
                                }
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'space-between',
                                    alignItems:
                                        'center',
                                    marginBottom:
                                        '15px'
                                }}
                            >

                                <span>
                                    {quiz.TITULO}
                                </span>

                                <button
                                    onClick={() =>
                                        iniciarQuiz(
                                            quiz
                                        )
                                    }
                                    style={{
                                        background:
                                            '#22c55e',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '8px',
                                        padding:
                                            '8px 15px',
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    Iniciar
                                </button>

                            </div>
                        )
                    )
                )}

            </Modal>

            {/* ===================================== */}
            {/* MODAL HISTÓRICO */}
            {/* ===================================== */}

            <Modal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
                title="Detalhes do Quiz"
            >

                {selectedQuiz && (

                    <>

                        <h2
                            style={{
                                color:
                                    '#FF8C42'
                            }}
                        >
                            Desempenho de {
                                selectedQuiz.nome
                            }
                        </h2>

                        <p>
                            <strong>
                                Pontuação:
                            </strong>{" "}
                            {
                                selectedQuiz.pontuacao
                            }
                        </p>

                        <p>
                            <strong>
                                Data:
                            </strong>{" "}
                            {
                                selectedQuiz.data
                            }
                        </p>

                        <p
                            style={{
                                marginTop:
                                    '15px',
                                fontSize:
                                    '0.9rem'
                            }}
                        >
                            Dados coletados
                            via Projeto.
                        </p>

                    </>
                )}

            </Modal>

        </DashboardLayout>
    );
}

export default Homealuno;