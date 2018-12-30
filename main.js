const requestURL = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBRcJOUCwT6NhTKHDRfujC77wWBQvrn094&cx=004023996120057932432:fillgipdsc8';
const request = new XMLHttpRequest();

window.onload = ()=>{
  const input = document.getElementById('search-input')
  input.addEventListener("keydown", function(e){
    if (e.keyCode === 13) { searchRequest() }
  })
}
let index = 1;

function searchRequest(){
  const query = document.getElementById('search-input').value
  request.open('GET', `${requestURL}&q=${query}&start=${index}`, true);
  request.responseType = 'json';
  request.send();
}

request.onload = function() {
  const next = document.getElementById("next")
  const nextButton = document.createElement("button")
  nextButton.textContent = "next page"
  nextButton.id = "next"  
  nextButton.addEventListener("click", function nextPage(){
    index += 10;
    searchRequest()
    return index;
  })
  pageNumbers = '1 2 3 4 5 6 7 8 9 10'
  let pageNumber = (index + 10).toString()[0]
  let pageNumberHTML = '<strong><big>' + pageNumber + '</big></strong>'
  document.getElementById("index").innerHTML = `${pageNumbers.replace(pageNumber.toString()[0], pageNumberHTML)} `

  const previous = document.getElementById("previous")
  const previousButton = document.createElement("button")
  previousButton.textContent = "previous page"
  previousButton.id = "previous"  
  previousButton.addEventListener("click", function previousPage(){
    index -= 10;
    searchRequest()
    return index;
  })
  
  const errorDiv = document.getElementById('errorDiv')
  const errorPar = document.createElement("p")
  errorPar.id="errorDiv"
  if (request.readyState === 4) {
    const reg = /^4/ 
    if(reg.test(request.status)){ 
      errorPar.innerText = `error - statuscode - ${request.status}`
      console.log(request)
      errorDiv.parentNode.replaceChild(errorPar,errorDiv)
    }
  }
  
  const results = request.response.items;
  results && next.parentNode.replaceChild(nextButton, next )
  results && index>10 && previous.parentNode.replaceChild(previousButton, previous)
  const oldChild = document.getElementById('search-results')
  const newChild = document.createElement("div")
  newChild.id = "search-results"
  newChild.classList.add('search-results')
  const oldImages = document.getElementById("image-results")
  const newImages = document.createElement("div")
  newImages.id = "image-results"
  
  results && results.map(result=>{
    newImages.classList.add("image-results")
    const singleResult = document.createElement("div")
    singleResult.classList.add("result")
    const title = document.createElement("h3")
    const link = document.createElement("a")
    const description = document.createElement("p")
    title.textContent = result.title
    title.classList.add("title")
    link.textContent = result.link
    link.href = result.link
    link.classList.add("link")
    description.innerHTML = result.htmlSnippet
    description.classList.add("description")
    singleResult.appendChild(title)
    singleResult.appendChild(link)
    singleResult.appendChild(description)
    newChild.appendChild(singleResult)
    const imageResult = document.createElement("div")
    imageResult.classList.add("imageContainer")
    const imageLink = document.createElement("a")
    const image = document.createElement("img")
    if(result.pagemap !== undefined && result.pagemap.cse_image !== undefined){
      image.src = result.pagemap.cse_image[0].src
      imageLink.href = result.pagemap.cse_image[0].src
      imageLink.target = "_blank"
    }
    image.alt = result.title
    imageLink.appendChild(image)
    imageResult.appendChild(imageLink)
    newImages.appendChild(imageResult)

  })
  
  results && oldImages.parentNode.replaceChild(newChild, oldChild)
  results && oldImages.parentNode.replaceChild(newImages, oldImages)
  if(!results){
    const noResults = document.createElement("div")
    noResults.textContent = "Sorry no results were found"
    noResults.id = "search-results"
    oldImages.parentNode.replaceChild(noResults, oldChild)
    oldImages.parentNode.replaceChild(newImages, oldImages);
  }
  console.log(results)
  console.log(request.response)
}
