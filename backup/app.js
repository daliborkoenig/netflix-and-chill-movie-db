// omdbapi key e8021955
// themoviedb key 276770bbde205f73041b92d3087003ed
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import anime from 'animejs/lib/anime.es.js';
import 'regenerator-runtime/runtime'
import './style.scss'

const wrapper = document.querySelector("#wrapper")
const displayResults = document.querySelector(".displayResults")
const displayCard = document.querySelector(".displayCard")
const closeScreen = document.querySelector(".closeScreen")
const closeScreen2 = document.querySelector(".closeScreen2")
const formElem = document.querySelector("form")
const userInp = document.querySelector("#searchBar")







const searchBtn = document.querySelector("#search")
let searchStr = ""

const popMov = document.querySelector("#popMov")
const popTV = document.querySelector("#popTV")
const randMov = document.querySelector("#randMov")
const randTV = document.querySelector("#randTV")




// http://www.omdbapi.com/?t=the+avengers&plot=full
// http://www.omdbapi.com/?apikey=[e8021955]&
// http://www.omdbapi.com/?i=tt3896198&apikey=e8021955

// https://image.tmdb.org/t/p/w500/6x9V3gr6k1FMi21uPDlVfiVtdvS.jpg
// https://api.themoviedb.org/3/search/movie?api_key=276770bbde205f73041b92d3087003ed&query=Jack+Reacher


// ---------------------------------- FUNCTIONS ----------------------------------

// Event listener for search
searchBtn.addEventListener("click", (e)=>{
  e.preventDefault()
  if(userInp.value.length == 0){}
  else{
    let searchStr = userInp.value
    checkWords(searchStr)
  }
  searchContent()
})

// function to check the search string and turn it in to compatible format (word+word)
function checkWords(inp){
  searchStr = inp.split(" ").join("+")
  if(searchStr.lastIndexOf("+") == searchStr.length-1){
    searchStr = searchStr.slice(0,-1)
  }
}

// function for the search bar, takes user input, runs it through checkWords function and fetches results
async function searchContent(){
  if(searchStr.length == 0){}
  else{
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=276770bbde205f73041b92d3087003ed&language=en-US&query=${searchStr}&page=1&include_adult=false`);
    const result = await res.json();
    if (result.results.length == 0) {}
    else{
      displayContent(result.results)
    }
  }
}

// event listeners for other buttons
popMov.addEventListener("click", (e)=>{
  e.preventDefault()
  popularMovies()
})
popTV.addEventListener("click", (e)=>{
  e.preventDefault()
  popularTV()
})
randMov.addEventListener("click", (e)=>{
  e.preventDefault()
  randomMovie()
})
randTV.addEventListener("click", (e)=>{
  e.preventDefault()
  randomTV()
})

// functions to generate content for other buttons
async function randomMovie(){
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=276770bbde205f73041b92d3087003ed&page=1`);
  const result = await res.json(); 
  displayItem(result.results[Math.floor(Math.random()*result.results.length)].id, "movie")
}
async function randomTV(){
  const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=276770bbde205f73041b92d3087003ed&page=1`);
  const result = await res.json(); 
  displayItem(result.results[Math.floor(Math.random()*result.results.length)].id, "tv")
}
async function popularMovies(){
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=276770bbde205f73041b92d3087003ed&page=1`);
  const result = await res.json(); 
  displayContent(result.results)
}
async function popularTV(){
  const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=276770bbde205f73041b92d3087003ed&language=en-US&page=1`);
  const result = await res.json();
  displayContent(result.results)
}

// function that fetches the genre list from api and then compares it with our item
async function getGenre(arr){
  // console.log(arr);
  let genres = []
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=276770bbde205f73041b92d3087003ed&language=en-US`);
  const result = await res.json();
  result.genres.forEach(item => {
    arr.forEach(id => {
      if (item.id == id) {
        genres.push(item.name)
      }
    });
  });
  return genres;
}

// function to fetch trailer by type and id of our item
async function getTrailer(id, type){
  if(type == "movie"){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=276770bbde205f73041b92d3087003ed&language=en-US`);
    const result = await res.json();
    return result.results;
  }
  else{
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=276770bbde205f73041b92d3087003ed&language=en-US`);
    const result = await res.json();
    return result.results;
  }
}

