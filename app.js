// Global variables
let audioContext;
let workletNode;
let analyser;
let source;
let stream;
let map;
let results = {
  feedbackEvents: [],
  testResults: [],
  locations: []
};

// DOM elements
const startLiveBtn = document.getElementById('start-live');
const stopLiveBtn = document.getElementById('stop-live');
const thresholdSlider = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const spectrogramCanvas = document.getElementById('spectrogram');
const feedbackFrequenciesDiv = document.getElementById('feedback-frequencies');
const runSweepBtn = document.getElementById('run-sweep');
const playToneBtn = document.getElementById('play-tone');
const stopToneBtn = document.getElementById('stop-tone');
const getLocationBtn = document.getElementById('get-location');
const addManualLocationBtn = document.getElementById('add-manual-location');
const locationInfoDiv = document.getElementById('location-info');
const exportResultsBtn = document.getElementById('export-results');
const clearResultsBtn = document.getElementById('clear-results');
const resultsDataPre = document.getElementById('results-data');
const startFreqInput = document.getElementById('start-freq');
const endFreqInput = document.getElementById('end-freq');
const sweepDurationInput = document.getElementById('sweep-duration');
const testToneFreqInput = document.getElementById('test-tone-freq');

// Oscillator for test tones
let testOscillator = null;
let testGainNode = null;

