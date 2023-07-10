import { fetchImages } from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { createMarkup } from './js/function';
const searchForm = document.getElementById('search-form');
const buttonSearch = searchForm.querySelector('.button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const perPage = 40;
let currentPage = 1;
let searchQuery = '';
let currentHits = 0;

searchForm.addEventListener('submit', onSubmit);
let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    Notiflix.Notify.info('Enter your request, please!');
    return;
  }

  try {
    const data = await fetchImages(searchQuery, currentPage);
    const searchResults = data.hits;

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      createMarkup(searchResults);
      lightbox.refresh();
    }

    if (data.totalHits > perPage) {
      btnLoadMore.classList.remove('is-hidden');
    } else {
      btnLoadMore.classList.add('is-hidden');
    }

    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}

btnLoadMore.addEventListener('click', onClickLoadMore);

async function onClickLoadMore() {
  currentPage++;

  try {
    const data = await fetchImages(searchQuery, currentPage, perPage);
    const searchResults = data.hits;

    if (searchResults.length > 0) {
      createMarkup(searchResults);
      lightbox.refresh();
    }
    if (gallery.children.length >= data.totalHits) {
      btnLoadMore.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
  btnLoadMore.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
function showLoadMorePage() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    onClickLoadMore();
  }
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
