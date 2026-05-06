import styled from "styled-components";

export const Card = styled.div`
  background-color: white;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #FDEEDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(255, 140, 66, 0.1);
    border-color: #FF8C42;
  }

  .icon-placeholder {
    width: 90px;
    height: 90px;
    background-color: #FFF1E6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .tag {
    background-color: #FDEEDC;
    color: #FF8C42;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .footer-box {
    background: linear-gradient(135deg, #FF8C42, #FFA45B);
    width: 100%;
    padding: 10px;
    border-radius: 12px;
    color: white;
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;