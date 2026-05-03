import React from "react";
import * as S from './style';

export function Button({ children, ...props }) {
    return <S.MyButton {...props}>{children}</S.MyButton>;
}

export function NotificationButton({ icon, onClick, ...props }) {
    return (
        <S.NotificationButton onClick={onClick} {...props}>
            {icon}
        </S.NotificationButton>
    );
}

export function BackButton({ children, ...props }) {
    return <S.BtnVoltar {...props}>{children}</S.BtnVoltar>;
}

export function LinkButton({ children, ...props }) {
    return <S.LinkButton {...props}>{children}</S.LinkButton>;
}