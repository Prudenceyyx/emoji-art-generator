var emojiController = {
  // list: emojiList.slice(0, emojiList.length / 2),
  list: "😀, ♥️, 🔴, ⚪️, ⚫️, 💙, 🍊, 💰, 🐵, 💛, 💼, 💜, 🌳, 🍪, 🍐,⬜️,☑️".replace(' ','').split(","),
  sheet: undefined,
  pixelArray: undefined,
  a: 5,
  loop: function(cb) {
    for (let j = 0; j < 42; j++) {
      for (let i = 0; i < 42; i++) {
        if (j * 42 + i >= this.list.length) { return }
        if (cb) cb(i, j)
      }
    }
  },

  toText: function(p) {
    p.innerHTML = '';
    this.list.forEach((e, i) => {
      p.innerHTML += e
      if (i % 42 == 41) {
        p.innerHTML += '<br>'
      }
    })
  },
  toCanvas: function(p_selector, canvas) {



    $(p_selector).Emoji({
      path: 'img/apple/',
      // path: 'http://rodrigopolo.com/files/emojilist/img/apple/',
      class: 'emoji',
      ext: 'png'
    })

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let imgs = document.querySelectorAll(p_selector + ' > img')

    let res = Math.floor(canvas.width / 42)

    this.loop((i, j) => {
      let index = j * 42 + i;
      if (index >= imgs.length) { return }
      let img = imgs[index];
      img.onload = function() {
        ctx.drawImage(img, i * res, j * res, res, res);
      };

    })
  },

  toPixelArray: function(canvas) {

    let ctx = canvas.getContext('2d');
    let pixelArray = [];
    let res = Math.floor(canvas.width / 42)


    this.loop((i, j) => {
      var pixel = ctx.getImageData(i * res , j * res , res , res );
      var data = pixel.data;
      data = chunk(data, 4)
      //get average color of the size
      data = data
        .filter(color => color[3] > 80) //filter color that are too alpha
        .map(color =>
          chroma(color[0], color[1], color[2]).alpha(color[3] / 255).css() //
        )

      var average = chroma.average(data);
      pixelArray.push(average);
      // console.log(average)

    })
    this.pixelArray = pixelArray;

    return pixelArray;

    // for (let j = 0; j < 42; j++) {
    //   let y = j * res;
    //   pixelArray.push([])
    //   for (let i = 0; i < 42; i++) {
    //     // For each emoji
    //     let x = i * res;
    //     var pixel = ctx.getImageData(x + 2, y + 2, res - 4, res - 4);
    //     var data = pixel.data;

    //     data = chunk(data, 4)

    //     //get average color of the size
    //     data = data
    //       .filter(color => color[3] > 60)
    //       .map(color =>
    //         chroma(color[0], color[1], color[2]).alpha(color[3] / 255).css()
    //       )

    //     // if (i == 10 && j == 10) {
    //     //   console.log(data)
    //     // }
    //     // console.log(data.length)
    //     var average = chroma.average(data);
    //     pixelArray[pixelArray.length - 1].push(average.css())

    //   }
    // }
  },
  toPixel: function(canvas, array) {
    if (!array) array = this.pixelArray;

    let ctx = canvas.getContext('2d');
    let res = Math.floor(canvas.width / 42);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.loop((i, j) => {
      ctx.beginPath();
      ctx.rect(i * res + 1, j * res + 1, res - 2, res - 2);
      ctx.fillStyle = array[j * 42 + i].css();
      // console.log(array[j * 42 + i])
      ctx.fill();
    });
  },
  getEmoji: function(color) {

    //   // console.log("color", typeof color)

    let distances = []

    this.loop((i, j) => {
      distances.push(chroma.distance(color, this.pixelArray[j * 42 + i], 'rgb'))
    });

    let index = distances.indexOf(Math.min(...distances))

    // return this.list[index]
    return index

  }

}