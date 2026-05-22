import styled from "styled-components";

export const Container = styled.div`
  
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;

  padding: 50px;
  background-color: #FFF9F5;
  min-height: 100vh;
  width: 100%;

  & > div{
    flex: 1;
    display: flex;
    justify-content: center;
  }

  h1 { 
    color: #FF8C42; 
    font-size: 32px;
    margin-bottom: 20px;
  }
`
export const Input = styled.input`
  border: 1px solid #ffe3d1;
  border-radius: 30px;
  height: 40px;
  background-color: #ffe3d1;
  color: #291b11;
  font-size: 16px;
  padding-left:10px;
  outline: none;
`
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  width: 100%;
  
`
export const RegisterContainer = styled.div`
  margin-top: 22px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  font-size: 0.95rem;
  color: #777;
`;

export const RegisterLink = styled.button`
  background: none;
  border: none;

  color: #FF8C42;

  font-weight: 600;
  cursor: pointer;

  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;