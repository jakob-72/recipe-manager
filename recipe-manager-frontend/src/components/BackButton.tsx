import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

export const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        sx={{ alignSelf: 'flex-start' }}
      >
        Back
      </Button>
    </Box>
  );
};
