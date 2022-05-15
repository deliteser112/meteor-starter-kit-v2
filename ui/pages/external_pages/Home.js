import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
// sections
import { HomeHero, HomeMinimal, HomePricingPlans } from '../../sections/home';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Meteor Starter Kit">
      <HomeHero />

      <ContentStyle>
        <HomeMinimal />
        <HomePricingPlans />
      </ContentStyle>
    </Page>
  );
}
