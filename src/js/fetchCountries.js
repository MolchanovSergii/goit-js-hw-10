
export default function fetchCountries(url) {
  return fetch(url).then(resp => {
    if (!resp.ok) {
        throw resp;   
    }
    return resp.json();
  });
}
