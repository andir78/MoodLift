import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
}));

const AsciiArtDisplay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  fontFamily: 'monospace',
  whiteSpace: 'pre',
  overflow: 'auto',
  maxHeight: 300,
  border: `1px solid ${theme.palette.divider}`,
}));

const MoodLift: React.FC = () => {
  const [mood, setMood] = useState('');
  const [asciiArt, setAsciiArt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!mood) {
      setError('Please enter a mood');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/ascii-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: mood,
          size: 100,
          grayscale: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ASCII art');
      }

      const data = await response.json();
      setAsciiArt(data.art);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          MoodLift
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Generate ASCII art based on your mood
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <StyledPaper sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              How are you feeling?
            </Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Enter your mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <StyledButton
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate ASCII Art'}
            </StyledButton>
          </StyledPaper>

          <StyledPaper sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Your ASCII Art
            </Typography>
            {asciiArt ? (
              <AsciiArtDisplay>
                {asciiArt}
              </AsciiArtDisplay>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Your ASCII art will appear here
              </Typography>
            )}
          </StyledPaper>
        </Box>
      </Box>
    </Container>
  );
};

export default MoodLift; 