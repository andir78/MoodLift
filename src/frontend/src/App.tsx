/// <reference types="react" />
import { useState, ChangeEvent } from 'react';
import './App.css'; // Import the external CSS file for styling
import { generateImage } from './services/api';

type MoodType = 'Happy' | 'Calm' | 'Excited' | '';

const App = () => {
  const [mood, setMood] = useState<MoodType>('');
  const [size, setSize] = useState<number>(50); // Default size in percentage
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleMoodSelect = (selectedMood: MoodType): void => {
    setMood(selectedMood);
    setError(null);
  };

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSize(Number(event.target.value));
  };

  const handleGrayscaleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setGrayscale(event.target.checked);
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (!mood) {
      setError('Please select a mood first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const response = await generateImage({
        mood,
        size,
        grayscale,
      });
      setGeneratedImageUrl(response.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='App'>
      <div className='header'>
        <h1>Create Your Mood Image</h1>
        <p>Choose your mood and generate your personalized image.</p>
      </div>

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
          <label>Size: {size}%</label>
          <input
            type='range'
            min='0'
            max='100'
            value={size}
            onChange={handleSizeChange}
          />
        </div>

        <div className='grayscale-checkbox'>
          <input
            type='checkbox'
            checked={grayscale}
            onChange={handleGrayscaleChange}
          />
          <label>Grayscale</label>
        </div>
      </div>

      {error && <div className='error-message'>{error}</div>}

      <div className='generate-btn-container'>
        <button 
          className='generate-btn' 
          onClick={handleGenerateImage}
          disabled={isLoading || !mood}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {generatedImageUrl && (
        <div className='generated-image-container'>
          <img 
            src={generatedImageUrl} 
            alt="Generated mood image" 
            className='generated-image'
          />
        </div>
      )}
    </div>
  );
};

// Log to console
console.log('Hello console');

export default App;
