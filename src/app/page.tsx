"use client"

import { useState, useEffect } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Vídeo de fundo */}
      <video
        muted
        autoPlay
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          transform: `scale(${1 + scrollY * 0.0005})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <source src="/media/video.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
      
      {/* Overlay com gradiente dinâmico */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          linear-gradient(135deg, 
            rgba(0, 0, 0, 0.7) 0%, 
            rgba(0, 0, 0, 0.3) 50%, 
            rgba(0, 0, 0, 0.6) 100%
          ),
          radial-gradient(circle at 30% 70%, 
            rgba(139, 69, 19, 0.2) 0%, 
            transparent 50%
          )
        `,
        zIndex: 0
      }} />

      {/* Partículas flutuantes - folhas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              backgroundColor: `rgba(${34 + Math.random() * 100}, 197, ${94 + Math.random() * 30}, 0.7)`,
              borderRadius: '50% 0 50% 0',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `leafFloat ${Math.random() * 15 + 12}s infinite linear`,
              animationDelay: `${Math.random() * 8}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        color: 'white',
        maxWidth: '800px',
        padding: '2rem',
        transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
        opacity: isLoaded ? 1 : 0,
        transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
      

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          fontWeight: '300',
          marginBottom: '2rem',
          opacity: 0.95,
          lineHeight: '1.6',
          letterSpacing: '0.5px',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)',
          animation: 'fadeInUp 1.5s ease-out 0.5s both'
        }}>
          Transforme seu lar em um jardim dos sonhos
        </p>

        {/* Cards informativos */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem',
          animation: 'fadeInUp 1.5s ease-out 0.8s both'
        }}>
          {[
            { icon: '🌿', title: 'Plantas Exclusivas', desc: 'Espécies raras e cuidadosamente selecionadas' },
            { icon: '🚚', title: 'Entrega Rápida', desc: 'Receba suas plantas com segurança em casa' },
            { icon: '💚', title: 'Cuidado Expert', desc: 'Dicas e suporte para suas plantas crescerem' }
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '1.5rem',
                width: '220px',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                transform: 'translateY(0)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-10px) scale(1.05)'
                e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                e.target.style.borderColor = 'rgba(74, 222, 128, 0.4)'
                e.target.style.boxShadow = '0 20px 40px rgba(74, 222, 128, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                {card.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                margin: '0 0 0.5rem 0',
                color: '#4ade80'
              }}>
                {card.title}
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                opacity: 0.8, 
                margin: 0,
                lineHeight: '1.4'
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 1.5s ease-out 1s both'
        }}>
          <button style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
            transform: 'translateY(0)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)'
            e.target.style.boxShadow = '0 15px 40px rgba(34, 197, 94, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)'
            e.target.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.4)'
          }}>
            🛒 Ver Plantas
          </button>

          <button style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            border: '2px solid rgba(74, 222, 128, 0.5)',
            borderRadius: '50px',
            background: 'rgba(74, 222, 128, 0.1)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)'
            e.target.style.background = 'rgba(74, 222, 128, 0.2)'
            e.target.style.borderColor = 'rgba(74, 222, 128, 0.7)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)'
            e.target.style.background = 'rgba(74, 222, 128, 0.1)'
            e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)'
          }}>
            🌱 Como Cuidar
          </button>
        </div>

        {/* Indicador de scroll */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{
            width: '30px',
            height: '50px',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '25px',
            position: 'relative'
          }}>
            <div style={{
              width: '4px',
              height: '8px',
              background: 'white',
              borderRadius: '2px',
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'scroll 2s infinite'
            }} />
          </div>
        </div>
      </div>

      {/* Estilos de animação */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 1; }
        }

        @keyframes glow {
          0% { filter: brightness(1) drop-shadow(0 0 20px rgba(255,255,255,0.3)); }
          100% { filter: brightness(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.5)); }
        }

        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }

        @keyframes scroll {
          0% { opacity: 0; top: 8px; }
          50% { opacity: 1; top: 15px; }
          100% { opacity: 0; top: 25px; }
        }

        @media (max-width: 768px) {
          div[style*="gap: 1.5rem"] {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}