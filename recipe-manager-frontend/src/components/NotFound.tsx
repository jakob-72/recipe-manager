import { Typography } from '@mui/material';

interface NotFoundProps {
  title?: string;
  content?: string;
}

export const NotFound = ({ title, content }: NotFoundProps) => (
  <>
    <Typography variant="h4" component="h1">
      {title || 'Page Not Found'}
    </Typography>

    <Typography variant="body1" color="text.secondary">
      {content ||
        'The page you are looking for does not exist. Please check the URL and try again.'}
    </Typography>
  </>
);
