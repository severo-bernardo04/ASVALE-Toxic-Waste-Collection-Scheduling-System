import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 80px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin: 0;
`;

export const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

interface TabButtonProps {
  active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, active }) =>
      active ? theme.colors.secondary : theme.colors.primary}20;
  }
`;

export const SearchBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

export const SchedulesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ScheduleCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ScheduleHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ScheduleInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ScheduleType = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

interface ScheduleStatusProps {
  color: string;
}

export const ScheduleStatus = styled.span<ScheduleStatusProps>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
`;

export const ScheduleDate = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ScheduleDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const ScheduleActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  button {
    flex: 1;
  }
`;

export const UsersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const UserName = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
`;

export const UserEmail = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

export const UserCompany = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
`; 