import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '100%',
  position: 'left-bottom',
  fontSize: '30px',
  closeButton: false,
});

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1';
const END_POINT = 'translation';
const FILTER_PARAM = '?fields=name,capital,languages,population,flags';
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    
    let userInput = e.target.value.trim();

    if (!userInput) {
      eraseMarkup()  
      return;
    }

    const urlQuery = `${BASE_URL}/${END_POINT}/${userInput}/${FILTER_PARAM}&=`;

  fetchCountries(urlQuery)
    .then(data => {
      if (data.length === 1) {
        eraseMarkup();
        countryInfo.innerHTML = createMarkupCountryInfo(data);
      } else if (data.length > 1 && data.length <= 10) {
        eraseMarkup();
        countryList.innerHTML = createMarkupCountryList(data);
      } else {
        eraseMarkup();
        Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(err => {
      eraseMarkup();
      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }else {Notify.failure(`Oops,${err.message}`);}
    });
}



// рисует разметку, если стран >1 и <=10
function createMarkupCountryList(arr) {
    return arr
      .map(({ flags: { svg }, name: { common } }) => `
        <li>
            <img src="${svg}" alt="${common}">
            <p>${common}</p>
        </li>`)
      .join('');
}
// рисует разметку, если страна в списке одна
function createMarkupCountryInfo(arr) {
    return arr
      .map(
        ({
          flags: { svg },
          name: { common },
          capital,
          population,
          languages,
        }) => `
        <div>
        <img src="${svg}" alt="${common}">
        <h2>${common}</h2>
        </div>
        <p><strong>Capital: </strong><span>${capital}</span></p>
        <p><strong>Population: </strong><span>${population}</span></p>
        <p><strong>Languages: </strong><span>${Object.values(languages).join(', ')}</span></p>
    `
      )
      .join('');
}

function eraseMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  return;
}