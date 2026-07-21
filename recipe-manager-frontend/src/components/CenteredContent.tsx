import { Box, Card, CardContent, Stack } from '@mui/material';
import * as React from 'react';

interface CenteredContentProps {
  children?: React.ReactNode;
}

export const CenteredContent = ({ children }: CenteredContentProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'grid',
      justifyItems: 'center',
      alignItems: 'start',
      px: 1,
      pt: 2,
    }}
  >
    <Card sx={{ width: '100%', maxWidth: 1480 }}>
      <CardContent sx={{ py: 6, px: 4 }}>
        <Stack direction="column" spacing={4} sx={{ width: '100%', alignItems: 'center' }}>
          {children}
        </Stack>
      </CardContent>
    </Card>
  </Box>
);
