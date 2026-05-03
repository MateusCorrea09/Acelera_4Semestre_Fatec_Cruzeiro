import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import * as S from './style';

import InfoCard from '../../components/Infocard';
import { NotificationButton } from '../../components/Buttons';

import { Modal, NotificationModal } from '../../components/Modal';

function Homealuno() {
    const [HistoricoQuiz] = useState([
        { id: 1, nome: 'Multiplicação Nível 2', data: '29/11/2000', pontuacao: 4 }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const abrirDetalhes = (Quiz) => {
        setSelectedQuiz(Quiz);
        setIsModalOpen(true);
    };

    const mockNotifs = [
        { id: 1, text: "Novo quiz disponível: Matemática", time: "5 min atrás" },
        { id: 2, text: "Sua nota foi postada!", time: "2 horas atrás" }
    ];

    const menuConfig = [
        { label: "Dashboard", onClick: () => console.log("Home") },
        { label: "Minha Sala", onClick: () => console.log("Salas") },
        { label: "Histórico", onClick: () => console.log("Relatorios") },
        { label: "Sair", onClick: () => console.log("Sair") },
    ];

    /*
    console.log("DashboardLayout:", DashboardLayout);
    console.log("InfoCard:", InfoCard);
    console.log("Modal:", Modal);
    console.log("NotificationModal:", NotificationModal);
    console.log("NotificationButton:", NotificationButton);
    */
    return (
        <DashboardLayout
            sidebarTitle="Aluno"
            menuItems={menuConfig}
            userName="Marcos Algusto"
        >
            <S.Panel>
                <S.SearchBar>
                    <input type="text" placeholder="Pesquisar atividade" />

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <NotificationButton
                            icon="🔔"
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        />
                        <NotificationModal isOpen={isNotifOpen} notifications={mockNotifs} />
                    </div>
                </S.SearchBar>

                <S.InteractionsArea>
                    <div className="label-tab">Turma 9º A</div>
                    <S.CarouselTrack>
                        {HistoricoQuiz.map((Quiz, index) => (
                            <motion.div
                                key={Quiz.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <InfoCard
                                    icon="📝"
                                    title={Quiz.nome}
                                    tag={Quiz.data}
                                    footerText={<>SUA NOTA <br /> {Quiz.pontuacao}</>}
                                    onClick={() => abrirDetalhes(Quiz)}
                                />
                            </motion.div>
                        ))}
                    </S.CarouselTrack>
                </S.InteractionsArea>

                <S.FooterPanel>Resumo da aula de hoje</S.FooterPanel>
            </S.Panel>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Detalhes do Quiz"
            >
                {selectedQuiz && (
                    <>
                        <h2 style={{ color: '#FF8C42' }}>Desempenho de {selectedQuiz.nome}</h2>
                        <p><strong>Pontuação:</strong> {selectedQuiz.pontuacao}</p>
                        <p><strong>Data:</strong> {selectedQuiz.data}</p>
                        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                            Dados coletados via Projeto.
                        </p>
                    </>
                )}
            </Modal>
        </DashboardLayout>
    );
}

export default Homealuno;