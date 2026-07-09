import React, { useRef, useEffect } from 'react';

export function CanvasCompositor({ stream, className, compositorRef, scoreLocal = 0, scoreVisitante = 0, yellowCards = 0, redCards = 0 }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Guardamos el estado en una ref para que el loop de animación lo lea sin reiniciarse
  const overlayState = useRef({ scoreLocal, scoreVisitante, yellowCards, redCards });
  useEffect(() => {
    overlayState.current = { scoreLocal, scoreVisitante, yellowCards, redCards };
  }, [scoreLocal, scoreVisitante, yellowCards, redCards]);

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
    }

    const drawFrame = () => {
      // 1. Limpiar canvas a negro siempre
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Dibujar video si está disponible
      if (stream && video.readyState >= video.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // 3. --- OVERLAYS: MARCADOR Y GRÁFICOS (SIEMPRE VISIBLES) ---
      const { scoreLocal, scoreVisitante, yellowCards, redCards } = overlayState.current;

      // Fondo del marcador superior izquierdo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(40, 40, 320, 70);

      // Bordes de colores para los equipos
      ctx.fillStyle = '#ef4444'; // Rojo (Local)
      ctx.fillRect(40, 40, 10, 70);
      ctx.fillStyle = '#3b82f6'; // Azul (Visitante)
      ctx.fillRect(350, 40, 10, 70);

      // Textos del Marcador
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText(`LOC   ${scoreLocal}  -  ${scoreVisitante}   VIS`, 65, 88);

      // Tarjetas Amarillas
      if (yellowCards > 0) {
        ctx.fillStyle = '#eab308'; // Amarillo oscuro
        ctx.fillRect(40, 120, 20, 30);
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(yellowCards.toString(), 45, 142);
      }

      // Tarjetas Rojas
      if (redCards > 0) {
        ctx.fillStyle = '#dc2626'; // Rojo oscuro
        const startX = yellowCards > 0 ? 70 : 40; // Desplazar si ya hay amarilla
        ctx.fillRect(startX, 120, 20, 30);
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(redCards.toString(), startX + 5, 142);
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
