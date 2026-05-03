import styled from "styled-components";

export const MyButton = styled.button`
    border-radius: 12px;
    height: 40px;
    width: 200px;
    border: none;
    font-weight: bold;
    transition: 0.2s;
    cursor: pointer;
    align-self: center;
    background-color: #e67e3a;
    color: white;

    &:hover {
        opacity: 0.8;
        background-color: #ff9d5c;
    }

    &:active {
        opacity: 0.5;
        transform: scale(0.98);
    }
`;

export const BtnVoltar = styled(MyButton)`
    background-color: transparent;
    color: #e67e3a;
    width: auto;
    align-self: flex-start;

    &:hover {
        background-color: #ffe3d1;
    }
`;

export const NotificationButton = styled(MyButton)`
    background-color: #FDEEDC; /* Creme Pastel para manter a identidade */
    color: #FF8C42; 
    width: 45px;  /* Tamanho fixo para ícones */
    height: 45px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* Torna o botão circular */
    font-size: 1.2rem;
    border: 1px solid #FAD4AE;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #FF8C42;
        color: white;
        transform: scale(1.1); /* Leve aumento para indicar interatividade */
    }

    &:active {
        transform: scale(0.95);
    }
`;

export const LinkButton = styled(MyButton)`
    background-color: transparent;
    color: #FF8C42; /* Laranja da sua paleta profissional */
    width: auto;
    height: auto;
    padding: 0;
    font-size: 14px; /* 8px fica quase ilegível, 14px é melhor para UX */
    text-decoration: underline; /* Opcional: para parecer mais com um link */
    align-self: flex-end; /* Geralmente links de senha ficam à direita */

    &:hover {
        background-color: transparent;
        opacity: 0.7;
        text-decoration: none;
    }

    &:active {
        transform: none; /* Remove o efeito de clique de botão físico */
    }
`;