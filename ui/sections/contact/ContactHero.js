import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid } from '@mui/material';
//
// ----------------------------------------------------------------------

const CONTACTS = [
  {
    country: 'Bali',
    address: '508 Bridle Avenue Newnan, GA 30263',
    phoneNumber: '(239) 555-0108',
  },
  {
    country: 'London',
    address: '508 Bridle Avenue Newnan, GA 30263',
    phoneNumber: '(319) 555-0115',
  },
  {
    country: 'Prague',
    address: '508 Bridle Avenue Newnan, GA 30263',
    phoneNumber: '(252) 555-0126',
  },
  {
    country: 'Moscow',
    address: '508 Bridle Avenue Newnan, GA 30263',
    phoneNumber: '(307) 555-0133',
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: 'url(/static/home/overlay.svg), url(/static/contact/contact-hero.jpg)',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function ContactHero() {
  return (
    <RootStyle>
      <Container sx={{ position: 'relative', height: '100%' }}>
        <ContentStyle>
          <Typography variant="h4">Where to find us?</Typography>

          <Grid container spacing={5} sx={{ mt: 5, color: 'common.white' }}>
            {CONTACTS.map((contact) => (
              <Grid key={contact.country} item xs={12} sm={6} md={3} lg={2} sx={{ pr: { md: 5 } }}>
                  <Typography variant="h6" paragraph>
                    {contact.country}
                  </Typography>
                  <Typography variant="body2">
                    {contact.address}
                    <br /> {contact.phoneNumber}
                  </Typography>
              </Grid>
            ))}
          </Grid>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
