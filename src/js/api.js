import axios from 'axios';
const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '38163624-c401c415b68f921ba84e58d0e';

export async function fetchImages(q, page, perPage) {
  const url = `${ENDPOINT}?key=${API_KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
