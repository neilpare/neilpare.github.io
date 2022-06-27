'use strict';

const CONFIG = {
  API_KEY: '29874897-d929-49e8-8b94-30c96a448686',
  LOADED_IMAGES_COUNTER: 0,
  MAX_PICS_PER_QUERY: 5,
  MAX_PRELOAD_BUFFER_SIZE: 5,
  CAT_IMG_CONTAINER_ID: 'cat-box', // The element that contains the cat <img>
  CAT_IMG_ID: 'cat-image',
  CAT_IMG_CLASS: 'cat-image',
  CAT_IMG_ALT_TEXT: 'a random image of a cat'
}

let PRELOADED_IMG_BUFFER = [];




/**
 * Created using this reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @param {integer} howMany - how many pics to fetch
 * @returns an array of urls of length 'howMany'
 */
async function getCatUrlsFromAPI(howMany) {
  console.log('Started API call...');

  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${howMany}`
  // , {
    // method: 'GET', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'include', // include, *same-origin, omit
    // headers: {
    //   'Content-Type': 'application/json',
    //   'x-api-key': CONFIG.API_KEY
    // },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  // }
  )

  // response.json() is going to be an array
  let urlList = await response.json()//.map(obj => obj.url);
  // console.log(urlList[0]);
  urlList = urlList.map(obj => obj.url);
  console.log('urlList retrieved: ', urlList);
  return urlList;
}


/**
 * Given an array of urls, creates <img> elements to preload
 * and stores them in PRELADED_IMG_BUFFER (global)
 * @param {array} urlList - an array of strings
 */
function preloadImages(urlList) {
  urlList.forEach(url => {
    const newImg = new Image();
    newImg.src = url;
    newImg.id = CONFIG.CAT_IMG_ID;
    newImg.classList.add(CONFIG.CAT_IMG_CLASS);
    newImg.alt = CONFIG.CAT_IMG_ALT_TEXT;
    PRELOADED_IMG_BUFFER.push(newImg);
  });
  console.log('Current preloaded buffer: ', PRELOADED_IMG_BUFFER);
}





/**
 * Replaces the current <img> tag with a new one picked from the preloaded array
 */
function loadNewCatImage() {
  // Replace the current img with the first element of the preloaded array
  // NOTE: the .shift() automatically removes the element from the array
  const currentImg = document.querySelector(`#${CONFIG.CAT_IMG_ID}`);
  currentImg.replaceWith(PRELOADED_IMG_BUFFER.shift());
  CONFIG.LOADED_IMAGES_COUNTER++;
  console.log('Image loaded', CONFIG.LOADED_IMAGES_COUNTER);

  // Now we preload a new img in the preload buffer
  getCatUrlsFromAPI(1).then(urlList => preloadImages(urlList));
}

/**
 * This should be invoked by the button "copy to clipboard"
 */
function invokeCopyToClipBoard() {
  const url = document.querySelector('#cat-image').src;
  copyTextToClipBoard(url);
}

/**
 * @param {string} text - the text to copy to the clipboard
 */
function copyTextToClipBoard(text) {
  navigator.clipboard.writeText(text).then(
    // On success
    () => alert('Url of image copied to clipboard')
  , 
    // On failure
    () => alert('There was an error copying url to clipboard')
  );

}












//
// EXECUTE WHEN SCRIPT IS READY
//

getCatUrlsFromAPI(CONFIG.MAX_PRELOAD_BUFFER_SIZE)
.then(urlList => {
  preloadImages(urlList);
  loadNewCatImage();
});









//
// THE FOLLOWING FUNCTION ARE NOT IN USE AT THE MOMENT
//




/**
 * @param {integer} howMany - how many pictures to return
 * @returns A string with the URL of a random picture
 */
 async function getNewCatPics(howMany) {
  const urls = await getCatUrlsFromAPI(howMany);
  const pic = urls[getRandomIndex(urls.length)];
  return pic;
}




/**
 * Changes the background of an element with a random cat image
 * @param {string} id - the id of the element, prefixed with '#'
 */
 function loadCatImageAsBackground(id) {
  getRandomCatPic().then(url => {
    document.querySelector(id).style.backgroundImage = url;
  });
}



/**
 * Throws if input is not a number.
 * @param {integer} listLength - the length of the list
 * @returns a random index from 0 to (listLength - 1)
 */
 function getRandomIndex(listLength) {
  if(typeof listLength != 'number') {
    throw Error(`${listLength} is not a valid number`);
  }
  listLength = Math.floor(listLength);
  const index = Math.floor(Math.random() * listLength);
  return index;
}

