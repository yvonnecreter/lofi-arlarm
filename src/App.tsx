import React, { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./App.css";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import { motion, useAnimate } from 'framer-motion';
import { getElementError } from "@testing-library/react";
import { Howl, Howler } from "howler";
import { hover } from "@testing-library/user-event/dist/hover";

const format = ".wav";
const path = "export/alarm-generator-loops ";
// const no: Array<any> = ["2", "3", "4", "5", "7", "8", "9", "10", "12", "13", "14", "15", "17", "18", "19", "20"];
// const func = () => (no.forEach((filename) => {
//   no[filename] = new Audio("");
//   no[filename].src = path + filename + format;
//   no[filename].preload();
// }));
const clickAudio = new Audio("SC_EK_synth_lofi_chime_7th_Am.wav");
// const memories: Array<any> = [
//   new Audio("export/memories " + 25 + format),
//   new Audio("export/memories " + 24 + format),
//   new Audio("export/memories " + 23 + format),
//   new Audio("export/memories " + 22 + format),
// ]

const App = (root: any) => {
  var initialized = false;

  const beatList: Array<Howl> = [
    new Howl({
      src: [path + "2" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "3" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "4" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "5" + format],
      loop: true,
      autoplay: false
    })
  ]
  const atmosList: Array<Howl> = [
    new Howl({
      src: [path + "2" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "3" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "4" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "5" + format],
      loop: true,
      autoplay: false
    })
  ]
  const noiseList: Array<Howl> = [
    new Howl({
      src: [path + "2" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "3" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "4" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "5" + format],
      loop: true,
      autoplay: false
    })
  ]
  const synthList: Array<Howl> = [
    new Howl({
      src: [path + "2" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "3" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "4" + format],
      loop: true,
      autoplay: false
    }),
    new Howl({
      src: [path + "5" + format],
      loop: true,
      autoplay: false
    })
  ]

  const [volume, setVolume] = useState(.1)
  const [muted, setMuted] = useState(false)
  const finalVolume = muted ? 0 : volume ** 2

  Howler.volume(volume);

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

  let [beat, setBeat] = useState<any>(beatList[Math.floor(Math.random() * beatList.length - 1)]);
  let [atmos, setAtmos] = useState<any>(atmosList[Math.floor(Math.random() * atmosList.length - 1)]);
  let [noise, setNoise] = useState<any>(noiseList[Math.floor(Math.random() * noiseList.length - 1)]);
  let [synth, setSynth] = useState<any>(synthList[Math.floor(Math.random() * synthList.length - 1)]);

  let blocked = [false, false, false, false];

  // beat.loop = true;
  // atmos.loop = true;
  // noise.loop = true;
  // synth.loop = true;
  // beat.autostart = false;
  // atmos.autostart = false;
  // noise.autostart = false;
  // synth.autostart = false;

  const buffer = .1;

  // beat.addEventListener(
  //   'ended',
  //   () => {
  //     if (beat.loop()) {
  //       beat.seek(0);
  //       beat.play();
  //     }
  //   },
  //   false
  // );
  // atmos.addEventListener(
  //   'ended',
  //   () => {
  //     if (atmos.loop()) {
  //       atmos.seek(0);
  //       atmos.play();
  //     }
  //   },
  //   false
  // );
  // synth.addEventListener(
  //   'ended',
  //   () => {
  //     if (synth.loop()) {
  //       synth.seek(0);
  //       synth.play();
  //     }
  //   },
  //   false
  // );
  // noise.addEventListener(
  //   'ended',
  //   () => {
  //     if (noise.loop()) {
  //       noise.seek(0);
  //       noise.play();
  //     }
  //   },
  //   false
  // );

  const generateBeat = () => {
    var rand: any = (Math.floor(Math.random() * beatList.length));
    const f = () => {
      beatList[rand].play();
      console.log("f executed")
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
  }

  const generateNoise = () => {
    var max = 17;
    var min = 20;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      noise.pause();
      noise.src = path + rand + format;
      if (!isPlaying(noise)) {
        noise.play();
      }
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }
  }

  const generateAtmos = () => {
    var max = 5;
    var min = 2;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      atmos.pause();
      atmos.src = path + rand + format;
      if (!isPlaying(atmos)) {
        atmos.play();
      }
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }

  }
  const generateSynth = () => {
    var max = 7;
    var min = 10;
    var rand = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      synth.pause();
      synth.src = path + rand + format;
      if (!isPlaying(synth)) {
        synth.play();
      }
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }

  }

  function isPlaying(audio: Howl) {
    return audio.playing();
  }

  const [queue, setQueue] = useState<any>([]);


  // const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  // const audioQueue = async () => {
  //   console.log("Ran Top of Audioqueue");
  //   await delay(1000);
  //   for (var i in queue) {
  //     queue[i]();
  //   }
  //   setQueue([]);
  //   console.log("Ran Audioqueue");
  // };
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
  v2 && (v2.playbackRate = 0.4);
  v && (v.playbackRate = 0.4);

  const nextIndex = () => {
  }

  const prevIndex = () => {
  }

  //CHANGING BACKGROUND IS NOT WORKING  T.T taken out temporarily in the hopes future me might be able to fix it
  const anim = () => {
  }


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
      }
    }, 1);

    const updateDevicePixelRatio = function () {
      setDevicePixelRatio(window.devicePixelRatio);
      // v.currentTime = 0;
      // v.play();
      // v2.currentTime = 0;
      // v2.play();
    };
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    // addEventListener("MouseUp", playMemory);

    return function () {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      // removeEventListener("MouseUp", playMemory);
      clearInterval(interval);
    };
  },
    [devicePixelRatio, timerStart, counter, start, queue, now, addEventListener, removeEventListener]
  );

  // function playMemory() {
  //   console.log("memory triggered");
  //   var max = 0;
  //   var min = 3;
  //   var rand = (Math.floor(Math.random() * (max - min)) + min);
  //   memories[rand].currentTime = 0;
  //   memories[rand].play();
  // }

  const sync = () => {
    setStart(Date.now());
    if (isPlaying(beat)) {
      beat.stop();
      beat.play();
    }
    if (isPlaying(synth)) {
      synth.stop();
      synth.play();
    }
    if (isPlaying(noise)) {
      noise.stop()
      noise.play()
    }
    if (isPlaying(atmos)) {
      atmos.stop()
      atmos.play()
    }
  }

  function hovered() {
    !initialized && (initialized = true);
  }

  const empty = () => {
    setStart(Date.now());
    if (isPlaying(beat)) {
      beat.stop();
    }
    if (isPlaying(synth)) {
      synth.stop();
    }
    if (isPlaying(noise)) {
      noise.stop();
    }
    if (isPlaying(atmos)) {
      atmos.stop();
    }
    sync();
  }

  return (
    <ReactScrollWheelHandler
      upHandler={prevIndex}
      downHandler={nextIndex}
    >
      <video autoPlay src="pillows-back-new0001-0100.webm" muted id="vid-bg"
        style={{
          position: "absolute", width: "105%", right: "0px",
          height: "105%", objectFit: "cover", pointerEvents: "none"
        }}
      />
      {/* <img src="background.png" alt="background" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} /> */}

      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100vw", height: "100vh", position: "absolute", background: "transparent !important"
        }}
        devicePixelRatio={devicePixelRatio}
      />
      <div style={{
        position: "absolute", width: "100%",
        height: "100%", objectFit: "cover", pointerEvents: "none",
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        <motion.div style={{ color: "white", pointerEvents: "all" }} id="soundbox" className="card"
          onClick={flipCard} ref={scope} onHoverStart={hovered}>
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
                <p style={{ width: "80px" }}>Timer: {Math.floor(counter / 1000) + 1}</p>
                <button onClick={generateBeat} className="gradientButton" style={{ pointerEvents: "all" }}> beat </button>
                <button onClick={generateAtmos} className="gradientButton" style={{ pointerEvents: "all" }}> atmos </button>
                <button onClick={generateNoise} className="gradientButton" style={{ pointerEvents: "all" }}> noise </button>
                <button onClick={generateSynth} className="gradientButton" style={{ pointerEvents: "all" }}> synth </button>
              </section>
              <br />
              <section className="containerSpaceReg">
                <button onClick={sync} className="shadedButton" style={{ pointerEvents: "all" }}> Sync </button>
                <button onClick={empty} className="shadedButton" style={{ pointerEvents: "all" }}> X </button>
              </section>
              <br />
              <section className="containerSpaceReg" style={{ pointerEvents: "all" }}>
                <label className="containerSpaceReg">Volume: <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={volume}
                  onChange={event => {
                    setVolume(event.target.valueAsNumber)
                    Howler.volume(volume);
                  }}
                >
                </input></label>
                <p style={{ opacity: ".3" }}>
                  {finalVolume.toFixed(3)}
                </p>

                <button onClick={() => {
                  setMuted(m => !m)
                  beat.muted = !muted;
                  synth.muted = !muted;
                  noise.muted = !muted;
                  atmos.muted = !muted;
                }} className="shadedButton" >{muted ? "unmute" : "mute"}</button>

                {/* <label className="shadedToggleButton" >
              {muted ? "unmute" : "mute"}
              <input id="toggle" type="checkbox" onClick={() => {
                setMuted(m => !m)
                beat.muted = !muted;
                synth.muted = !muted;
                noise.muted = !muted;
                atmos.muted = !muted;
                // }} className={muted ? "shadedToggleButton" : "shadedToggleButton"}>
              }} className="toggleButton" ></input>
              <button />
            </label> */}


                {/* {muted ? "unmute" : "mute"} */}
              </section>
            </div>

          )}
        </motion.div>
      </div>
      <video autoPlay src="pillows-front-new0001-0100.webm" muted id="vid-fg"
        style={{
          position: "absolute", width: "110%", right: "0px",
          height: "110%", objectFit: "cover", pointerEvents: "none", zIndex: "999"
        }}
      />
    </ReactScrollWheelHandler >
  );
}


export default App;