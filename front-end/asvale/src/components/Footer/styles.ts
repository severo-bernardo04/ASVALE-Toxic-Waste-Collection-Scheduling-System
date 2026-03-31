import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.2rem;
  margin: 0;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9rem;

  svg {
    font-size: 1.2rem;
  }
`;

export const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.white}20;
  color: ${({ theme }) => theme.colors.white}90;
  font-size: 0.9rem;
`; 