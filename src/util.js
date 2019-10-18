import cityList from './cityList';

const controller = new AbortController();
const signal = controller.signal;
export async function postRequest(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),signal
  });
  return await response.json();
}

export async function getRequest(url = '') {
 // controller.abort();
  //const response = await debounceReturn(fetch)(url);
  const response = await fetch(url);
  return await response.json();
}

export function findCityByName(cityName) {
  const filteredCityList = cityList.filter(cityObj => cityObj.name.includes(cityName));
  console.log(filteredCityList);
  return filteredCityList;
}

export function setPersistData(key, data) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function getPersistData(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

////for calling a function
export function debounce(func){
   return function () {
    clearTimeout(Window.timer);
    Window.timer = setTimeout(func.apply.bind(func, this, arguments), 1000);
  };
}
//// for calling and returning the value from function
function debounceReturn(func){
//Window.timer=null;
   return function () {
    clearTimeout(Window.timer);
	return new Promise((resolve)=>{
Window.timer = setTimeout(()=>{resolve(func.apply.bind(func, this, arguments)())}, 1500);})
    
  };
}