// function to get cast from API using id from our item
async function getCast(id, type){
  let result
  if(type == "movie"){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=276770bbde205f73041b92d3087003ed&language=en-US`);
    result = await res.json();
  }
  else{
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=276770bbde205f73041b92d3087003ed&language=en-US`);
    result = await res.json();
  }
  return result.cast;
}

// function to animate the window opening when clicked on one of the options
function animateScreen(elem){
  eval(elem).style.display = "flex"
  let offW
  let offH
  if (elem == "displayCard") {
    offW = 500
    offH = 50
  }
  else{
    offW = 50
    offH = 150
  }
  anime({
    targets: `.${elem}`,
    width: eval(elem).parentElement.clientWidth -offW,
    height: eval(elem).parentElement.clientHeight -offH,
    duration: 1000,
    easing: 'easeInOutSine',
    })
  const close = eval(elem).firstElementChild
  // console.log(close);
  close.addEventListener("click", ()=>{
    eval(elem).innerHTML = ""
    eval(elem).appendChild(close)
    anime({
      targets: `.${elem}`,
      width: 0,
      height: 0,
      duration: 1000,
      easing: 'easeInOutSine',
      complete: function() {
        eval(elem).style.display = "none"
      }
    })
  })
}

// function to display the search content
function displayContent(arr){
  // console.log(arr);
  animateScreen("displayResults")
  arr.forEach(async (item) => {
    let genres = await getGenre(item.genre_ids)
    genres = genres.join(", ")
    let title
    let date
    let type
    if(item.original_title){
      title = item.original_title
      date = new Date (item.release_date)
      type = "movie"
    }
    else{
      title = item.name
      date = new Date(item.first_air_date)
      type = "TV show"
    }
    const searchResult = document.createElement("div")
    searchResult.className = "movie"
    searchResult.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${item.backdrop_path}" alt="" srcset="">
    <div class="movieCard">
      <h4>${title} (${date.getFullYear()})</h4>
      <p><b>Description:</b> ${item.overview}</p>
      <p><b>Genres:</b> ${genres}<span>    <b>Type:</b> ${type}</span></p>
      
    </div>`
    setTimeout(() => {
      displayResults.appendChild(searchResult)
    }, 1000);
    searchResult.addEventListener("click", (e)=>{
      if(item.original_title){
        displayItem(item.id, "movie")
      }
      else{
        displayItem(item.id, "tv")
      }
    })
  });
}

// function to display single item
async function displayItem(id, type){
  let res
  let result
  let trailer = await getTrailer(id, type)
  // console.log(trailer);
  if(type == "movie"){
    // console.log("movie");
    res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=276770bbde205f73041b92d3087003ed&language=en-US
    `);
    result = await res.json();
    title = result.original_title
    date = new Date (result.release_date)
    type = "movie"
  }
  else{
    res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=276770bbde205f73041b92d3087003ed&language=en-US
    `);
    result = await res.json();
    title = result.name
    date = new Date(result.first_air_date)
    type = "TV show"
  }
  console.log(result);
  let genres = []
  result.genres.forEach(item => {
    genres.push(item.name)
  });
  let title
  let date
  let cast = await getCast(id, type)
  // console.log(cast);
  // const result = await res.json();
  animateScreen("displayCard")
  const displayItem = document.createElement("div")
  displayItem.className = "movieInfo"
  const poster = new Image
  poster.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`
  const movieCard = document.createElement("div")
  movieCard.className = "movieCard"
  const cardTitle = document.createElement("h4")
  cardTitle.className = "cardTitle"
  cardTitle.innerHTML = `${title} (${date.getFullYear()})<span>Rating: ${result.vote_average}/10</span>`
  const cardDescription = document.createElement("p")
  cardDescription.innerHTML = `<b>Description:</b> ${result.overview}`
  const cardCast = document.createElement("div")
  cardCast.className = "castList"
  cardCast.innerHTML = `<b>Cast:</b><br>`
  cast.forEach(item => {
    // console.log(item);
    const actor = document.createElement("div")
    actor.className = "actor"
    actor.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${item.profile_path}" alt="actor image" width="50px">
      <p>${item.name} as ${item.character}</p>`
    cardCast.appendChild(actor)
  });
  const cardGenre = document.createElement("div")
  cardGenre.className = `genres`
  genres.forEach(item => {
    const gen = document.createElement("span")
    gen.textContent = `${item}`
    cardGenre.appendChild(gen)
  });
  
  const video = document.createElement("div")
  video.className = "video"
  video.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer[0].key}" allowfullscreen></iframe>`

  setTimeout(() => {
    displayCard.appendChild(displayItem)
    displayItem.append(poster,movieCard)
    movieCard.append(cardTitle,video,cardDescription,cardCast,cardGenre)
  }, 1000);
}


// CLICK ANIMATION

var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#FF6138";
var animations = [];
var circles = [];

var colorPicker = (function() {
  var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
  var index = 0;
  function next() {
    index = index++ < colors.length-1 ? index : 0;
    return colors[index];
  }
  function current() {
    return colors[index]
  }
  return {
    next: next,
    current: current
  }
})();

function removeAnimation(animation) {
  var index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
  var l = Math.max(x - 0, cW - x);
  var h = Math.max(y - 0, cH - y);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
  document.addEventListener("touchstart", handleEvent);
  document.addEventListener("mousedown", handleEvent);
};

function handleEvent(e) {
    if (e.touches) { 
      e.preventDefault();
      e = e.touches[0];
    }
    var currentColor = colorPicker.current();
    var nextColor = colorPicker.next();
    var targetR = calcPageFillRadius(e.pageX, e.pageY);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 750;
    
    var pageFill = new Circle({
      x: e.pageX,
      y: e.pageY,
      r: 0,
      fill: nextColor
    });
    var fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration:  Math.max(targetR / 2 , minCoverDuration ),
      easing: "easeOutQuart",
      complete: function(){
        bgColor = pageFill.fill;
        removeAnimation(fillAnimation);
      }
    });
    
    var ripple = new Circle({
      x: e.pageX,
      y: e.pageY,
      r: 0,
      fill: currentColor,
      stroke: {
        width: 3,
        color: currentColor
      },
      opacity: 1
    });
    var rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: "easeOutExpo",
      duration: 900,
      complete: removeAnimation
    });
    
    var particles = [];
    for (var i=0; i<32; i++) {
      var particle = new Circle({
        x: e.pageX,
        y: e.pageY,
        fill: currentColor,
        r: anime.random(24, 48)
      })
      particles.push(particle);
    }
    var particlesAnimation = anime({
      targets: particles,
      x: function(particle){
        return particle.x + anime.random(rippleSize, -rippleSize);
      },
      y: function(particle){
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
      },
      r: 0,
      easing: "easeOutExpo",
      duration: anime.random(1000,1300),
      complete: removeAnimation
    });
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b){
  for(var key in b) {
    if(b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

var Circle = function(opts) {
  extend(this, opts);
}

Circle.prototype.draw = function() {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
  ctx.globalAlpha = 1;
}

var animate = anime({
  duration: Infinity,
  update: function() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach(function(anim) {
      anim.animatables.forEach(function(animatable) {
        animatable.target.draw();
      });
    });
  }
});

var resizeCanvas = function() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
  resizeCanvas();
  if (window.CP) {
    // CodePen's loop detection was causin' problems
    // and I have no idea why, so...
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
  }
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
  if (!!window.location.pathname.match(/fullcpgrid/)) {
    startFauxClicking();
  }
  handleInactiveUser();
})();

function handleInactiveUser() {
  var inactive = setTimeout(function(){
    fauxClick(cW/2, cH/2);
  }, 2000);
  
  function clearInactiveTimeout() {
    clearTimeout(inactive);
    document.removeEventListener("mousedown", clearInactiveTimeout);
    document.removeEventListener("touchstart", clearInactiveTimeout);
  }
  
  document.addEventListener("mousedown", clearInactiveTimeout);
  document.addEventListener("touchstart", clearInactiveTimeout);
}

function startFauxClicking() {
  setTimeout(function(){
    fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
    startFauxClicking();
  }, anime.random(200, 900));
}

function fauxClick(x, y) {
  var fauxClick = new Event("mousedown");
  fauxClick.pageX = x;
  fauxClick.pageY = y;
  document.dispatchEvent(fauxClick);
}