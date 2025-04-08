import React, { useState, ChangeEvent } from 'react';
import './App.css';

export function App() {
  const [mood, setMood] = useState('');
  const [size, setSize] = useState(50); // Default size in percentage
  const [grayscale, setGrayscale] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSize(Number(event.target.value));
  };

  const handleGrayscaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGrayscale(event.target.checked);
  };

  const handleMoodSelection = (selectedMood: string) => {
    setMood(selectedMood);
    setSelectedMood(selectedMood);
  };

  const handleGenerateImage = () => {
    // Logic for image generation will go here
    alert(
      `Generating image with mood: ${selectedMood}, size: ${size}%, grayscale: ${grayscale}`
    );
  };

  return (
    <div className='App'>
      <div className='header'>
        <h1>Create Your Mood Image</h1>
        <p>Choose your mood and generate your personalized image.</p>
      </div>

      <div className='mood-selector'>
        <div className='mood-option' onClick={() => handleMoodSelection('Happy')}>
          <span className={selectedMood === 'Happy' ? 'selected' : ''}>🙂 Happy</span>
        </div>
        <div className='mood-option' onClick={() => handleMoodSelection('Calm')}>
          <span className={selectedMood === 'Calm' ? 'selected' : ''}>😌 Calm</span>
        </div>
        <div className='mood-option' onClick={() => handleMoodSelection('Excited')}>
          <span className={selectedMood === 'Excited' ? 'selected' : ''}>
            🤩 Excited
          </span>
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
}

export default App;
