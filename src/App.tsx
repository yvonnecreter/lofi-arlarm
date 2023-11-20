import React, { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./App.css"
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

const format = ".wav";
const path = "export/alarm-generator-loops ";
// const no: Array<any> = ["2", "3", "4", "5", "7", "8", "9", "10", "12", "13", "14", "15", "17", "18", "19", "20"];
// const func = (): Array<any> => Array<any>(no.forEach((filename) => {
//   let arr = new Array<any>();
//   arr[filename] = new Audio("");
//   arr[filename].src = path + filename + format;
//   arr[filename].autostart = false;
//   arr[filename].loop = true;
//   return arr;
// }));
// const songs: Array<any> = func();

function App() {
  const [volume, setVolume] = useState(.1)
  const [muted, setMuted] = useState(false)
  const finalVolume = muted ? 0 : volume ** 2

  const maxTimer = 4;
  const maxCounter = 4000;
  const [time, setTime] = useState(maxTimer);
  const [timerStart, setTimerStart] = useState(false);
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
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

  const buffer = .1;

  beat.addEventListener(
    'ended',
    () => {
      if (beat.loop()) {
        beat.seek(0);
        beat.play();
      }
    },
    false
  );
  atmos.addEventListener(
    'ended',
    () => {
      if (atmos.loop()) {
        atmos.seek(0);
        atmos.play();
      }
    },
    false
  );
  synth.addEventListener(
    'ended',
    () => {
      if (synth.loop()) {
        synth.seek(0);
        synth.play();
      }
    },
    false
  );
  noise.addEventListener(
    'ended',
    () => {
      if (noise.loop()) {
        noise.seek(0);
        noise.play();
      }
    },
    false
  );

  const generateBeat = () => {
    var max = 12;
    var min = 15;
    var rand: any = "" + (Math.floor(Math.random() * (max - min)) + min);
    const f = () => {
      beat.pause();
      beat.src = path + rand + format;
      // beat.prototype._createNodes = function () {
      //   var context = beat._context;
      //   this._sourceNode = context.createBufferSource();
      // };
      // setBeat = songs[rand];
      beat.play();
      if (!isPlaying(beat)) {
        beat.play();
        // beat.currentTime = 0;
      }
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
      // noise.prototype._createNodes = function () {
      //   var context = noise._context;
      //   this._sourceNode = context.createBufferSource();
      // };
      if (!isPlaying(noise)) {
        noise.play();
        // noise.currentTime = 0;
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
      // atmos.prototype._createNodes = function () {
      //   var context = noise._context;
      //   this._sourceNode = atmos.createBufferSource();
      // };
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
      // synth.prototype._createNodes = function () {
      //   var context = noise._context;
      //   this._sourceNode = synth.createBufferSource();
      // };
      if (!isPlaying(synth)) {
        synth.play();
        // synth.currentTime = 0;
      }
    }
    setQueue([...queue, f])
    if (!timerStart) {
      setTimerStart(true);
    }

  }

  function isPlaying(audio: HTMLAudioElement) {
    return !audio.paused;
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


  // VIDEOHANDLER
  let v: HTMLVideoElement = document.getElementById("vid-bg") as HTMLVideoElement;
  let v2: HTMLVideoElement = document.getElementById("vid-fg") as HTMLVideoElement;
  v2 && (v2.playbackRate = 0.4);
  v && (v.playbackRate = 0.4);
  const vidinterval = 1;
  //currenttime in seconds

  const prevIndex = () => {
    v.pause();
    v2.pause();
    v.currentTime -= vidinterval;
    v2.currentTime -= vidinterval;
  }

  const nextIndex = () => {
    v.currentTime = 0;
    v.play();
    v2.currentTime = 0;
    v2.play();
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

    // if (counter > 5) {
    //   for (var i in queue) {
    //     queue[i]();
    //   }
    //   setQueue([]);
    //   setStart(Date.now());
    // } else {
    //   setNow(Date.now());
    //   setCounter(now - start);
    // }

    // const interval = setInterval(() => {
    //   if (timerStart) {
    //     if (time < 2) {
    //       setTime(time + 1);
    //     } else if (time === 8) {
    //       for (var i in queue) {
    //         queue[i]();
    //       }
    //       setQueue([]);
    //       setTime(time + 1);
    //     }
    //     else if (time > 1 && time < maxTimer) {
    //       setTime(time + 1);
    //     } else if (time > maxTimer - 1) {
    //       for (var i in queue) {
    //         queue[i]();
    //       }
    //       setQueue([]);
    //     }
    //   }
    // }, 500);

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

    // return function () {
    //   mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
    //   clearInterval(interval);
    // };
    return function () {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      clearInterval(interval);
    };
  },
    [devicePixelRatio, timerStart, counter, start, queue, now]
  );

  const sync = () => {
    // setTime(1);
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
    // setTime(1);
    setStart(Date.now());
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
    sync();
  }

  return (
    <ReactScrollWheelHandler
      upHandler={prevIndex}
      downHandler={nextIndex}
    >
      <video autoPlay src="pillows-back0001-0100.webm" muted id="vid-bg"
        style={{
          position: "absolute", width: "100%",
          height: "100%", objectFit: "cover", pointerEvents: "none"
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
        <div style={{ color: "white" }} id="soundbox" className="card">
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
                beat.volume = volume;
                synth.volume = volume;
                noise.volume = volume;
                atmos.volume = volume;
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
      </div>
      <video autoPlay src="pillows-front0001-0100.webm" muted id="vid-fg"
        style={{
          position: "absolute", width: "100%",
          height: "100%", objectFit: "cover", pointerEvents: "none", zIndex: "999"
        }}
      />
    </ReactScrollWheelHandler>
  );
}

export default App;
