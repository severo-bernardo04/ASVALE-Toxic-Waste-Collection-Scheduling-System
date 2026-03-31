import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.header`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.xxl};
  max-width: 1200px;
  margin: 0 auto;
`;

export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  @media (min-width: 700px) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(39,174,96,0.10);
  overflow: hidden;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 12px 36px rgba(39,174,96,0.18);
  }
`;

export const CardHeader = styled.div`
  padding: 28px 32px 18px 32px;
  background: #f8faf9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    color: #27ae60;
    font-size: 1.35rem;
    font-weight: 800;
    margin: 0;
  }
`;

export const CardContent = styled.div`
  padding: 0 32px 32px 32px;

  p {
    margin-bottom: 14px;
    font-size: 1.08rem;
    line-height: 1.6;
    &:last-child {
      margin-bottom: 0;
    }
    strong {
      color: #222;
      font-weight: 700;
    }
  }
`;

export const StatusBadge = styled.span<{ color: string }>`
  background: ${({ color }) => color}22;
  color: ${({ color }) => color};
  padding: 7px 18px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(39,174,96,0.08);
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 18px;
  justify-content: flex-end;
`;

export const Button = styled.button<{ variant?: 'success' | 'danger' }>`
  background: ${({ variant }) =>
    variant === 'success'
      ? '#27ae60'
      : variant === 'danger'
      ? '#e74c3c'
      : '#27ae60'};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 22px;
  cursor: pointer;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  transition: opacity 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(39,174,96,0.10);

  &:hover {
    opacity: 0.85;
    box-shadow: 0 4px 16px rgba(39,174,96,0.13);
  }

  svg {
    width: 22px;
    height: 22px;
  }
`; 