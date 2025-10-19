import { useState, useEffect, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export const usePoseEstimator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);

  // Initialize PoseLandmarker
  useEffect(() => {
    const createPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          '/wasm'
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `/pose_landmarker_lite.task`,
            delegate: "GPU"
          },
          runningMode: "IMAGE",
          numPoses: 1,
        });
        setPoseLandmarker(landmarker);
      } catch (error) {
        console.error("Error creating PoseLandmarker:", error);
      }
    };
    createPoseLandmarker();
  }, []);

  const processVideo = useCallback(async (videoFile: File, onComplete: (processedVideoUrl: string) => void) => {
    if (!poseLandmarker) {
      console.error("PoseLandmarker not initialized");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const videoUrl = URL.createObjectURL(videoFile);
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;
    videoElement.muted = true;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d')!;
    const drawingUtils = new DrawingUtils(ctx);

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

    const fps = 30;
    const duration = videoElement.duration;
    let currentTime = 0;

    mediaRecorder.start();

    const renderLoop = async () => {
      if (currentTime < duration) {
        videoElement.currentTime = currentTime;
        await new Promise(resolve => videoElement.onseeked = resolve);

        const results = poseLandmarker.detect(videoElement);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        if (results.landmarks) {
          for (const landmark of results.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
        }

        const currentProgress = Math.min((currentTime / duration) * 100, 99);
        setProgress(Math.floor(currentProgress));

        currentTime += 1 / fps;
        requestAnimationFrame(renderLoop);
      } else {
        mediaRecorder.stop();
        setProgress(100);
        const processedUrl = await processedVideoPromise;
        onComplete(processedUrl);
        URL.revokeObjectURL(videoUrl);
        setIsProcessing(false);
      }
    };

    renderLoop();

  }, [poseLandmarker]);

  return { processVideo, isProcessing, progress };
};