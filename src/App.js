import React from 'react';
import './App.css';
import { dropDownMenu } from './constants';
import { findCityByName, setPersistData, getPersistData, debounce } from './util';
import { getWeatherByCityName, getWeatherByLatLon } from './api';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedLocation: '',
      currentSelectedType: dropDownMenu[0],
      showDataList: false,
      filteredCity: [],
      history: [],
      currentWeatherInfo: '',
      currentWeatherTemp: null,
      isSuccess: false,
      message: 'Please Type & Press Enter',
      oldWeatherSearchTerm: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.setState({ history: getPersistData('history') ? getPersistData('history').splice(0, 3) : [] });
  }

  onTypeChange = event => {
    this.setState({ currentSelectedType: event.target.value, currentSelectedLocation: '' });
  };

  onSearch = event => {
    this.setState(
      {
        //    showDataList: event.target.value.length > 2 && false,
        currentSelectedLocation: event.target.value,
        isLoading: true,
        //    filteredCity: findCityByName(event.target.value),
      },
      () => {
        debounce(this.getWeather.bind(this))();
      }
    );
  };

  getWeather = () => {
    if (this.state.oldWeatherSearchTerm && this.state.currentWeatherTemp) {
      const tempOldSearchTerm = this.state.oldWeatherSearchTerm;
      this.setState(state => ({
        history: [{ temp: state.currentWeatherTemp, searchTerm: tempOldSearchTerm }, ...state.history].splice(0, 3),
        oldWeatherSearchTerm: state.currentSelectedLocation,
      }));
    } else {
      this.setState(state => ({ oldWeatherSearchTerm: state.currentSelectedLocation }));
    }
    this.getWeatherApiCall().then(response => {
      if (response.cod === 200) {
        setPersistData('history', [
          { temp: Math.round(response.main.temp - 273.15), searchTerm: response.name },
          ...this.state.history,
        ]);
        this.setState({
          currentWeatherInfo: response.weather[0].description,
          currentWeatherTemp: Math.round(response.main.temp - 273.15),
          isSuccess: true,
          isLoading: false,
          oldWeatherSearchTerm: response.name,
        });
      } else this.setState({ isSuccess: false, message: response.message, oldWeatherSearchTerm: '', isLoading: false });
    });
  };

  getWeatherApiCall = () => {
    if (this.state.currentSelectedType === dropDownMenu[0] && this.state.currentSelectedLocation) {
      return getWeatherByCityName(this.state.currentSelectedLocation);
    } else if (this.state.currentSelectedType === dropDownMenu[1] && this.state.currentSelectedLocation) {
      const [lat, lon] = this.state.currentSelectedLocation.split('/');
      return getWeatherByLatLon({ lat, lon });
    } else if (this.state.currentSelectedLocation) {
      return getWeatherByCityName(this.state.currentSelectedLocation);
    }
    return Promise.reject('Please Enter Value');
  };
  render() {
    return (
      <>
        <div className='search-bar'>
          <input
            value={this.state.currentSelectedLocation}
            style={{ width: '60vw', height: '60px', fontSize: '30px', padding: '0px 1vw' }}
            placeholder={`Enter ${this.state.currentSelectedType}`}
            list='cityList'
            onChange={this.onSearch}
            // onKeyPress={e => {
            //   if (e.key === 'Enter') this.getWeather();
            // }}
            // onBlur={this.getWeather}
          />
          {this.state.showDataList && (
            <ul>
              {this.state.filteredCity.map((cityObj, i) => (
                <li key={i}>{cityObj.name}</li>
              ))}
            </ul>
          )}
          <select
            onChange={this.onTypeChange}
            style={{ width: '20vw', height: '64px', fontSize: '30px', padding: '0px 1vw' }}>
            {dropDownMenu.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {this.state.isLoading ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '0px 35%' }}>
            <div className='loader'></div>
          </div>
        ) : (
          <div style={{ width: '100%', textAlign: 'center' }}>
            {this.state.isSuccess ? (
              <h1 style={{ width: '100%', textAlign: 'center' }}>
                Weather Info:{this.state.currentWeatherTemp}&#176;C ({this.state.currentWeatherInfo})
              </h1>
            ) : (
              <h1 style={{ width: '100%', textAlign: 'center' }}>{this.state.message}</h1>
            )}
          </div>
        )}

        <div className='left-float'>
          <p style={{ width: '100vw' }}>Past Searches</p>
          <div style={{ border: 'black 1px solid', float: 'left' }}>
            {this.state.history.map((oldsearchObj, i) => (
              <div key={i} className='inline-div'>
                <h4 style={{ margin: '20px 0px 0px 0px' }}>{oldsearchObj.searchTerm}:</h4>
                <h3 style={{ margin: '0px' }}>{oldsearchObj.temp}&#176;C</h3>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default App;
