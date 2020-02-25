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
          visibility: hidden
        }
      </style>
      <div id="dropArea">
        <form class="my-form">
          <input type="file" id="fileElem" accept="image/*,application/pdf" on-change="_handleFiles">
          <br>
          <label class="button" for="fileElem">Select files</label>
        </form>
        <progress id="progressBar" max=100 value=0></progress>
        <div id="gallery"></div>
      </div>
    `;
  }
  static get properties() {
    return {
      typeOfOutput: {
        type: String,
        value: 'blob',
        observer: '_selectFile'
      },
      Invoke: {
        observer: '_selectFile'
      }
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
    this.dropArea.addEventListener('drop', this._handleDrop.bind(this), false)
  }

  _selectFile() {
    this.$.fileElem.click()
    // var elem = this.$.fileElem
    // console.log(elem)
    // console.log(document.createEvent)
    // if(elem && document.createEvent) {
    //   var evt = document.createEvent("MouseEvents");
    //   evt.initEvent("click", true, false);
    //   elem.dispatchEvent(evt);
    // }
  }

  _initializeProgress(numfiles) {
    this.progressBar.value = 0
    this.filesDone = 0
    this.filesToDo = numfiles
  }

  _progressDone() {
    this.filesDone++
    this.progressBar.value = this.filesDone / this.filesToDo * 100
  }

  _preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  _highlight(e) {
    e.path[0].classList.add('highlight')
  }
  
  _unhighlight(e) {
    e.path[0].classList.remove('highlight')
  }

  _handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files[0]
    this._initializeProgress(1)
    this._uploadFile(files)
    this._previewFile(files)
  }

  _handleFiles(e) {
    var files = e.path[0].files[0]
    this._initializeProgress(1)
    this._uploadFile(files)
    this._previewFile(files)
  }

  _getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result)
      console.log(typeof reader.result)
      this.dispatchEvent(new CustomEvent("file-output", {detail: reader.result.split(',')[1]}));
    };
    reader.onerror = error => reject(error);
  }
  
  _uploadFile(file) {
    if (this.typeOfOutput == 'blob') {
      const fileAsBlob = new Blob([file], {type : file.type});
      console.log(fileAsBlob)
      console.log(typeof fileAsBlob)
      this.dispatchEvent(new CustomEvent("file-output", {detail: fileAsBlob}));
    } else if (this.typeOfOutput == 'base64') {
      this._getBase64(file);
    }
    this._progressDone()
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
