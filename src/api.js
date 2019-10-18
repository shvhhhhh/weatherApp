import { getRequest } from './util';
import { BASEURL } from './constants';
export function getWeatherByCityName(cityName) {
  return getRequest(`${BASEURL}q=${cityName}`);
}
export function getWeatherByLatLon({ lat, lon }) {
  return getRequest(`${BASEURL}lat=${lat}&lon=${lon}`);
}
export function getWeatherByPin(pin) {
  return getRequest(`${BASEURL}zip=${pin},in`);
}
