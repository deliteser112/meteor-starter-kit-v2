import React from 'react';
// @mui
import { Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonUserSettings() {
  return (
    <Stack spacing={1}>
      {[...Array(5)].map((_, index) => (
        <Stack direction="row" spacing={1} alignItems="center" key={index}>
          <Skeleton variant="circular" sx={{ width: 55, height: 55 }} />
          <Skeleton variant="rectangular" sx={{ width: 1, height: 60, borderRadius: 1 }} />
          <Skeleton variant="circular" sx={{ width: 45, height: 45 }} />
          <Skeleton variant="circular" sx={{ width: 45, height: 45 }} />
        </Stack>
      ))}
    </Stack>
  );
}
