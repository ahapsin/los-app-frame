<template>
  <div>
    <h2>Capture Image Using Camera</h2>
    <video ref="video" autoplay></video>
    <button @click="captureImage">Capture Image</button>

    <!-- Display Captured Image -->
    <div v-if="capturedImage">
      <h3>Captured Image:</h3>
      <img :src="capturedImage" alt="Captured Image"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      capturedImage: null, // Holds the captured image URL
    };
  },
  mounted() {
    // Request camera access and display the video feed
    this.startCamera();
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        this.$refs.video.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    },
    captureImage() {
      const videoElement = this.$refs.video;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions based on video feed
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw the current frame from the video onto the canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert canvas image to data URL
      this.capturedImage = canvas.toDataURL('image/png');
    }
  }
};
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}

img {
  margin-top: 20px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
