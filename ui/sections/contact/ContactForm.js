import React from 'react';
// @mui
import { Button, Typography, TextField, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function ContactForm() {
  return (
    <Stack spacing={5}>
      <Typography variant="h3">
        Feel free to contact us. <br />
        We'll be glad to hear from you, buddy.
      </Typography>

      <Stack spacing={3}>
        <TextField fullWidth label="Name" />

        <TextField fullWidth label="Email" />

        <TextField fullWidth label="Subject" />

        <TextField fullWidth label="Enter your message here." multiline rows={4} />
      </Stack>

      <Button size="large" variant="contained">
        Submit Now
      </Button>
    </Stack>
  );
}
