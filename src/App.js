import React from "react";
import "./App.css";
import loadIcon from './loading.svg';

const TIME = 25;

class App extends React.Component {
  state = {
    data: null,
    isWrong: false,
    rightText: [],
    seconds: TIME,
    wpm: 0,
    progress: 0,
    loading: true
  };

  myRef = React.createRef();

  componentDidMount() {
    const data = this.getData();
    this.setState({ data });

    this.myInterval = setInterval(() => {
      const { seconds } = this.state;

      if(this.state.data){
        this.setState({ loading: false })
        if (seconds > 0) {
		this.setState({seconds: seconds - 1});
        }
      }
      if (seconds === 1) {
        this.countWPM();
        this.countProgress();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  getData = () => {
    fetch("https://baconipsum.com/api/?type=meat-and-filler")
      .then(response => response.json())
      .then(data => this.setState({ data: data[0] }));
  };

  handleInputChange = e => {
    const raceText = this.state.data.split("");
    const inputText = e.target.value.split("");
    const rightText = raceText.filter((v, i) => v === inputText[i]);

    this.setState({ rightText, isWrong: false });

    if (inputText.join("") !== rightText.join("")) {
      this.setState({ isWrong: true });
    }
  };

  countWPM = () => {
    const { rightText } = this.state;
    const wpm = Math.floor(rightText.length / 15);
    this.setState({ wpm });
  };

  countProgress = () => {
    const { rightText, data } = this.state;
    const raceText = data.split("");
    const progress = (rightText.length * 100 / raceText.length).toFixed(2);
    this.setState({ progress });
  }

  resetSeconds = () => {
    this.getData();
    this.setState({ seconds: TIME, rightText: [], wpm: 0, progress: 0, loading: true });
    this.myRef.current.value = "";
  };

  render() {
    const { data, isWrong, rightText, seconds, wpm, progress, loading } = this.state;
	if(!data) return null;
    const raceText = data.split("");
    const timer = seconds > 60 ? Math.floor(seconds / 60) + ':' + (seconds % 60 < 10 ? '0'+ seconds % 60 : seconds % 60) : seconds;

    return (
      <div className="App">
        <h1>Type Racer</h1>
        <h2>Race text:</h2>
        { loading ? <div><img src={loadIcon} alt="loading" /></div>
        :
          <>
            <h1 className="blue">{timer}</h1>
            <p className="raceText">
              {raceText.map((v, i) => (
                <span
                  key={i}
                  className={v === rightText[i] ? "green" : "normal"}
                >
                  {v}
                </span>
              ))}
            </p>
            <input
              className={isWrong ? "red" : "normal"}
              type="text"
              onChange={this.handleInputChange}
              disabled={!seconds}
              ref={this.myRef}
            />
          </>
        }
        {!seconds && (
          <div className="timeOver">
            <h3>TIME IS OVER :/</h3>
            <h3>
              Your progress is: <span className="blue">{progress}</span> %.
            </h3>
            <h3>
              Your speed is: <span className="blue">{wpm}</span> wpm.
            </h3>
            <button onClick={this.resetSeconds}>Play again</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
