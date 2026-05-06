import styled from "styled-components";

// 1. Botão Base/Principal (O seu MyButton)
export const MyButton = styled.button`
    border-radius: 12px;
    height: 40px;
    width: 200px;
    border: none;
    font-weight: bold;
    transition: 0.2s;
    cursor: pointer;
    pointer-events: auto;
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

// 2. Alias para compatibilidade com a página de Gerenciamento
export const PrimaryButton = MyButton;

// 3. Botão de Voltar
export const BtnVoltar = styled(MyButton)`
    background-color: transparent;
    color: #e67e3a;
    width: auto;
    align-self: flex-start;

    &:hover {
        background-color: #ffe3d1;
    }
`;

// 4. Botão de Notificação (Circular)
export const NotificationButton = styled(MyButton)`
    background-color: #FDEEDC;
    color: #FF8C42; 
    width: 45px;
    height: 45px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.2rem;
    border: 1px solid #FAD4AE;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #FF8C42;
        color: white;
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }
`;

// 5. Link Button
export const LinkButton = styled(MyButton)`
    background-color: transparent;
    color: #FF8C42;
    width: auto;
    height: auto;
    padding: 0;
    font-size: 14px;
    text-decoration: underline;
    align-self: flex-end;

    &:hover {
        background-color: transparent;
        opacity: 0.7;
        text-decoration: none;
    }

    &:active {
        transform: none;
    }
`;