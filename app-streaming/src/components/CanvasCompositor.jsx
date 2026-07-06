import React, { useRef, useEffect } from 'react';

export function CanvasCompositor({ stream, className, compositorRef }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    // Exponer el canvas internamente hacia arriba mediante la prop compositorRef
    if (compositorRef && canvasRef.current) {
      compositorRef.current = canvasRef.current;
    }
  }, [compositorRef]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!video || !canvas || !ctx) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(e => console.error("Error playing hidden video", e));
    } else {
      video.srcObject = null;
      // Limpiar canvas si no hay stream
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const drawFrame = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        // Dibujar el frame actual del video en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Aquí en el futuro se pueden agregar más dibujos (textos, logos, otras cámaras)
        // Ejemplo comentado: ctx.fillText("LIVE", 50, 50);
      }
      requestRef.current = requestAnimationFrame(drawFrame);
    };

    // Iniciar loop de dibujado
    requestRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [stream]);

  return (
    <div className={className}>
      {/* Video oculto que provee los frames al canvas */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />
      {/* Canvas donde se compone la escena */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
