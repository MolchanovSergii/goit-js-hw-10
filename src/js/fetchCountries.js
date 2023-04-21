
export default function fetchCountries(url) {
  return fetch(url).then(resp => {
    if (!resp.ok) {
        throw new Error(resp.statusText);   
    }
    return resp.json();
  });
}
