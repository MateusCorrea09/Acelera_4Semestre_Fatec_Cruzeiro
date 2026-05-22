import styled from 'styled-components';

// ========================================
// CONTAINER
// ========================================

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
`;

// ========================================
// CONTENT
// ========================================

export const Content = styled.div`
  width: 100%;
  max-width: 500px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// ========================================
// INPUT
// ========================================

export const Input = styled.input`
  width: 100%;
  padding: 14px;

  border-radius: 10px;
  border: 1px solid #ccc;

  margin-bottom: 15px;

  font-size: 1rem;

  outline: none;

  transition: 0.2s;

  &:focus {
    border-color: #4f46e5;
  }
`;

// ========================================
// SELECT
// ========================================

export const Select = styled.select`
  width: 100%;
  padding: 14px;

  border-radius: 10px;
  border: 1px solid #ccc;

  margin-bottom: 20px;

  font-size: 1rem;

  background: white;

  outline: none;

  cursor: pointer;

  transition: 0.2s;

  &:focus {
    border-color: #4f46e5;
  }
`;

// ========================================
// TEXTO INFORMATIVO
// ========================================

export const InfoText = styled.p`
  font-size: 0.95rem;
  color: #666;

  margin-bottom: 15px;
`;