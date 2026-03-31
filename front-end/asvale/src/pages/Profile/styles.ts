import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: 96px;
`;

export const ProfileSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: 2.25rem;
    font-weight: 900;
    text-align: center;
  }
`;

export const UserInfo = styled.div`
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  max-width: 420px;
  margin: 0 auto;
  gap: 24px;

  > div {
    background: ${({ theme }) => theme.colors.white};
    border-radius: 16px;
    padding: 20px 36px;
    min-width: 260px;
    box-shadow: 0 4px 20px rgba(39,174,96,0.10);
    text-align: center;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
  }

  p {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #444;
    text-align: center;
    &:last-child {
      margin-bottom: 0;
    }
    strong {
      color: ${({ theme }) => theme.colors.text};
      margin-right: ${({ theme }) => theme.spacing.sm};
    }
  }

  @media (max-width: 600px) {
    min-width: 0;
    max-width: 100%;
    > div {
      padding: 16px 8px;
      min-width: 0;
      font-size: 0.95rem;
    }
  }
`;

export const SchedulesSection = styled.section`
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const ScheduleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ScheduleCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSize.sm};

    strong {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const ScheduleStatus = styled.div<{ color: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const Button = styled.button<{ variant?: 'danger' }>`
  background: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.error : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const NoSchedules = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`;