import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  NavContainer,
  NavContent,
  Logo,
  LogoImage,
  NavLinks,
  NavLink,
  NavHashLink,
  AuthButtons,
  Button,
  UserMenu,
  UserMenuButton,
  UserMenuDropdown,
  UserMenuLink,
  MobileMenuButton,
  MobileAuthButtons,
} from './styles';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isHomePage = location.pathname === '/';

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/?section=${sectionId}`);
    }
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const closeMenus = () => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/" onClick={closeMenus}>
          <LogoImage src="/images/logo.png" alt="ASVALE - Associação dos Revendedores de Defensivos Agrícolas do Vale do Jaguari" />
        </Logo>

        <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>

        <NavLinks $isOpen={showMobileMenu}>
          {isHomePage ? (
            <>
              <NavHashLink onClick={() => scrollToSection('sobre')}>
                Sobre Nós
              </NavHashLink>
              <NavHashLink onClick={() => scrollToSection('servicos')}>
                Serviços
              </NavHashLink>
              <NavHashLink onClick={() => scrollToSection('contato')}>
                Contato
              </NavHashLink>
            </>
          ) : (
            <>
              <NavLink to="/?section=sobre" onClick={closeMenus}>
                Sobre Nós
              </NavLink>
              <NavLink to="/?section=servicos" onClick={closeMenus}>
                Serviços
              </NavLink>
              <NavLink to="/?section=contato" onClick={closeMenus}>
                Contato
              </NavLink>
            </>
          )}
          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={closeMenus}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" onClick={closeMenus}>
              Admin
            </NavLink>
          )}
          {!isAuthenticated && (
            <MobileAuthButtons>
              <Button as={Link} to="/login" $variant="outline" onClick={closeMenus}>
                Entrar
              </Button>
              <Button as={Link} to="/register" $variant="solid" onClick={closeMenus}>
                Cadastrar
              </Button>
            </MobileAuthButtons>
          )}
        </NavLinks>

        <AuthButtons>
          {isAuthenticated ? (
            <UserMenu>
              <UserMenuButton onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUser /> {user?.name}
              </UserMenuButton>
              {showUserMenu && (
                <UserMenuDropdown>
                  <UserMenuLink to="/profile" onClick={closeMenus}>
                    <FaUser /> Meu Perfil
                  </UserMenuLink>
                  <button onClick={handleSignOut} className="user-menu-button">
                    <FaSignOutAlt /> Sair
                  </button>
                </UserMenuDropdown>
              )}
            </UserMenu>
          ) : (
            <>
              <Button as={Link} to="/login" $variant="outline" onClick={closeMenus}>
                Entrar
              </Button>
              <Button as={Link} to="/register" $variant="solid" onClick={closeMenus}>
                Cadastrar
              </Button>
            </>
          )}
        </AuthButtons>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 