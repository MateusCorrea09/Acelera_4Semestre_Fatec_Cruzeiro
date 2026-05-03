import styled from "styled-components";

export const Container = styled.div`
 
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 100px;
  background-color: #FFF9F5; 
  min-height: 100vh;

  h1 { 
    color: #FF8C42; 
    font-size: 32px;
    margin-bottom: 20px;
  }
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-self: center;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(255, 140, 66, 0.1);
`;
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
export const Card = styled.div`
display: flex;
justify-content: space-between;
background-color: #ffe3d1;
margin: 10px;
padding: 10px;
width: 400px;
border-radius: 10px;
 & p{
    margin: 5px 0;
    color: #ffffff;
    font-weight: bold;
    & span{ 
      font-weight: normal;
    }
  }
  & button{
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  & button:hover{
      opacity: 0.8;
    }
`