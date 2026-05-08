import styled from 'styled-components';

export const Container = styled.div`
  padding: 30px;
`;

export const Header = styled.div`
  margin-bottom: 25px;

  h1 {
    color: #333;
    margin-bottom: 8px;
  }

  p {
    color: #777;
  }
`;

export const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const HistoryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #FDEEDC;

  cursor: pointer;

  transition: 0.3s;

  display: flex;
  flex-direction: column;
  gap: 15px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 140, 66, 0.1);
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong {
      color: #333;
      font-size: 1.1rem;
    }

    span {
      color: #888;
      font-size: 0.8rem;
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;

    small {
      color: #666;
    }
  }

  .view-btn {
    margin-top: auto;

    background: #FFF9F5;
    border: 1px solid #FF8C42;

    color: #FF8C42;

    padding: 10px;

    border-radius: 10px;

    font-weight: bold;

    cursor: pointer;

    transition: 0.2s;

    &:hover {
      background: #FF8C42;
      color: white;
    }
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  max-height: 60vh;

  overflow-y: auto;

  padding-right: 10px;
`;

export const ReviewItem = styled.div`
  display: flex;
  gap: 15px;

  padding: 15px;

  border-radius: 12px;

  background: ${({ isRight }) =>
    isRight ? '#F0FFF4' : '#FFF5F5'};

  border: 1px solid ${({ isRight }) =>
    isRight ? '#C6F6D5' : '#FED7D7'};

  .status-dot {
    width: 12px;
    height: 12px;

    border-radius: 50%;

    margin-top: 5px;

    flex-shrink: 0;

    background: ${({ isRight }) =>
      isRight ? '#4CAF50' : '#E53E3E'};
  }

  .content {
    flex: 1;
  }

  .question-text {
    color: #2D3748;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 5px;

    font-size: 0.9rem;

    .user-res {
      color: ${({ isRight }) =>
        isRight ? '#2F855A' : '#C53030'};
    }

    .correct-res {
      color: #2F855A;
    }
  }
`;