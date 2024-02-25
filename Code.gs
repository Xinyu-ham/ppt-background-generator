propertyService = PropertiesService.getScriptProperties()

var presentation = SlidesApp.getActivePresentation()
const OPENAI_API_KEY = propertyService.getProperty('OPENAI_API_KEY')

function onOpen(e) {
  var ui = SlidesApp.getUi()
  var menu = ui.createMenu('Sexy Menu')
  var button = menu.addItem('Add Background', 'generateBackground')
  menu.addToUi()
}

function generateBackground() {
  var slide = presentation.getSelection().getCurrentPage()
  var textBoxes = slide.getShapes()
  var texts = textBoxes.map((textBox) => textBox.getText().asString())
  
  var prompt = texts.join(' ')
  var image = callDalleApi(prompt)

  slide.getBackground().setPictureFill(image)
}

function callDalleApi(prompt) {
  host = 'https://api.openai.com/v1/images/generations'
  headers = {
    
  }

  data = {
      "model": "dall-e-3",
      "prompt": prompt,
      "n": 1,
      "size": "1792x1024",
      "response_format": "b64_json"
    }

  options = {
    method: "post",
    contentType: "application/json",
    headers: {authorization: `Bearer ${OPENAI_API_KEY}`},
    payload: JSON.stringify(data)
  }
  var response = UrlFetchApp.fetch(host, options)
  imageEncoding = JSON.parse(response.getContentText()).data[0].b64_json
  return Utilities.newBlob(Utilities.base64Decode(imageEncoding), 'image/jpeg')
}
