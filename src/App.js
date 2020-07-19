import React, { Component } from "react";
import CandlestickChart from "./Candlestick Chart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: "",
      stockSearch: "",
      latestDate: "",
      open: "",
      high: "",
      low: "",
      close: "",
      volume: "",
      dataPoints: [],
      stockPresent: true,
      appOpened: true,
    };
  }

  // two ways to change the date
  changeDateFormat = (inputDate) => {
    // expects Y-m-d
    var splitDate = inputDate.split("-");
    if (splitDate.count === 0) {
      return null;
    }

    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];

    return month + "/" + day + "/" + year;
  };

  formatDate = (date) => {
    const dateObj = new Date(date + "T00:00:00");
    return new Intl.DateTimeFormat("en-US").format(dateObj);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.getStocks();
  };

  getStocks = () => {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.stockSearch}&apikey=OT4P8WNBW9ESMBZV`)
      .then((res) => res.json())
      .then((data) => {
        let entries = Object.entries(data["Time Series (Daily)"]);
        let currentEntry = Object.entries(data["Time Series (Daily)"])[0];
        var dataToPush = [];
        if (entries.length < 60) {
          for (let i = 0; i < entries.length; i++) {
            dataToPush.push({ x: new Date(entries[i][0]), y: [parseFloat(parseFloat(entries[i][1]["1. open"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["2. high"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["3. low"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["4. close"]).toFixed(2))] });
          }
        } else {
          for (let i = 0; i < 60; i++) {
            dataToPush.push({ x: new Date(entries[i][0]), y: [parseFloat(parseFloat(entries[i][1]["1. open"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["2. high"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["3. low"]).toFixed(2)), parseFloat(parseFloat(entries[i][1]["4. close"]).toFixed(2))] });
          }
        }

        this.setState((state) => ({
          stockSearch: "",
          stock: data["Meta Data"]["2. Symbol"],
          latestDate: currentEntry[0],
          open: parseFloat(currentEntry[1]["1. open"]).toFixed(2),
          high: parseFloat(currentEntry[1]["2. high"]).toFixed(2),
          low: parseFloat(currentEntry[1]["3. low"]).toFixed(2),
          close: parseFloat(currentEntry[1]["4. close"]).toFixed(2),
          volume: currentEntry[1]["5. volume"],
          stockPresent: true,
          appOpened: false,
          dataPoints: dataToPush,
        }));
        document.querySelectorAll("hr").forEach((element) => {
          element.style.display = "block";
        });
      })
      .catch((error) => {
        this.setState({
          stockPresent: false,
          appOpened: false,
        });
        console.log(error, "There was an error");
      });
  };
  render() {
    if (this.state.appOpened) {
      return (
        <div className=" main-container">
          <div className="header">
            <div className="container">
              <h1>Stonks</h1>
              <form onSubmit={this.handleSubmit}>
                <input id="stockSearch" placeholer="stock name" value={this.state.stockSearch} onChange={this.handleChange} />
                <button>Search</button>
              </form>
            </div>
          </div>
          <div className="no-results container">Welcome! Search for a stock by using the search-bar</div>
        </div>
      );
    } else if (this.state.stockPresent) {
      return (
        <div className="main-container">
          <div className="header">
            <div className="container">
              <h1>Stonks</h1>
              <form onSubmit={this.handleSubmit}>
                <input id="stockSearch" type="text" placeholer="stock name" value={this.state.stockSearch} onChange={this.handleChange} />
                <button>Search</button>
              </form>
            </div>
          </div>

          <div className="content">
            <div className="container">
              <div className="symbol">
                <h2>{this.state.stock.toUpperCase()}</h2>
              </div>

              <div id="stock-data" className="data">
                {this.state.latestDate ? (
                  <div id="date" className="data-item">
                    <p>{this.changeDateFormat(this.state.latestDate)} </p>
                  </div>
                ) : null}
                <hr />
                {this.state.open ? (
                  <div className="data-item">
                    <p>Open:</p> <p>{this.state.open}</p>
                  </div>
                ) : null}
                <hr />
                {this.state.high ? (
                  <div className="data-item">
                    <p>High:</p> <p>{this.state.high}</p>
                  </div>
                ) : null}
                <hr />
                {this.state.low ? (
                  <div className="data-item">
                    <p>Low:</p> <p>{this.state.low}</p>
                  </div>
                ) : null}
                <hr />
                {this.state.close ? (
                  <div className="data-item">
                    <p>Close:</p> <p>{this.state.close}</p>
                  </div>
                ) : null}
                <hr />
                {this.state.volume ? (
                  <div className="data-item">
                    <p>Volume:</p> <p>{this.state.volume}</p>
                  </div>
                ) : null}
              </div>

              <div id="dataChart" className="chart">
                <CandlestickChart stock={this.state.stock.toUpperCase()} dataPoints={this.state.dataPoints} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-container">
          <div className="header">
            <div className="container">
              <h1>Stonks</h1>
              <form onSubmit={this.handleSubmit}>
                <input id="stockSearch" placeholer="stock name" value={this.state.stockSearch} onChange={this.handleChange} />
                <button>Search</button>
              </form>
            </div>
          </div>
          <div className="no-results container">API Error, Please Enter A Different Search Term, Or Try Again Later.</div>
        </div>
      );
    }
  }
}
export default App;
