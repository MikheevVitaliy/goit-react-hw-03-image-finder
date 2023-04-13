import axios from 'axios';

export async function FetchApi(searchQuery, page, perPage) {
  const KEY = `33801420-150697ebc6b3d77194fe6b38c`;
  const BASE_URL = `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

  const response = await axios.get(BASE_URL);

  return response;
}
