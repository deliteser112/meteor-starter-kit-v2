export default function resizeBase64Img(event, resize_width) {
  return new Promise((resolve, reject) => {
    var img = new Image(); //create a image
    img.src = event.result; //result is base64-encoded Data URI
    img.name = event.name; //set name (optional)
    img.size = event.size; //set size (optional)
    img.onload = function (el) {
      var elem = document.createElement('canvas'); //create a canvas

      //scale the image to 600 (width) and keep aspect ratio
      var scaleFactor = resize_width / el.target.width;
      elem.width = resize_width;
      elem.height = el.target.height * scaleFactor;

      //draw in canvas
      var ctx = elem.getContext('2d');
      ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

      //get the base64-encoded Data URI from the resize image
      var srcEncoded = ctx.canvas.toDataURL('image/png', 1);
      resolve(srcEncoded);
    };
  });
}