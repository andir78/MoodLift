/// <reference types="react" />
import { useState, ChangeEvent } from 'react';
import './App.css'; // Import the external CSS file for styling
import { generateImage } from './services/api';

type MoodType = 'Happy' | 'Calm' | 'Excited' | '';

const App = () => {
  const [mood, setMood] = useState<MoodType>('');
  const [size, setSize] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string | null>(null);

  const handleMoodSelect = (selectedMood: MoodType): void => {
    setMood(selectedMood);
    setError(null);
  };

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSize(Number(event.target.value));
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (!mood) {
      setError('Please select a mood first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAsciiArt(null);

    try {
      const response = await generateImage({
        mood,
        size,
      });
      setAsciiArt(response.art);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ASCII art');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='App'>
      <div className='header'>
        <h1>Create Your Mood ASCII Art</h1>
        <p>Choose your mood and generate your personalized ASCII art.</p>
      </div>

      <div className='main-content'>
        <div className='content-area'>
          <div className='options-panel'>
            <div className='mood-selector column'>
              <div className={`mood-option ${mood === 'Happy' ? 'selected' : ''}`} onClick={() => handleMoodSelect('Happy')}>
                <span>🙂 Happy</span>
              </div>
              <div className={`mood-option ${mood === 'Calm' ? 'selected' : ''}`} onClick={() => handleMoodSelect('Calm')}>
                <span>😌 Calm</span>
              </div>
              <div className={`mood-option ${mood === 'Excited' ? 'selected' : ''}`} onClick={() => handleMoodSelect('Excited')}>
                <span>🤩 Excited</span>
              </div>
            </div>

            <div className='image-settings'>
              <div className='slider-container'>
                <label>Size: {size}% ({10 + Math.floor(size * 0.9)} lines)</label>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={size}
                  onChange={handleSizeChange}
                />
              </div>
            </div>

            {error && <div className='error-message'>{error}</div>}

            <div className='generate-btn-container'>
              <button 
                className='generate-btn' 
                onClick={handleGenerateImage}
                disabled={isLoading || !mood}
              >
                {isLoading ? 'Generating...' : 'Generate ASCII Art'}
              </button>
            </div>
          </div>

          <div className='result-panel'>
            {asciiArt ? (
              <div className='ascii-art-container'>
                <pre className='ascii-art'>{asciiArt}</pre>
              </div>
            ) : (
              <div className='ascii-art-container'>
                <p>Your ASCII art will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Log to console
console.log('Hello console');

export default App;