// Initialize the app
async function init() {
  // Check for AudioContext support
  if (!window.AudioContext && !window.webkitAudioContext) {
    alert('Web Audio API is not supported in your browser.');
    return;
  }

  // Create AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Load AudioWorklet
  try {
    await audioContext.audioWorklet.addModule('audio-processor.js');
    console.log('AudioWorklet loaded successfully.');
  } catch (err) {
    console.error('Failed to load AudioWorklet:', err);
    alert('Failed to load AudioWorklet. Check the console for details.');
    return;
  }

  // Set up AnalyserNode
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Set up spectrogram canvas
  const ctx = spectrogramCanvas.getContext('2d');
  function drawSpectrogram() {
    requestAnimationFrame(drawSpectrogram);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, spectrogramCanvas.width, spectrogramCanvas.height);

    const barWidth = spectrogramCanvas.width / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      // Highlight feedback frequencies (e.g., > 200)
      ctx.fillStyle = dataArray[i] > 200 ? 'red' : 'rgba(0, 150, 255, 0.7)';
      ctx.fillRect(i * barWidth, spectrogramCanvas.height - barHeight, barWidth, barHeight);
    }
  }

  // Start/Stop Live Monitoring
  startLiveBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      source = audioContext.createMediaStreamSource(stream);

      // Create AudioWorkletNode
      workletNode = new AudioWorkletNode(audioContext, 'feedback-detector');
      workletNode.parameters.get('threshold').value = thresholdSlider.value / 255;

      // Connect nodes
      source.connect(workletNode);
      workletNode.connect(analyser);
      analyser.connect(audioContext.destination); // Optional: Pass through to output

      // Handle messages from AudioWorklet
      workletNode.port.onmessage = (e) => {
        if (e.data.type === 'feedback-detected') {
          const frequency = getDominantFrequency();
          feedbackFrequenciesDiv.textContent = `Feedback Frequencies: ${frequency} Hz`;
          results.feedbackEvents.push({
            frequency: frequency,
            time: new Date().toISOString(),
            location: locationInfoDiv.textContent.replace('Location: ', '')
          });
        }
      };

      // Start drawing spectrogram
      drawSpectrogram();

      startLiveBtn.disabled = true;
      stopLiveBtn.disabled = false;
    } catch (err) {
      console.error('Error starting live monitoring:', err);
      alert('Could not access microphone. Please ensure permissions are granted.');
    }
  });

  stopLiveBtn.addEventListener('click', () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (source) {
      source.disconnect();
    }
    if (workletNode) {
      workletNode.disconnect();
    }
    startLiveBtn.disabled = false;
    stopLiveBtn.disabled = true;
    feedbackFrequenciesDiv.textContent = 'Feedback Frequencies: None';
  });

  // Threshold slider
  thresholdSlider.addEventListener('input', () => {
    thresholdValue.textContent = thresholdSlider.value;
    if (workletNode) {
      workletNode.parameters.get('threshold').value = thresholdSlider.value / 255;
    }
  });

  // Test Mode: Frequency Sweep
  runSweepBtn.addEventListener('click', () => {
    const startFreq = parseFloat(startFreqInput.value);
    const endFreq = parseFloat(endFreqInput.value);
    const duration = parseFloat(sweepDurationInput.value);

    if (startFreq >= endFreq) {
      alert('Start frequency must be less than end frequency.');
      return;
    }

    // Stop any existing test tone
    stopTestTone();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(startFreq, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);

    // Analyze feedback during sweep
    const sweepResults = [];
    const checkFeedback = () => {
      const frequency = getDominantFrequency();
      if (frequency > 0) {
        sweepResults.push(frequency);
      }
      if (audioContext.currentTime < now + duration) {
        setTimeout(checkFeedback, 100);
      } else {
        testResultsDiv.textContent = `Test Results: Feedback at ${sweepResults.join(', ')} Hz`;
        results.testResults.push({
          type: 'sweep',
          startFreq: startFreq,
          endFreq: endFreq,
          duration: duration,
          feedbackFrequencies: sweepResults,
          time: new Date().toISOString()
        });
      }
    };
    checkFeedback();
  });

  // Test Mode: Single Tone
  playToneBtn.addEventListener('click', () => {
    const frequency = parseFloat(testToneFreqInput.value);
    if (frequency < 20 || frequency > 20000) {
      alert('Frequency must be between 20 Hz and 20 kHz.');
      return;
    }

    stopTestTone();

    testOscillator = audioContext.createOscillator();
    testGainNode = audioContext.createGain();

    testOscillator.type = 'sine';
    testOscillator.frequency.value = frequency;
    testGainNode.gain.value = 0.5;

    testOscillator.connect(testGainNode);
    testGainNode.connect(audioContext.destination);

    testOscillator.start();
    playToneBtn.disabled = true;
    stopToneBtn.disabled = false;
  });

  stopToneBtn.addEventListener('click', stopTestTone);

  function stopTestTone() {
    if (testOscillator) {
      testOscillator.stop();
      testOscillator = null;
    }
    if (testGainNode) {
      testGainNode.disconnect();
      testGainNode = null;
    }
    playToneBtn.disabled = false;
    stopToneBtn.disabled = true;
  }

  // Location Mapping
  getLocationBtn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = { lat, lng, name: 'Current Location' };
          results.locations.push(location);
          locationInfoDiv.textContent = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          updateMap(location);
        },
        err => {
          console.error('Error getting location:', err);
          alert('Could not retrieve location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported in your browser.');
    }
  });

  addManualLocationBtn.addEventListener('click', () => {
    const name = prompt('Enter a name for this location:');
    if (name) {
      const location = { name, lat: null, lng: null };
      results.locations.push(location);
      locationInfoDiv.textContent = `Location: ${name} (Manual)`;
      updateMap(location);
    }
  });

  // Initialize map (Leaflet)
  function updateMap(location) {
    if (!map) {
      map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    }

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new marker
    if (location.lat && location.lng) {
      L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(location.name || 'Current Location');
      map.setView([location.lat, location.lng], 15);
    }
  }

  // Helper: Get dominant frequency from AnalyserNode
  function getDominantFrequency() {
    if (!analyser) return 0;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    // Convert bin index to frequency
    return (maxIndex * audioContext.sampleRate) / analyser.fftSize;
  }

  // Export results
  exportResultsBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feedback-detector-results.json';
    link.click();
    URL.revokeObjectURL(url);
  });

  // Clear results
  clearResultsBtn.addEventListener('click', () => {
    results = {
      feedbackEvents: [],
      testResults: [],
      locations: []
    };
    resultsDataPre.textContent = 'No data yet.';
    locationInfoDiv.textContent = 'Location: Not set';
    feedbackFrequenciesDiv.textContent = 'Feedback Frequencies: None';
    testResultsDiv.textContent = 'Test Results: None';
  });

  // Update results display
  setInterval(() => {
    resultsDataPre.textContent = JSON.stringify(results, null, 2);
  }, 1000);
}

// Initialize the app
init();
