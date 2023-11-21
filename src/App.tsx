import React, { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./App.css";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import { motion, useAnimate, useDragControls } from 'framer-motion';
import { getElementError } from "@testing-library/react";


const format = ".wav";
const path = "export/alarm-generator-loops ";
// const no: Array<any> = ["2", "3", "4", "5", "7", "8", "9", "10", "12", "13", "14", "15", "17", "18", "19", "20"];
// const func = () => (no.forEach((filename) => {
//   no[filename] = new Audio("");
//   no[filename].src = path + filename + format;
//   no[filename].preload();
// }));
const clickAudio = new Audio("SC_EK_synth_lofi_chime_7th_Am.wav");

const memories: Array<any> = [
  new Audio("export/memories " + 25 + format),
  new Audio("export/memories " + 24 + format),
  new Audio("export/memories " + 23 + format),
  new Audio("export/memories " + 22 + format),
]

const App = (root: any) => {
  const [volume, setVolume] = useState(.1)
  const [muted, setMuted] = useState(false)
  const finalVolume = muted ? 0 : volume ** 2

  const [queue, setQueue] = useState<any>([]);

  const maxTimer = 4;
  const maxCounter = 4000;
  const [time, setTime] = useState(maxTimer);
  const [timerStart, setTimerStart] = useState(false);

  const { unityProvider, isLoaded, loadingProgression, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "build/build.loader.js",
    dataUrl: "build/build.data",
    frameworkUrl: "build/build.framework.js",
    codeUrl: "build/build.wasm",
    webglContextAttributes: {
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      stencil: true,
      desynchronized: true,
      xrCompatible: true,
    },
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  let [beat, setBeat] = useState<any>(new Audio(""));
  let [atmos, setAtmos] = useState<any>(new Audio(""));
  let [noise, setNoise] = useState<any>(new Audio(""));
  let [synth, setSynth] = useState<any>(new Audio(""));

  let blocked = [false, false, false, false];

  beat.loop = true;
  atmos.loop = true;
  noise.loop = true;
  synth.loop = true;
  beat.volume = volume;
  atmos.volume = volume;
  noise.volume = volume;
  synth.volume = volume;
  beat.autostart = false;
  atmos.autostart = false;
  noise.autostart = false;
  synth.autostart = false;

  const buffer = 50;

  beat.addEventListener(
    'ended',
    () => {
      if (beat.loop()) {
        beat.seek(buffer);
        beat.play();
      }
    },
    false
  );
  atmos.addEventListener(
    'ended',
    () => {
      if (atmos.loop()) {
        atmos.seek(buffer);
        atmos.play();
      }
    },
    false
  );
  synth.addEventListener(
    'ended',
    () => {
      if (synth.loop()) {
        synth.seek(buffer);
        synth.play();
      }
    },
    false
  );
  noise.addEventListener(
    'ended',
    () => {
      if (noise.loop()) {
        noise.seek(buffer);
        noise.play();
      }
    },
    false
  );

  const generateBeat = () => {
    var max = 16;
    var min = 12;
    var rand: any = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      beat.alt = "playing"
      !beat.paused && beat.pause();
      beat.src = path + rand + format;
      beat.addEventListener('canplay', () => {
        beat.play();
      });
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
    setPaused(false);
    setInitialized(true);
  }

  const generateNoise = () => {
    var max = 21;
    var min = 17;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      noise.alt = "playing"
      !noise.paused && noise.pause();
      noise.src = path + rand + format;
      noise.addEventListener('canplay', () => {
        noise.play();
      });
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
    setPaused(false);
    setInitialized(true);
  }

  const generateAtmos = () => {
    var max = 6;
    var min = 2;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      atmos.alt = "playing"
      !atmos.paused && atmos.pause();
      atmos.src = path + rand + format;
      atmos.addEventListener('canplay', () => {
        atmos.play();
      });
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
    setPaused(false);
    setInitialized(true);
  }
  const generateSynth = () => {

    var max = 11;
    var min = 7;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      synth.alt = "playing"
      !synth.paused && synth.pause();
      synth.src = path + rand + format;
      synth.addEventListener('canplay', () => {
        synth.play();
      });
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
    setPaused(false);
    setInitialized(true);
  }

  function isPlaying(audio: HTMLAudioElement) {
    return !audio.paused;
  }



  let [start, setStart] = useState(Date.now());
  let [now, setNow] = useState(start);
  let [counter, setCounter] = useState(now - start);


  // FLIP CARD
  const [scope, animate] = useAnimate();
  let [flipped, setFlipped] = useState<boolean>(false);
  async function flipCard() {
    if (!flipped) {
      scope.current.style.minWidth = window.getComputedStyle(scope.current).width;
      scope.current.style.minHeight = window.getComputedStyle(scope.current).height;
      // scope.current.style.minWidth = scope.current.getBoundingClientRect().offsetWidth;
      // scope.current.style.minHeight = scope.current.getBoundingClientRect().offsetHeight;
      // scope.current.style.minWidth = "500px"
      // scope.current.style.minHeight = "60px"
    }
    await animate(scope.current, { scale: 1.2, rotateY: -70 });
    await setFlipped(!flipped);
    await animate(scope.current, { scale: 1, rotateY: 0 });
  }

  // VIDEOHANDLER
  let v: HTMLVideoElement = document.getElementById("vid-bg") as HTMLVideoElement;
  let v2: HTMLVideoElement = document.getElementById("vid-fg") as HTMLVideoElement;
  v2 && (v2.playbackRate = 4);
  v && (v.playbackRate = 4);
  const vidinterval = 1;
  //currenttime in seconds

  // var bg = root;
  const nextIndex = () => {
    // v.pause();
    // v2.pause();
    // v.currentTime -= vidinterval;
    // v2.currentTime -= vidinterval;
    // bg && (bg.style.background = "linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%)");
    // anim();
  }

  const prevIndex = () => {
    // v.currentTime = 0;
    // v.play();
    // v2.currentTime = 0;
    // v2.play();
    // bg && (bg.style.background = "linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%)");
    // anim();
  }

  //CHANGING BACKGROUND IS NOT WORKING  T.T taken out temporarily in the hopes future me might be able to fix it
  const anim = () => {
    // document.styleSheets[0].insertRule(':root {background = linear-gradient(to bottom, #94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%)}');
  }

  // (isLoaded) && (bg && (bg.style.background = "linear-gradient(to bottom, #020111 10%,#3a3a52 100%)"));

  const [uloaded, setUloaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setCounter(now - start);

      if (counter > maxCounter - 1) {
        for (var i in queue) {
          queue[i]();
        }
        setQueue([]);
        setStart(Date.now());
      }
      if (counter > maxCounter) {
        setStart(Date.now());
        isLoaded && setUloaded(true);
      }
    }, 1);

    const updateDevicePixelRatio = function () {
      setDevicePixelRatio(window.devicePixelRatio);
      v.currentTime = 0;
      v.play();
      v2.currentTime = 0;
      v2.play();
    };
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    addEventListener("MouseUp", playMemory);

    return function () {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      removeEventListener("MouseUp", playMemory);
      clearInterval(interval);
    };
  },
    [devicePixelRatio, timerStart, counter, start, queue, now, addEventListener, removeEventListener]
  );

  function playMemory() {
    var max = 0;
    var min = 3;
    var rand = (Math.floor(Math.random() * (max - min)) + min);
    memories[rand].currentTime = 0;
    memories[rand].play();
  }

  const sync = () => {
    setStart(Date.now());
    if (isPlaying(beat)) {
      beat.currentTime = 0;
    }
    if (isPlaying(synth)) {
      synth.currentTime = 0;
    }
    if (isPlaying(noise)) {
      noise.currentTime = 0
    }
    if (isPlaying(atmos)) {
      atmos.currentTime = 0
    }
  }

  const empty = () => {
    setInitialized(false);
    setPaused(true);
    if (isPlaying(beat)) {
      beat.pause();
    }
    if (isPlaying(synth)) {
      synth.pause();
    }
    if (isPlaying(noise)) {
      noise.pause();
    }
    if (isPlaying(atmos)) {
      atmos.pause();
    }
    beat.alt = "ejected"
    atmos.alt = "ejected"
    noise.alt = "ejected"
    synth.alt = "ejected"
    sync();
  }

  const [paused, setPaused] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const rand = () => {
    empty();
    setInitialized(true);
    setPaused(false);

    var am = 4;
    var randS = "" + (Math.floor(Math.random() * am + 7));
    var randN = "" + (Math.floor(Math.random() * am + 17));
    var randA = "" + (Math.floor(Math.random() * am + 2));
    var randB = "" + (Math.floor(Math.random() * am + 12));
    const f = () => {
      synth.alt = "playing"
      beat.alt = "playing"
      atmos.alt = "playing"
      noise.alt = "playing"
      !synth.paused && synth.pause();
      !beat.paused && beat.pause();
      !atmos.paused && atmos.pause();
      !noise.paused && noise.pause();
      synth.src = path + randS + format;
      beat.src = path + randB + format;
      atmos.src = path + randA + format;
      noise.src = path + randN + format;

      beat.addEventListener('canplay', () => {
        beat.play();
      });
      synth.addEventListener('canplay', () => {
        synth.play();
      });
      atmos.addEventListener('canplay', () => {
        atmos.play();
      });
      noise.addEventListener('canplay', () => {
        noise.play();
      });
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
  }

  const pause = () => {
    if (!paused) {
      if (isPlaying(beat)) {
        beat.pause();
      }
      if (isPlaying(synth)) {
        synth.pause();
      }
      if (isPlaying(noise)) {
        noise.pause();
      }
      if (isPlaying(atmos)) {
        atmos.pause();
      }
      setPaused(true);
    } else {
      if (!initialized) {
        rand()
      } else {
        setInitialized(true);
        setPaused(false);
        if (synth.currentSrc && synth.alt != "ejected") {
          synth.alt = "playing"
          synth.play();
        }
        if (beat.currentSrc && beat.alt != "ejected") {
          beat.alt = "playing"
          beat.play();
        }
        if (atmos.currentSrc && atmos.alt != "ejected") {
          atmos.alt = "playing"
          atmos.play();
        }
        if (noise.currentSrc && noise.alt != "ejected") {
          noise.alt = "playing"
          noise.play();
        }
      }
    }
  }

  const stop = (a: any) => {
    a.pause();
    a.alt = "ejected";
    if (beat.paused && atmos.paused && synth.paused && noise.paused) {
      setPaused(true);
      setInitialized(false);
    }
  }

  const constraints = useRef(null);
  const [deactivateDrag, setDeactivateDrag] = useState(false);


  return (
    <ReactScrollWheelHandler
      upHandler={prevIndex}
      downHandler={nextIndex}
    >
      <video autoPlay src="pillows-back-new-20001-0400.webm" muted id="vid-bg"
        style={{
          position: "absolute", width: "100%",
          height: "100%", objectFit: "cover", pointerEvents: "none"
        }}>
        <source src="pillows-back-new-50001-0400_H.265.mp4" type="video/mp4;codecs=hvc1" />
        <source src="pillows-back-new-50001-0400_VP9" type="video/webm" />
      </video>
      {/* <img src="background.png" alt="background" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} /> */}
      <div ref={constraints} style={{
        position: "absolute", /* width: "100%", height: "100%", margin: "100px", */
        top: "100px",
        bottom: " 100px",
        left: "100px",
        right: " 100px", pointerEvents: "none"
      }} />
      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100vw", height: "100vh", position: "absolute", background: "transparent !important",
          opacity: uloaded ? "1" : "0", transitionProperty: "opacity", transition: "1s ease", transitionDelay: "2s"
        }}
        devicePixelRatio={devicePixelRatio}
      />
      <div style={{
        position: "absolute", width: "100%",
        height: "100%", objectFit: "cover", pointerEvents: "none",
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        <motion.div style={{ color: "white", pointerEvents: "all" }}
          id="soundbox" className="card"
          drag={deactivateDrag ? false : true}
          dragConstraints={constraints}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
          dragElastic={0.5}
          whileTap={{ cursor: "grabbing" }}
          onClick={(e) => {
            e.stopPropagation();
            flipCard();
          }}
          ref={scope} >

          {flipped ? (
            <div className="centered">
              <p> ≽^•⩊•^≼
                <br />
                have a cute day! </p>

            </div>
          ) : (
            <div>
              <h1>
                Wakeup Sound Generator
              </h1>
              <h3>
                Generate
              </h3>
              <section className="containerSpaceReg">
                <p style={{ width: "80px" }}>Beat: {Math.floor(counter / 1000) + 1}</p>
                <button onClick={(e) => { e.stopPropagation(); generateBeat(); }} className="gradientButton" style={{ pointerEvents: "all" }}> beat
                  <svg viewBox="0 0 24 24" fill="none" className="closeButton"
                    xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.stopPropagation(); stop(beat) }} >
                    <g id="Menu / Close_SM">
                      <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); generateAtmos(); }} className="gradientButton" style={{ pointerEvents: "all" }}> atmos
                  <svg viewBox="0 0 24 24" fill="none" className="closeButton"
                    xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.stopPropagation(); stop(atmos) }} >
                    <g id="Menu / Close_SM">
                      <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg></button>
                <button onClick={(e) => { e.stopPropagation(); generateNoise(); }} className="gradientButton" style={{ pointerEvents: "all" }}> noise
                  <svg viewBox="0 0 24 24" fill="none" className="closeButton"
                    xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.stopPropagation(); stop(noise) }} >
                    <g id="Menu / Close_SM">
                      <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg> </button>
                <button onClick={(e) => { e.stopPropagation(); generateSynth(); }} className="gradientButton" style={{ pointerEvents: "all" }}> synth
                  <svg viewBox="0 0 24 24" fill="none" className="closeButton"
                    xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.stopPropagation(); stop(synth) }} >
                    <g id="Menu / Close_SM">
                      <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg></button>
              </section>
              <br />
              <section className="containerSpaceReg">
                <button onClick={(e) => { e.stopPropagation(); sync(); }} className="shadedButton" style={{ pointerEvents: "all" }}> sync </button>
                <button onClick={(e) => { e.stopPropagation(); pause(); }} className="shadedButton" style={{ pointerEvents: "all" }}> {paused ? "play" : "pause"} </button>
                <button onClick={(e) => { e.stopPropagation(); rand(); }} className="shadedButton" style={{ pointerEvents: "all" }}> random </button>
                <button onClick={(e) => { e.stopPropagation(); empty(); }} className="shadedButton" style={{ pointerEvents: "all" }}> X </button>
              </section>
              <br />
              <section className="containerSpaceReg" style={{ pointerEvents: "all" }}>
                <label className="containerSpaceReg">Volume: <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={volume}
                  onClick={event => { event.stopPropagation(); setDeactivateDrag(false) }}
                  // onMouseEnter={() => { setDeactivateDrag(true) }}
                  // onMouseLeave={() => { setDeactivateDrag(false) }}
                  onChange={event => {
                    setVolume(event.target.valueAsNumber)
                    beat.volume = volume;
                    synth.volume = volume;
                    noise.volume = volume;
                    atmos.volume = volume;
                    setDeactivateDrag(true);
                  }}
                >
                </input></label>
                <p style={{ opacity: ".3" }}>
                  {finalVolume.toFixed(3)}
                </p>

                <button onClick={(e) => {
                  e.stopPropagation();
                  setMuted(m => !m)
                  beat.muted = !muted;
                  synth.muted = !muted;
                  noise.muted = !muted;
                  atmos.muted = !muted;
                }} className="shadedButton" >{muted ? "unmute" : "mute"}</button>
              </section>
            </div>
          )}
        </motion.div>
      </div>
      <video autoPlay src="pillows-front-new-20001-0400.webm" muted id="vid-fg"
        style={{
          position: "absolute", width: "100%", right: "0px",
          height: "100%", objectFit: "cover", pointerEvents: "none", zIndex: "999"
        }}>
        <source src="pillows-front-new-50001-0400_H.265.mp4" type="video/mp4;codecs=hvc1" />
        <source src="pillows-front-new-50001-0400_VP9.webm" type="video/webm" />
      </video>
    </ReactScrollWheelHandler >
  );
}


export default App;