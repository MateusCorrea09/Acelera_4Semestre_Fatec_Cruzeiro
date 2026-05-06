import React from "react";
import * as S from './style';

// Usando o componente de estilo diretamente como base
export const MyButton = ({ children, ...props }) => {
    return (
        <S.MyButton {...props}>
            {children}
        </S.MyButton>
    );
};

// Aliases
export const Button = MyButton;
export const PrimaryButton = MyButton;

export const NotificationButton = ({ icon, onClick, ...props }) => (
    <S.NotificationButton onClick={onClick} {...props}>
        {icon}
    </S.NotificationButton>
);

export const BackButton = ({ children, ...props }) => (
    <S.BtnVoltar {...props}>{children}</S.BtnVoltar>
);

export const LinkButton = ({ children, ...props }) => (
    <S.LinkButton {...props}>{children}</S.LinkButton>
);