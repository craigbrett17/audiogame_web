import { Key } from 'ts-keycode-enum';

document.getElementById("app-area").onkeydown = (ev => {
  const outputElement = document.getElementById("screen-output")
  switch (ev.which) {
      case Key.UpArrow:
        outputElement.innerText = "You pressed the up arrow";
        break;
      case Key.DownArrow:
        outputElement.innerText = "You pressed the down arrow";
        break;
      case Key.LeftArrow:
        outputElement.innerText = "You pressed the left arrow";
        break;
      case Key.RightArrow:
        outputElement.innerText = "You pressed the right arrow";
        break;
      default:
        outputElement.innerText = "You pressed some other random key";
        break;
  }
})