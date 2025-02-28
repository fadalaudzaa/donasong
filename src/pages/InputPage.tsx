import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { InputHeader } from '../components/input/InputHeader';
import { InputForm } from '../components/input/InputForm';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export default function InputPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Donasong Request';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <PageContainer>
      <InputHeader />
      <InputForm onNavigateToQueue={() => navigate('/queue')} />
    </PageContainer>
  );
} 