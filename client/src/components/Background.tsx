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
          <symbol
            id="clef"
            viewBox="0 0 433.43 433.43"
          >
            <path
              d="M165.156,176.583c-16.007,20.073-24.81,40.457-26.128,60.599c-1.475,22.705,5.003,44.281,19.273,64.099
                c15.118,21.119,34.22,32.572,56.759,34.047c7.574,0.497,14.7,0.288,21.276-0.597c1.35,7.649,2.709,15.252,3.971,22.781
                c1.567,10.176,2.124,19.008,1.644,26.241c-0.661,9.998-3.779,18.178-9.294,24.321c-5.963,6.628-13.396,9.533-22.826,8.92
                c-4.105-0.269-7.722-1.326-10.904-3.201c3.745-0.862,7.145-2.469,10.119-4.785c5.761-4.469,8.989-10.965,9.521-19.28
                c0.503-7.999-1.529-14.995-6.067-20.778c-4.827-6.332-11.389-9.818-19.5-10.355c-8.283-0.545-15.797,2.806-21.957,9.807
                c-5.474,6.199-8.54,13.493-9.061,21.68c-0.797,12.227,3.847,22.67,13.85,31.026c8.771,7.321,19.272,11.421,31.22,12.202
                c6.792,0.445,13.354-0.337,19.466-2.328c5.021-1.635,9.842-4.12,14.366-7.37c10.94-7.878,16.88-18.182,17.692-30.656
                c0.63-9.506,0.148-20.767-1.454-33.603l-4.464-28.918c11.425-3.814,21.007-10.707,28.473-20.462
                c7.926-10.303,12.391-22.47,13.296-36.167c1.103-16.823-2.913-32.079-11.962-45.34c-9.918-14.543-23.52-22.478-40.406-23.582
                c-1.948-0.126-3.988-0.112-6.12,0.046l-4.744-35.516c13.168-11.257,23.832-25.409,31.723-42.092
                c7.798-16.574,12.383-34.514,13.608-53.305c0.718-11.046-0.797-24.754-4.508-40.761c-5.086-21.718-12.335-32.586-22.201-33.238
                c-3.49-0.218-7.33,1.557-12.015,5.677c-11.377,10.285-19.656,22.728-24.609,36.96c-3.833,10.87-6.368,25.403-7.548,43.208
                c-0.579,8.869,0.826,23.942,4.328,46.059C189.015,150.517,173.957,165.542,165.156,176.583z M263.455,274.041
                c0,11.63-5.743,31.162-13.754,35.931l-8.264-62.556C253.949,249.816,263.455,260.833,263.455,274.041z M222.484,104.798
                c0.739-11.339,3.589-23.646,8.478-36.562c6.196-16.16,12.071-21.043,15.895-22.293c1.05-0.336,2.079-0.471,3.157-0.399
                c5.001,0.331,9.982,2.447,9.125,15.659c-0.722,11.197-5.17,23.064-13.188,35.281c-6.452,9.851-13.95,18.074-22.31,24.501
                C222.471,116.385,222.072,110.961,222.484,104.798z M216.199,181.34l3.266,26.908c-9.077,3.75-16.99,9.682-23.568,17.665
                c-7.578,9.289-11.79,19.532-12.499,30.429c-0.735,11.305,1.797,21.664,7.514,30.741c2.974,4.837,7.063,9.137,11.76,12.643
                c7.7,5.727,16.575,5.294,17.985,2.177c1.429-3.106-3.845-7.991-7.993-14.515c-2.36-3.688-3.506-8.123-3.506-13.337
                c0-11.073,6.672-20.578,16.186-24.802l8.909,69.388c-4.745,0.982-10.055,1.295-15.824,0.922
                c-14.815-0.974-28.044-7.069-39.347-18.153c-11.806-11.51-17.1-24.197-16.149-38.78
                C164.754,235.014,182.669,207.692,216.199,181.34z"
            />
          </symbol>
          <symbol id="headphone">
            <path d="M12,3c-4.97,0-9,4.03-9,9v7c0,1.66,1.34,3,3,3h3v-8H5v-2c0-3.87,3.13-7,7-7s7,3.13,7,7v2h-4v8h3c1.66,0,3-1.34,3-3v-7 C21,7.03,16.97,3,12,3z" />
          </symbol>
          <symbol
            id="double"
            viewBox="0 0 512 512"
          >
            <path
              d="M452.295,0.495L185.162,67.278c-7.228,1.808-12.641,8.585-12.641,16.196c0,162.23,0,137.989,0,308.442
                c-13.971-8.424-31.284-13.482-50.087-13.482c-46.033,0-83.479,29.957-83.479,66.783S76.401,512,122.434,512
                c46.033,0,83.479-29.957,83.479-66.783V196.685l233.742-58.435v153.493c-13.972-8.425-31.285-13.484-50.088-13.484
                c-46.033,0-83.479,29.957-83.479,66.783c0,36.827,37.447,66.783,83.479,66.783c46.033,0,83.479-29.957,83.479-66.783
                c0-114.01,0-214.274,0-328.351C473.046,6.018,462.925-2.127,452.295,0.495z"
            />
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
            width="40"
            height="40"
            className="music-icon note3"
          />
          <use
            href="#clef"
            x="900"
            y="500"
            width="50"
            height="50"
            className="music-icon note2"
            transform="rotate(15 925 525)"
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
            href="#double"
            x="700"
            y="100"
            width="40"
            height="40"
            className="music-icon note2"
            transform="rotate(20 720 120)"
          />
          <use
            href="#double"
            x="500"
            y="700"
            width="35"
            height="35"
            className="music-icon note1"
            transform="rotate(-15 517.5 717.5)"
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