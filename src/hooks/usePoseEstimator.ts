import { useState, useCallback } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export const usePoseEstimator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processVideo = useCallback(async (
    videoFile: File,
    onComplete: (processedVideoUrl: string) => void
  ) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Create video element from file and add to DOM (important for some browsers)
      const videoUrl = URL.createObjectURL(videoFile);
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.muted = true;
      videoElement.playsInline = true; // Important for mobile/production
      videoElement.style.display = 'none';
      document.body.appendChild(videoElement); // Add to DOM

      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = resolve;
        videoElement.onerror = reject;
      });

      console.log('Video loaded:', {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        duration: videoElement.duration
      });

      // Create canvas for drawing
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Initialize MediaPipe Pose with error handling
      const pose = new Pose({
        locateFile: (file) => {
          const url = `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          console.log('Loading MediaPipe file:', url);
          return url;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // Check MediaRecorder support and get best mime type
      const getSupportedMimeType = () => {
        const types = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ];
        
        for (const type of types) {
          if (MediaRecorder.isTypeSupported(type)) {
            console.log('Using mime type:', type);
            return type;
          }
        }
        
        throw new Error('No supported video mime type found');
      };

      const mimeType = getSupportedMimeType();

      // Setup MediaRecorder for output
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log('Chunk recorded:', e.data.size, 'bytes');
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
      };

      const processedVideoPromise = new Promise<string>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          console.log('Recording stopped, creating blob from', chunks.length, 'chunks');
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };

        // Add timeout
        setTimeout(() => {
          reject(new Error('Video processing timeout'));
        }, 5 * 60 * 1000); // 5 minutes timeout
      });

      // Process each frame
      let frameCount = 0;
      const fps = 30;
      const duration = videoElement.duration;
      const totalFrames = Math.floor(duration * fps);

      console.log('Starting processing:', { totalFrames, duration, fps });

      let isProcessingFrame = false;

      pose.onResults((results) => {
        if (!results.image) {
          console.warn('No image in results');
          return;
        }

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.poseLandmarks) {
          // Draw pose landmarks
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 4
          });
          drawLandmarks(ctx, results.poseLandmarks, {
            color: '#FF0000',
            lineWidth: 2,
            radius: 6
          });
        }

        ctx.restore();

        // Update progress
        frameCount++;
        const currentProgress = Math.min((frameCount / totalFrames) * 100, 99);
        setProgress(Math.floor(currentProgress));

        if (frameCount % 30 === 0) {
          console.log('Progress:', Math.floor(currentProgress) + '%');
        }

        isProcessingFrame = false;
      });

      // Start recording
      mediaRecorder.start();
      console.log('MediaRecorder started');

      // Process video frame by frame
      const processFrame = async () => {
        try {
          if (videoElement.currentTime < videoElement.duration && !isProcessingFrame) {
            isProcessingFrame = true;
            
            // Send frame to pose estimation
            await pose.send({ image: videoElement });
            
            // Move to next frame
            videoElement.currentTime += 1 / fps;
            
            // Continue processing
            requestAnimationFrame(processFrame);
          } else if (videoElement.currentTime >= videoElement.duration) {
            // Finish processing
            console.log('Video processing complete');
            
            // Wait a bit for last frames to be processed
            await new Promise(resolve => setTimeout(resolve, 500));
            
            mediaRecorder.stop();
            pose.close();
            setProgress(100);
            
            const processedUrl = await processedVideoPromise;
            console.log('Processed video URL ready');
            onComplete(processedUrl);
            
            // Cleanup
            URL.revokeObjectURL(videoUrl);
            document.body.removeChild(videoElement);
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error in processFrame:', error);
          throw error;
        }
      };

      // Start processing
      videoElement.currentTime = 0;
      await processFrame();

    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      setProgress(0);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Video processing failed: ${error.message}`);
      } else {
        throw new Error('Video processing failed with unknown error');
      }
    }
  }, []);

  return {
    processVideo,
    isProcessing,
    progress
  };
};
