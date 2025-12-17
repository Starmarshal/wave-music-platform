// src/components/BackgroundMusicSVG.tsx
'use client';

import React from 'react';

const BackgroundMusicSVG = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        className="w-full h-full text-cyan-500 dark:text-cyan-400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            .music-icon {
              fill: currentColor;
              opacity: 0.4;
            }
            .dark .music-icon {
              opacity: 0.2;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }
            .note1 { animation: float 6s ease-in-out infinite; }
            .note2 { animation: float 7s ease-in-out infinite 0.5s; }
            .note3 { animation: float 8s ease-in-out infinite 1s; }
            .note4 { animation: float 9s ease-in-out infinite 1.5s; }
          `}</style>
          <symbol id="note">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </symbol>
          <symbol id="clef">
            <path d="M7.5 3c.66 0 1.29.19 1.83.5.54.31.97.74 1.28 1.28.31.54.5 1.17.5 1.83s-.19 1.29-.5 1.83c-.31.54-.74.97-1.28 1.28-.54.31-1.17.5-1.83.5s-1.29-.19-1.83-.5c-.54-.31-.97-.74-1.28-1.28C4.19 6.79 4 6.16 4 5.5s.19-1.29.5-1.83c.31-.54.74-.97 1.28-1.28C6.21 3.19 6.84 3 7.5 3m0-2C6.24 1 5.09 1.5 4.21 2.39 3.33 3.27 2.83 4.42 2.83 5.68s.5 2.41 1.38 3.3c.88.88 2.03 1.38 3.29 1.38s2.41-.5 3.3-1.38c.88-.89 1.38-2.04 1.38-3.3s-.5-2.41-1.38-3.3C9.91 1.5 8.76 1 7.5 1z" />
          </symbol>
          <symbol id="headphone">
            <path d="M12,3c-4.97,0-9,4.03-9,9v7c0,1.66,1.34,3,3,3h3v-8H5v-2c0-3.87,3.13-7,7-7s7,3.13,7,7v2h-4v8h3c1.66,0,3-1.34,3-3v-7 C21,7.03,16.97,3,12,3z" />
          </symbol>
          <symbol id="guitar">
            <path d="M19.59,12.52L13.93,6.86l1.42-1.42c0.78-0.78,0.78-2.05,0-2.83c-0.78-0.78-2.05-0.78-2.83,0L11.1,4.03L9.68,2.61 c-0.78-0.78-2.05-0.78-2.83,0c-0.78,0.78-0.78,2.05,0,2.83l1.42,1.42L4.41,12.52c-0.78,0.78-0.78,2.05,0,2.83 c0.78,0.78,2.05,0.78,2.83,0l5.66-5.66l5.66,5.66c0.39,0.39,0.9,0.59,1.41,0.59s1.02-0.2,1.41-0.59 C20.37,14.57,20.37,13.3,19.59,12.52z" />
          </symbol>
          <symbol id="microphone">
            <path d="M12,14c1.66,0,2.99-1.34,2.99-3L15,5c0-1.66-1.34-3-3-3S9,3.34,9,5v6C9,12.66,10.34,14,12,14z M17.3,11c0,3-2.54,5.1-5.3,5.1 S6.7,14,6.7,11H5c0,3.41,2.72,6.23,6,6.72V21h2v-3.28c3.28-0.49,6-3.31,6-6.72H17.3z" />
          </symbol>
          <symbol id="piano">
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M14,14.5c0,0.28-0.22,0.5-0.5,0.5 h-3c-0.28,0-0.5-0.22-0.5-0.5V5h4V14.5z" />
          </symbol>
        </defs>

        <g className="music-background">
          <use
            href="#note"
            x="50"
            y="100"
            width="40"
            height="40"
            className="music-icon note1"
          />
          <use
            href="#note"
            x="200"
            y="300"
            width="60"
            height="60"
            className="music-icon note2"
          />
          <use
            href="#note"
            x="400"
            y="150"
            width="50"
            height="50"
            className="music-icon note3"
          />
          <use
            href="#note"
            x="600"
            y="400"
            width="70"
            height="70"
            className="music-icon note4"
          />
          <use
            href="#note"
            x="800"
            y="200"
            width="45"
            height="45"
            className="music-icon note1"
          />
          <use
            href="#note"
            x="1000"
            y="350"
            width="55"
            height="55"
            className="music-icon note2"
          />
          <use
            href="#note"
            x="300"
            y="500"
            width="65"
            height="65"
            className="music-icon note3"
          />
          <use
            href="#note"
            x="1100"
            y="100"
            width="40"
            height="40"
            className="music-icon note4"
          />

          <use
            href="#clef"
            x="150"
            y="450"
            width="80"
            height="80"
            className="music-icon"
          />
          <use
            href="#clef"
            x="900"
            y="500"
            width="100"
            height="100"
            className="music-icon"
            transform="rotate(15 950 550)"
          />

          <use
            href="#headphone"
            x="350"
            y="600"
            width="90"
            height="90"
            className="music-icon"
          />
          <use
            href="#headphone"
            x="1050"
            y="600"
            width="70"
            height="70"
            className="music-icon"
            transform="rotate(-10 1085 635)"
          />

          <use
            href="#guitar"
            x="700"
            y="100"
            width="120"
            height="120"
            className="music-icon"
            transform="rotate(20 760 160)"
          />
          <use
            href="#guitar"
            x="500"
            y="700"
            width="80"
            height="80"
            className="music-icon"
            transform="rotate(-15 540 740)"
          />

          <use
            href="#microphone"
            x="100"
            y="700"
            width="60"
            height="60"
            className="music-icon"
          />
          <use
            href="#microphone"
            x="1150"
            y="450"
            width="75"
            height="75"
            className="music-icon"
          />

          <use
            href="#piano"
            x="800"
            y="700"
            width="100"
            height="100"
            className="music-icon"
          />
          <use
            href="#piano"
            x="250"
            y="250"
            width="120"
            height="120"
            className="music-icon"
          />

          <circle
            cx="180"
            cy="180"
            r="12"
            className="music-icon note1"
          />
          <circle
            cx="420"
            cy="420"
            r="15"
            className="music-icon note2"
          />
          <circle
            cx="750"
            cy="300"
            r="10"
            className="music-icon note3"
          />
          <circle
            cx="950"
            cy="180"
            r="13"
            className="music-icon note4"
          />
          <circle
            cx="1100"
            cy="700"
            r="16"
            className="music-icon note1"
          />
          <circle
            cx="200"
            cy="600"
            r="11"
            className="music-icon note2"
          />
          <circle
            cx="600"
            cy="600"
            r="14"
            className="music-icon note3"
          />

          <circle
            cx="150"
            cy="150"
            r="30"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
            className="dark:opacity-0.1"
          />
          <circle
            cx="150"
            cy="150"
            r="50"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.15"
            className="dark:opacity-0.08"
          />
          <circle
            cx="150"
            cy="150"
            r="70"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />

          <circle
            cx="1000"
            cy="250"
            r="40"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
            className="dark:opacity-0.1"
          />
          <circle
            cx="1000"
            cy="250"
            r="65"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.15"
            className="dark:opacity-0.08"
          />
          <circle
            cx="1000"
            cy="250"
            r="90"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />

          <circle
            cx="600"
            cy="500"
            r="35"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
            className="dark:opacity-0.1"
          />
          <circle
            cx="600"
            cy="500"
            r="55"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.15"
            className="dark:opacity-0.08"
          />
          <circle
            cx="600"
            cy="500"
            r="75"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />

          <path
            d="M50,400 Q200,380 350,400 T650,400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />
          <path
            d="M50,420 Q200,440 350,420 T650,420"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />

          <path
            d="M700,650 Q850,630 1000,650 T1150,650"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />
          <path
            d="M700,670 Q850,690 1000,670 T1150,670"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            className="dark:opacity-0.05"
          />
        </g>
      </svg>
    </div>
  );
};

export default BackgroundMusicSVG;