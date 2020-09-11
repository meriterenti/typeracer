import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import loadIcon from "./loading.svg";

const TIME = 25;

const App = () => {
  const [data, setData] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [rightText, setRightText] = useState([]);
  const [seconds, setSeconds] = useState(TIME);
  const [wpm, setwpm] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const myRef = useRef();

  const getData = () => {
    fetch("https://baconipsum.com/api/?type=meat-and-filler")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  const countWPM = () => {
    const wpm = Math.floor(rightText.length / 15);
    setwpm(wpm);
  };

  const countProgress = () => {
    const raceText = data[0].split("");
    const progress = ((rightText.length * 100) / raceText.length).toFixed(2);
    setProgress(progress);
  };

  const resetSeconds = () => {
    getData();
    setSeconds(TIME);
    setRightText([]);
    setwpm(0);
    setProgress(0);
    setLoading(true);
    myRef.current.value = "";
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!seconds) return;
    const intervalId = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    if (seconds === 1) {
      countWPM();
      countProgress();
    }
    return () => clearInterval(intervalId);
  }, [seconds]);

  const handleInputChange = (e) => {
    const raceText = data[0].split("");
    const inputText = e.target.value.split("");
    const rightText = raceText.filter((v, i) => v === inputText[i]);

    setRightText(rightText);
    setIsWrong(false);

    if (inputText.join("") !== rightText.join("")) {
      setIsWrong(true);
    }
  };

  const raceText = data ? data[0].split("") : [];
  const timer =
    seconds > 60
      ? Math.floor(seconds / 60) +
        ":" +
        (seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60)
      : seconds;

  return (
    <div className="App">
      <h1>Type Racer</h1>
      <h2>Race text:</h2>
      {loading && (
        <div>
          <img src={loadIcon} alt="loading" />
        </div>
      )}
      {!loading && (
        <>
          <h1 className="coral">{timer}</h1>
          <p className="raceText">
            {raceText.map((v, i) => (
              <span
                key={`${v}-${i}`}
                className={v === rightText[i] ? "green" : "normal"}
              >
                {v}
              </span>
            ))}
          </p>
          <input
            className={isWrong ? "red" : "normal"}
            type="text"
            onChange={(e) => handleInputChange(e)}
            disabled={seconds === 0}
            ref={myRef}
          />
        </>
      )}
      {seconds <= 0 && (
        <div className="timeOver">
          <h3>TIME IS OVER :/</h3>
          <h3>
            Your progress is: <span className="coral">{progress}</span> %.
          </h3>
          <h3>
            Your speed is: <span className="coral">{wpm}</span> wpm.
          </h3>
          <button onClick={resetSeconds}>Play again</button>
        </div>
      )}
    </div>
  );
};

export default App;
