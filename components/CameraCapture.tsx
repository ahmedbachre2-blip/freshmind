"use client";

import { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError("No se pudo acceder a la camara. Revisa los permisos.");
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const MAX_SIZE = 1600;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height && width > MAX_SIZE) {
      height = Math.round((height * MAX_SIZE) / width);
      width = MAX_SIZE;
    } else if (height > MAX_SIZE) {
      width = Math.round((width * MAX_SIZE) / height);
      height = MAX_SIZE;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    const base64 = dataUrl.split(",")[1];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    onCapture(base64);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Foto del Ticket</h2>

        {error && (
          <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />

          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p>Iniciando camara...</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-medium"
          >
            Cancelar
          </button>

          <button
            onClick={handleCapture}
            disabled={!ready}
            className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            📸 Capturar
          </button>
        </div>
      </div>
    </div>
  );
}