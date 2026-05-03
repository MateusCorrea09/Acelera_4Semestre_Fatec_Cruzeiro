import React from "react"
import * as S from './style'

function FormBase({ title, children, ...props }) {
  return (
    <S.StyledForm {...props}>
      {title && <h1>{title}</h1>}
      {children}
    </S.StyledForm>
  );
}
export default FormBase