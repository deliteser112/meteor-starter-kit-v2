import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// components
import Page from '../../components/Page';
import { ContactHero, ContactForm } from '../../sections/contact';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function Contact() {
  return (
    <Page title="Contact us">
      <RootStyle>
        <ContactHero />

        <Container sx={{ my: 10 }}>
          <ContactForm />
        </Container>
      </RootStyle>
    </Page>
  );
}
