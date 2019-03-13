var imageController = {
  col: undefined,
  row: undefined,
  img: undefined,
  res: undefined,
  closepixel: undefined,
  pixelArray: undefined,

  checkImg: function() {
    if (!this.img) {
      console.error("image node not defined yet");
      return
    }
  },
  setImg: function(img, col) {
    this.img = img;
    if (col) this.setCol(col);
  },
  setCol: function(col) {
    this.checkImg()
    this.col = col;
    this.res = Math.floor(this.img.width / this.col / 2) * 2
  },
  toPixel: function(col) {
    if (!col) col = this.col;
    this.setCol(col); // update col if any paramter
    this.checkImg()
    if (!this.closepixel) {
      this.closepixel = this.img.closePixelate([
        { resolution: this.res }
      ]);
    } else {
      this.closepixel.render([{ resolution: this.res }])
    }
  },
  getPixelArray: function() {

    this.checkImg();
    if (!this.closepixel) {
      console.log("no pixel object yet");
      return
    }

    let canvas = document.getElementById(this.img.id)
    let ctx = canvas.getContext('2d');
    let pixelArray = []
    // Get pixel from pixelated image
    for (let j = 0; j < Math.floor(this.img.height / this.res); j++) {
      for (let i = 0; i < this.col; i++) {

        let color = ctx.getImageData(i * this.res, j * this.res, 1, 1).data;
        pixelArray.push(color);

      }
    }
    pixelArray = pixelArray
      .map(colorArray => {
        // Parse transparent to white
        if (colorArray[3] == 0) {
          return chroma(255, 255, 255)
        }
        return chroma(colorArray[0], colorArray[1], colorArray[2])
      }) //no alpha

    this.pixelArray = pixelArray;
    return pixelArray;

  },
  updateEmoji: function(emojiController, placeholder) {
    if (!this.pixelArray) { console.error("No pixel array for the image yet") }

    console.log(emojiController.list)
    console.log(emojiController.pixelArray)

    let emojiIndex = this.pixelArray.map(chromaObject => {
      let i = emojiController.getEmoji(chromaObject.css());
      console.log(chromaObject.css(), emojiController.pixelArray[i].css(), i)
      return i
    })


    placeholder.innerHTML = '';
    emojiIndex.map((eIndex, i) => {
      placeholder.innerHTML += emojiController.list[eIndex]
      //linebreak
      if (i % this.col == this.col - 1) {
        placeholder.innerHTML += '<br>'
      }
    });

    return emojiIndex


  }

}