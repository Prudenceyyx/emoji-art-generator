function chunk(array, size) {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
}


var emojiController = {
  // list: emojiList,
  list: "🏷,💡,♥️,🔴,⚪️,🏳,🖱,📄,⬜️,☁️,☑️,⚫️,🌚,🌑,💨,💙,🛂,🔷,🔵,🐬,💠,📘,🐵,💼,💩,😈,🐻,💜,✝️,💗,🌸,🌳,🌲,🎾,🍪".replace(' ', '').split(","),
  // 🎾,⬛️,👽,🐦,☣️,😀,🌕,🌝,💛,,🍊,😡
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
      // path: 'img/apple/',
      // path: 'https://rodrigopolo.com/files/emojilist/img/apple/',
      path:'https://raw.githubusercontent.com/Prudenceyyx/emoji/master/img/apple/',
      // path: 'img/emojione/',
      class: 'emoji',
      ext: 'png'
    })

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let imgs = document.querySelectorAll(p_selector + ' > img')

    let res = Math.floor(canvas.width / 42)

    console.log(imgs.length)

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

    this.pixelArray = []

    for (let index = 0; index < this.list.length; index++) {
      let j = Math.floor(index / 42);
      let i = index % 42;
      let pixel = ctx.getImageData(i * res, j * res, res, res).data;
      pixel = chunk(pixel, 4)
      pixel = pixel
        // .filter(color => color[3] > 80) //filter color that are too alpha
        .map(color =>
          chroma(color[0], color[1], color[2]).css()
        )

      let average = chroma.average(pixel);
      this.pixelArray.push(average);
    }

    return this.pixelArray;

  },
  toPixel: function(canvas, array) {
    if (!array) array = this.pixelArray;

    let ctx = canvas.getContext('2d');
    let res = Math.floor(canvas.width / 42);
    ctx.clearRect(0, 0, canvas.width, canvas.height)


    for (let index = 0; index < this.list.length; index++) {
      let i = index % 42;
      let j = Math.floor(index / 42);
      ctx.beginPath();
      ctx.rect(i * res, j * res, res, res);
      let color = array[index];
      if (typeof color != "string") {
        color = color.css();
      }
      ctx.fillStyle = color;
      ctx.fill();
    }
    // });
  },
  getEmoji: function(color) {
    // console.log(color)
    if (typeof color != "string") color = color.css()
    let distances = []

    // this.loop((i, j) => {
    // if (j * 42 + i >= this.pixelArray.length) { return }

    for (let i = 0; i < this.pixelArray.length; i++) {
      distances.push(chroma.distance(color, this.pixelArray[i]))
      // distances.push(chroma.deltaE(color, this.pixelArray[i]))
    }
    // });

    let index = distances.indexOf(Math.min(...distances))


    // return this.list[index]
    return index

  }

}