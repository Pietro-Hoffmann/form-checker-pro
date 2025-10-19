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
      // Create video element from file
      const videoUrl = URL.createObjectURL(videoFile);
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.muted = true;

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      // Create canvas for drawing
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d')!;

      // Initialize MediaPipe Pose
      const pose = new Pose({
        locateFile: (file) => {
          return `/mediapipe/pose/${file}`;
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

      // Setup MediaRecorder for output
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const processedVideoPromise = new Promise<string>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
      });

      // Process each frame
      let frameCount = 0;
      const fps = 30;
      const duration = videoElement.duration;
      const totalFrames = Math.floor(duration * fps);

      pose.onResults((results) => {
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
      });

      // Start recording
      mediaRecorder.start();

      // Process video frame by frame
      const processFrame = async () => {
        if (videoElement.currentTime < videoElement.duration) {
          await pose.send({ image: videoElement });
          videoElement.currentTime += 1 / fps;
          requestAnimationFrame(processFrame);
        } else {
          // Finish processing
          mediaRecorder.stop();
          pose.close();
          setProgress(100);
          
          const processedUrl = await processedVideoPromise;
          onComplete(processedUrl);
          
          // Cleanup
          URL.revokeObjectURL(videoUrl);
          setIsProcessing(false);
        }
      };

      // Start processing
      videoElement.currentTime = 0;
      await processFrame();

    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      setProgress(0);
      throw error;
    }
  }, []);

  return {
    processVideo,
    isProcessing,
    progress
  };
};