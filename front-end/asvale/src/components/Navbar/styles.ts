import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

export const NavContent = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};
`;

export const LogoImage = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

interface NavLinksProps {
  $isOpen: boolean;
}

export const NavLinks = styled.div<NavLinksProps>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    width: 100vw;
    height: calc(100vh - 80px);
    background: rgba(255,255,255,0.97);
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease-in-out;
    z-index: 1000;
    align-items: flex-start;
  }
`;

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const NavHashLink = styled.button`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const MobileAuthButtons = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    width: 100%;
    margin-top: 24px;
  }
`;

interface ButtonProps {
  $variant?: 'solid' | 'outline' | 'success';
}

export const Button = styled(Link)<ButtonProps>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  backdrop-filter: blur(5px);

  ${({ theme, $variant = 'solid' }) => {
    switch ($variant) {
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          box-shadow: 0 0 0 rgba(43, 122, 75, 0);

          &:hover {
            background: rgba(43, 122, 75, 0.1);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(43, 122, 75, 0.15);
          }

          &:active {
            transform: translateY(0);
          }
        `;
      case 'success':
        return `
          background: rgba(52, 211, 153, 0.9);
          color: ${theme.colors.white};
          border: none;
          box-shadow: 0 0 0 rgba(52, 211, 153, 0);

          &:hover {
            background: rgba(52, 211, 153, 1);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(52, 211, 153, 0.2);
          }

          &:active {
            transform: translateY(0);
          }
        `;
      default:
        return `
          background: rgba(43, 122, 75, 0.9);
          color: ${theme.colors.white};
          border: none;
          box-shadow: 0 0 0 rgba(43, 122, 75, 0);

          &:hover {
            background: rgba(28, 75, 46, 0.95);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(43, 122, 75, 0.2);
          }

          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const UserMenu = styled.div`
  position: relative;
`;

export const UserMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray.light};
  }
`;

export const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;

  .user-menu-button {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    transition: background-color 0.2s;
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    text-align: left;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: ${({ theme }) => theme.colors.gray.light};
    }

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray.light};
    }
  }
`;

export const UserMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray.light};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray.light};
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`; 