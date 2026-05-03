// Define the AudioWorkletProcessor for custom feedback detection
class FeedbackDetectorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.threshold = 0.5; // Default threshold (0-1)
    this.feedbackDetected = false;
    this.lastFeedbackTime = 0;
    this.cooldown = 100; // ms cooldown to avoid repeated detections
  }

  // Called when the processor is created
  static get parameterDescriptors() {
    return [{
      name: 'threshold',
      defaultValue: 0.5,
      minValue: 0,
      maxValue: 1,
      automationRate: 'k-rate'
    }];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input) return true;

    // Update threshold from parameters (if changed)
    const threshold = parameters.threshold;
    if (threshold.length > 0) {
      this.threshold = threshold[0];
    }

    // Check each channel for peaks
    for (let channel = 0; channel < input.length; channel++) {
      const samples = input[channel];
      for (let i = 0; i < samples.length; i++) {
        // Simple peak detection (replace with more advanced logic)
        if (Math.abs(samples[i]) > this.threshold) {
          const now = Date.now();
          if (now - this.lastFeedbackTime > this.cooldown) {
            this.feedbackDetected = true;
            this.lastFeedbackTime = now;
            // Send message to main thread
            this.port.postMessage({
              type: 'feedback-detected',
              value: samples[i],
              time: now
            });
          }
        }
      }
    }

    // Pass through audio (optional)
    if (outputs[0]) {
      for (let channel = 0; channel < outputs[0].length; channel++) {
        outputs[0][channel].set(input[channel]);
      }
    }

    return true;
  }
}

// Register the processor
registerProcessor('feedback-detector', FeedbackDetectorProcessor);
