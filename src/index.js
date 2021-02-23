var currentAnime = 0;
var safeSearch = true;

document.getElementById("app").innerHTML = `
<br><div id="main">
  <div class="welcomemsg">
  <h1>Welcome to AniFetch</h1>
  <p>The free tool to <i>fetch</i> information about anime.</p>
  <br>
  <h3>How to use</h3>
  <p>Simply enter any anime name and press "Search".  </p>
  <p>When searching finishes, you automaticaly get the first result.  </p>
  <p>To change what result you get, click the buttons at the top(max = 20).  </p>
  <p>Enjoy searching for anime and have fun.  </p>
  <p class="text-muted" id="plsbackon"><i>btw, you cant search for anime with nudity, i filter that :3</i>  </p>

  </div>

  <div id="found"></div>
  <input id="input" placeholder="Anime..." style="text-align:center;"><br><br>
  <button onmousedown="fetchData()" id="fetchbtn">Search</button><br><br>
  <button onmousedown="safeSearchChange()" id="safesearchbtn">SafeSearch: ON</button>
</div>
`;
const fetchData = () => {
  if(document.querySelector('.welcomemsg')) {
    document.querySelector('.welcomemsg').remove()
  }

  const found = document.getElementById('found');
  if(!document.getElementById('anime')) {
    const input = document.getElementById('input').value;
    const searching = document.createElement('div')
    searching.setAttribute('class', 'loader');
    searching.innerText = "loader"
    console.log(input)
    
    document.getElementById('found').appendChild(searching)
    fetch(
      `https://api.jikan.moe/v3/search/anime?q=${input}&genre=12&genre_exclude=0`
    )
      .then((res) => res.json())
      .then(data => {
        console.log(data)
        if(data.status == 404) {
          var failed = document.createElement('p');
          setTimeout(() => {
            searching.remove()
            failed.innerText = "404 Error. Anime can not be found on MAL. Please try again."
            found.appendChild(failed)
            setTimeout(() => {
              failed.remove()
              setTimeout(() => {
                location.reload()
              }, 1000);
            }, 3000);
          }, 2000);

        }
        

        const resp = data.results[currentAnime]
        if(resp.rated == "R" && safeSearch == true) {
          var failed = document.createElement('p');
          var removeanimecuzbad = true;
          setTimeout(() => {
            
            searching.remove()
            failed.innerText = "Sorry, can't let you do that since the anime is rated R. if you would like to turn this feauture off, press the safe search button."
            found.appendChild(failed)
            setTimeout(() => {
              failed.remove()
              setTimeout(() => {
                location.reload()
              }, 2000);
            }, 6000);
          }, 2000);

        }
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
      <p>ID: <span id="animeid">${resp.mal_id}</span></p>
      </div>
        </div>
        `

        if(removeanimecuzbad == true && document.getElementById('anime')) {
          document.getElementById('anime').remove();
        } else {
          loopthru(data.results)
          searching.remove()
          found.appendChild(div)
        }

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

function safeSearchChange() {
  const thingy = document.getElementById('safesearchbtn')
  if(safeSearch == true) {
    safeSearch = false
    thingy.innerText = "SafeSearch: OFF"
    if(document.getElementById('plsbackon')) {
    document.getElementById('plsbackon').innerText = "pls turn safesearch on, its not safe out here ;-;"
    // alert('turned safesearch off, be carefull')
    }
  }
  else if(safeSearch == false) {
    safeSearch = true
    thingy.innerText = "SafeSearch: ON"
    // alert('turned safesearch on, great job for doing that :3')
    if(document.getElementById('plsbackon')) {
    document.getElementById('plsbackon').innerText = "thanks for putting safe search back on :3"
    }
  }
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