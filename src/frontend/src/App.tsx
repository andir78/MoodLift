/// <reference types="react" />
import { useState, ChangeEvent } from 'react';
import './App.css'; // Import the external CSS file for styling

type MoodType = 'Happy' | 'Calm' | 'Excited' | '';

const App = () => {
  const [mood, setMood] = useState<MoodType>('');
  const [size, setSize] = useState<number>(50); // Default size in percentage
  const [grayscale, setGrayscale] = useState<boolean>(false);

  const handleMoodSelect = (selectedMood: MoodType): void => {
    setMood(selectedMood);
  };

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSize(Number(event.target.value));
  };

  const handleGrayscaleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setGrayscale(event.target.checked);
  };

  const handleGenerateImage = (): void => {
    alert(
      `Generating image with mood: ${mood}, size: ${size}%, grayscale: ${grayscale}`
    );
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

      <div className='generate-btn-container'>
        <button className='generate-btn' onClick={handleGenerateImage}>
          Generate Image
        </button>
      </div>
    </div>
  );
};

// Log to console
console.log('Hello console');

export default App;
