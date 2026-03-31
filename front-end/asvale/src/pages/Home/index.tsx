import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaTruck, FaUsers, FaLeaf } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';
import {
  Container,
  Hero,
  HeroContent,
  Title,
  Subtitle,
  ActionButton,
  Section,
  SectionTitle,
  SectionContent,
  Grid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  ContactSection,
  ContactInfo,
  ContactForm,
  VideoBackground,
} from './styles';
import { Form, FormField, Button } from '../../components/Form';

const Home: React.FC = () => {
  const IconComponent = ({ icon: Icon }: { icon: React.ComponentType<IconBaseProps> }) => <Icon />;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Container>
      <Hero>
        <VideoBackground autoPlay muted loop playsInline>
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </VideoBackground>
        <HeroContent>
          <img src="/images/logo.png" alt="ASVALE - Associação dos Revendedores de Defensivos Agrícolas do Vale do Jaguari" />
          <Title>ASVALE</Title>
          <Subtitle>
            Associação dos Revendedores de Defensivos Agrícolas do Vale do Jaguari
          </Subtitle>
          <ActionButton as={Link} to="/register">
            Faça Parte
          </ActionButton>
        </HeroContent>
      </Hero>

      <Section id="sobre">
        <SectionTitle>Nossa Missão</SectionTitle>
        <SectionContent>
          <p>
            A ASVALE tem como missão promover a gestão responsável de embalagens
            de defensivos agrícolas, contribuindo para a preservação do meio
            ambiente e o desenvolvimento sustentável da agricultura na região do
            Vale do Jaguari.
          </p>
          <p>
            Nossa associação atua como um elo fundamental entre produtores rurais,
            revendedores e a cadeia de logística reversa, garantindo o correto
            descarte e processamento das embalagens vazias de agrotóxicos.
          </p>
        </SectionContent>
      </Section>

      <Section id="servicos">
        <SectionTitle>Nossos Serviços</SectionTitle>
        <Grid>
          <Card>
            <CardIcon>
              <FaRecycle />
            </CardIcon>
            <CardTitle>Coleta de Embalagens</CardTitle>
            <CardDescription>
              Sistema eficiente de coleta e processamento de embalagens vazias
              de defensivos agrícolas.
            </CardDescription>
          </Card>

          <Card>
            <CardIcon>
              <FaTruck />
            </CardIcon>
            <CardTitle>Logística Reversa</CardTitle>
            <CardDescription>
              Gerenciamento completo do ciclo de vida das embalagens, desde a
              coleta até a destinação final.
            </CardDescription>
          </Card>

          <Card>
            <CardIcon>
              <FaUsers />
            </CardIcon>
            <CardTitle>Treinamento</CardTitle>
            <CardDescription>
              Capacitação e orientação sobre o manejo correto de embalagens e
              boas práticas agrícolas.
            </CardDescription>
          </Card>

          <Card>
            <CardIcon>
              <FaLeaf />
            </CardIcon>
            <CardTitle>Sustentabilidade</CardTitle>
            <CardDescription>
              Promoção de práticas sustentáveis e conscientização ambiental
              junto à comunidade agrícola.
            </CardDescription>
          </Card>
        </Grid>
      </Section>

      <ContactSection id="contato">
        <SectionTitle>Entre em Contato</SectionTitle>
        <Grid>
          <ContactInfo>
            <h3>Informações de Contato</h3>
            <p>
              <strong>Endereço:</strong> Rua Principal, 123 - Centro
              <br />
              Santiago - RS, 97700-000
            </p>
            <p>
              <strong>Telefone:</strong> (55) 3251-0000
            </p>
            <p>
              <strong>Email:</strong> contato@asvale.org.br
            </p>
            <p>
              <strong>Horário de Atendimento:</strong>
              <br />
              Segunda a Sexta: 08:00 - 18:00
              <br />
              Sábado: 08:00 - 12:00
            </p>
          </ContactInfo>

          <ContactForm>
            <Form onSubmit={handleContactSubmit}>
              <FormField
                label="Nome"
                type="text"
                name="name"
                placeholder="Seu nome completo"
              />
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="seu@email.com"
              />
              <FormField
                label="Assunto"
                type="text"
                name="subject"
                placeholder="Assunto da mensagem"
              />
              <FormField
                label="Mensagem"
                name="message"
                as="textarea"
                placeholder="Digite sua mensagem"
              />
              <Button type="submit">Enviar Mensagem</Button>
            </Form>
          </ContactForm>
        </Grid>
      </ContactSection>
    </Container>
  );
};

export default Home; 