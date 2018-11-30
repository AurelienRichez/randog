class Randog extends HTMLElement {
  
  static get observedAttributes() { return ['breed', 'subbreed']; }

  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'closed'})

    const style = document.createElement('style');
    style.innerText = `
    :host {
      display:inline-block;
    }
    img {
      max-width:100%;max-height:100%;display:block
    }
    `
    const img = document.createElement('img')

    shadow.appendChild(style)
    shadow.appendChild(img)

    this.setImage = (url) => img.src = url
    this.lastQuery = null
  }

  get attributes() {
    const attributes = {}
    for (let name of this.getAttributeNames()) {
      attributes[name] = this.getAttribute(name)
    }
    return attributes
  }
  
  attributeChangedCallback(_, oldValue, newValue) {
    if(oldValue !== newValue) {
      this.updateImg()
    }
  }
  
  connectedCallback() {
    this.updateImg()
  }

  updateImg() {
    if(this.isConnected) {
      const { breed, subbreed } = this.attributes
      const url = Randog.dogURl(breed, subbreed)

      const currentQuery = fetch(url)
      this.lastQuery = currentQuery
      currentQuery.then(response => response.json())
        .then(result => {
          if(this.lastQuery ===  currentQuery) {
            this.dispatchEvent(new Event('imageUpdated'))
            this.setImage(result.message)
          }
        })
    }
  }
  
  static dogURl(breed, subBreed) {
    if(breed && breed !== "") {
      return (subBreed &&subBreed !== "") ?
      `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`
      : `https://dog.ceo/api/breed/${breed}/images/random`
    } else {
      return 'https://dog.ceo/api/breeds/image/random'
    }
  }
}

customElements.define('ran-dog', Randog)
