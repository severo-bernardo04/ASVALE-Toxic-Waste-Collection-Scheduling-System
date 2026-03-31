import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: 93.75%; // 15px
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 87.5%; // 14px
    }
  }

  button {
    cursor: pointer;
  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    line-height: 1.5;
  }

  input, button, textarea, select {
    font: inherit;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .with-navbar-padding {
    padding-top: 80px;
  }
`; 