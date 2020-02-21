import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `file-upload`
 * To upload file
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FileUpload extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #dropArea {
          border: 2px dashed #ccc;
          border-radius: 20px;
          width: 480px;
          font-family: sans-serif;
          margin: 100px auto;
          padding: 20px;
        }
        #dropArea.highlight {
          border-color: purple;
        }
        p {
          margin-top: 0;
        }
        .my-form {
          margin-bottom: 10px;
        }
        #gallery {
          margin-top: 10px;
        }
        #gallery img {
          width: 150px;
          margin-bottom: 10px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .button {
          display: inline-block;
          padding: 10px;
          background: #ccc;
          cursor: pointer;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .button:hover {
          background: #ddd;
        }
        #fileElem {
          display: none;
        }
      </style>
      <div id="dropArea">
        <form class="my-form">
          <input type="file" id="fileElem" accept="image/*,application/pdf" on-change="_handleFiles">
          <label class="button" for="fileElem">Select files</label>
        </form>
        <progress id="progressBar" max=100 value=0></progress>
        <div id="gallery"></div>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'file-upload',
      },
    };
  }

  // constructor() {
  //   super();
  //   this._onInit()
  // }
  connectedCallback(){
    super.connectedCallback()
    this._onInit()
  }

  _onInit () {
    this.filesDone = 0
    this.filesToDo = 0
    this.progressBar = this.$.progressBar
    this.dropArea = this.$.dropArea
    this.gallery = this.$.gallery
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this._preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this._highlight, false)
    })
    
    ;['dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this._unhighlight, false)
    })
    this.dropArea.addEventListener('drop', this._handleDrop, false)
  }

  _initializeProgress(numfiles) {
    this.progressBar.value = 0
    this.filesDone = 0
    this.filesToDo = numfiles
  }

  _progressDone() {
    filesDone++
    progressBar.value = filesDone / filesToDo * 100
  }

  _preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  _highlight(e) {
    this.dropArea.classList.add('highlight')
  }
  
  _unhighlight(e) {
    this.dropArea.classList.remove('highlight')
  }

  _handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
  
    this._handleFiles(files)
  }

  _handleFiles(e) {
    console.log(e)
    var files = e.path[0].files[0]
    console.log(files)
    this._initializeProgress(1)
    this._uploadFile(files)
    this._previewFile(files)
    // files.forEach(file => this._uploadFile(file))
    // files.forEach(file => this._previewFile(file))
  }
  
  _uploadFile(file) {
    let url = 'YOUR URL HERE'
    let formData = new FormData()
  
    formData.append('file', file)
    console.log(file)
  
    // fetch(url, {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(_progressDone)
    // .catch(() => { /* Error. Inform the user */ })
  }

  _previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      let img = document.createElement('img')
      img.src = reader.result
      this.gallery.appendChild(img)
    }
  }

}

window.customElements.define('file-upload', FileUpload);
