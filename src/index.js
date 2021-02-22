var currentAnime = 0;


document.getElementById("app").innerHTML = `
<br><div id="main">
  <div id="found"></div>
  <input id="input" placeholder="anime name"><br><br>
  <button onmousedown="fetchData()" id="fetchbtn">Search</button>
</div>
`;
const fetchData = () => {
  const found = document.getElementById('found');
  if(!document.getElementById('anime')) {
    const input = document.getElementById('input').value;
    const searching = document.createElement('p')
    console.log(input)
    searching.innerText = "Searching..."
    document.getElementById('found').appendChild(searching)
    fetch(
      `https://api.jikan.moe/v3/search/anime?q=${input}`
    )
      .then((res) => res.json())
      .then(data => {
        console.log(data)
        if(!data) {
          debugger;
        }

        const resp = data.results[currentAnime]
        // const synopsis = resp.synopsis.replace(/[.]/g, "<br>")
        let div = document.createElement('div');
        div.innerHTML = `
        <div id="anime">
        <img src="${resp.image_url}">
        <br><br>
        <h1 id="title"><a href="${resp.url}">${resp.title}</a></h1>
        <p id="synopsis">
        <a>Synopsis:</a>
        ${resp.synopsis}
        </p>
        <p id="type">
        <a>Type:</a> ${resp.type} 
        </p>
        <p id="episodes">
          <a>Episodes:</a> ${resp.episodes}
        </p>
        <p id="isairing">
        <a>Is airing:</a> ${resp.airing}
      </p>
      <p id="rating">
      <a>Rating:</a> ${resp.rated}
      </p>
      <p id="startdate">
      <a>Start date:</a> ${Date(resp.start_date)}
      </p>
      <p id="enddate">
      <a>End date:</a> ${Date(resp.end_date)}
      </p>

      <div id="mal">
      <b>MAL:</b>
      <p class="text-muted">
      Score: ${resp.score}
      </p>
      
      <p class="text-muted">Members: ${resp.members}</p>
      </div>
        </div>
        `
        searching.remove()
        found.appendChild(div)
        document.querySelector('.navbar-toggler').click()
        loopthru(data.results)
      });
  } else {
    document.getElementById('anime').remove();
    checkForChildren()
    fetchData()
  }

};


//enter handler
document.body.addEventListener('keydown', function(e) {
  if(e.key == "Enter") {
    fetchData()
  }
})

// {
//   "mal_id": 11741,
//   "url": "https://myanimelist.net/anime/11741/Fate_Zero_2nd_Season",
//   "image_url": "https://cdn.myanimelist.net/images/anime/8/41125.jpg?s=78a6e73a2cd5856b28d8c182cd5a1a22",
//   "title": "Fate/Zero 2nd Season",
//   "airing": false,
//   "synopsis": "As the Fourth Holy Grail War rages on with no clear victor in sight, the remaining Servants and their Masters are called upon by Church supervisor Risei Kotomine, in order to band together and confron...",
//   "type": "TV",
//   "episodes": 12,
//   "score": 8.59,
//   "start_date": "2012-04-08T00:00:00+00:00",
//   "end_date": "2012-06-24T00:00:00+00:00",
//   "members": 812711,
//   "rated": "R"
//   }

function checkForChildren() {
  let list = document.getElementById('pagination');
  if(list.hasChildNodes() == true) {
    list.removeChild(list.firstChild)
  } else {
    return;
  }
  checkForChildren()
}


function changeAnime(num) {
  currentAnime = +num;
  fetchData()
}

function loopthru(array) {
  let number = 0;
  let max = 0;
  let displaynum = 0;
  array.forEach(anime => {
    if(max == 20)
      return console.log("maxed pagination");
    const button = document.createElement('button');
    displaynum += 1
    button.setAttribute('onmousedown', `changeAnime(${number})`)
    button.setAttribute('class', `btn btn-outline-info mr-3`)
    button.setAttribute('style', `margin: 2px 3px 4px 3px !important;`)
    button.innerHTML = 
    `
    ${displaynum}   
    `
    number += 1
    console.log(number)
    max += 1
    document.getElementById('pagination').appendChild(button)
  });
}