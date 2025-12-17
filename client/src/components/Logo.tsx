const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 180"
    className="!h-10 sm:!h-12 !w-auto !max-w-[300px] sm:!max-w-[400px]"
  >
    <style>
      {`
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-10px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(6px); }
          }
          .wave-text {
            font-family: 'Arial Black', 'Arial', sans-serif;
            font-weight: 900;
            font-size: 72px;
            fill: white;
            text-shadow: 0 3px 15px rgba(0, 102, 204, 0.4);
            letter-spacing: 1px;
          }
          .letter {
            display: inline-block;
            animation: wave 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            animation-delay: calc(var(--i) * 0.15s);
          }
          .letter:nth-child(odd) { animation-duration: 2.7s; }
          .letter:nth-child(even) { animation-duration: 2.3s; }
        `}
    </style>

    <path
      d="M0,90 C150,60 220,120 400,90 S650,60 800,90"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="3"
      fill="none"
      strokeDasharray="5,3"
    />

    <path
      d="M0,100 C170,70 240,130 420,100 S670,70 800,100"
      stroke="rgba(0, 204, 255, 0.08)"
      strokeWidth="2"
      fill="none"
    />

    <text
      x="400"
      y="100"
      textAnchor="middle"
      className="wave-text"
    >
      <tspan
        className="letter"
        style={{'--i': 0} as React.CSSProperties}
      >w
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 1} as React.CSSProperties}
      >a
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 2} as React.CSSProperties}
      >v
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 3} as React.CSSProperties}
      >e
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 4} as React.CSSProperties}
      >~
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 5} as React.CSSProperties}
      >m
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 6} as React.CSSProperties}
      >u
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 7} as React.CSSProperties}
      >s
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 8} as React.CSSProperties}
      >i
      </tspan>
      <tspan
        className="letter"
        style={{'--i': 9} as React.CSSProperties}
      >c
      </tspan>
    </text>

    <circle
      cx="150"
      cy="90"
      r="4"
      fill="rgba(255, 255, 255, 0.4)"
    >
      <animate
        attributeName="cy"
        values="90;82;90"
        dur="3.2s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      />
      <animate
        attributeName="opacity"
        values="0.4;0.7;0.4"
        dur="3.2s"
        repeatCount="indefinite"
      />
    </circle>

    <circle
      cx="650"
      cy="90"
      r="4"
      fill="rgba(255, 255, 255, 0.4)"
    >
      <animate
        attributeName="cy"
        values="90;98;90"
        dur="2.9s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      />
      <animate
        attributeName="opacity"
        values="0.4;0.7;0.4"
        dur="2.9s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default Logo;