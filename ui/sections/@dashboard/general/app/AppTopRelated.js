import React from 'react';
// @mui
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Rating, CardHeader, Typography, Stack } from '@mui/material';
// utils
import { fCurrency, fShortenNumber } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

export default function AppTopRelated({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AppTopRelated.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

// ----------------------------------------------------------------------

function ApplicationItem({ app }) {
  const theme = useTheme();

  const { shortcut, system, price, rating, review, name } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Image src={shortcut} alt={name} sx={{ width: 24, height: 24 }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Typography variant="subtitle2">{name}</Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
          <Iconify
            width={16}
            height={16}
            icon={system === 'Mac' ? 'ant-design:apple-filled' : 'ant-design:windows-filled'}
          />

          <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
            {system}
          </Typography>

          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={price === 0 ? 'success' : 'error'}
          >
            {price === 0 ? 'Free' : fCurrency(price)}
          </Label>
        </Stack>
      </Box>

      <Stack alignItems="flex-end" sx={{ pr: 3 }}>
        <Rating readOnly size="small" precision={0.5} name="reviews" value={rating} />
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {fShortenNumber(review)}&nbsp;reviews
        </Typography>
      </Stack>
    </Stack>
  );
}

ApplicationItem.propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    review: PropTypes.number,
    shortcut: PropTypes.string,
    system: PropTypes.string,
  }),
};
