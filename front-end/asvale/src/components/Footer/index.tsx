import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  SectionTitle,
  SocialLinks,
  SocialLink,
  ContactInfo,
  ContactItem,
  Copyright,
} from './styles';

const Footer: React.FC = () => {
  const IconComponent = ({ icon: Icon }: { icon: React.ComponentType<IconBaseProps> }) => <Icon />;

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>Redes Sociais</SectionTitle>
          <SocialLinks>
            <SocialLink href="https://facebook.com/asvale" target="_blank">
              <FaFacebook />
            </SocialLink>
            <SocialLink href="https://instagram.com/asvale" target="_blank">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="https://wa.me/5555999999999" target="_blank">
              <FaWhatsapp />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Contato</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <FaEnvelope />
              <span>contato@asvale.com.br</span>
            </ContactItem>
            <ContactItem>
              <FaWhatsapp />
              <span>(55) 99999-9999</span>
            </ContactItem>
          </ContactInfo>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Endereço</SectionTitle>
          <ContactInfo>
            <ContactItem>
              Rua Principal, 123 - Centro
              <br />
              Santiago - RS, 97700-000
            </ContactItem>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} ASVALE - Associação dos Revendedores de Defensivos Agrícolas do Vale do Jaguari
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 