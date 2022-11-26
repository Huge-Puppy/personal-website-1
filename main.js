// print speed in letters per second
let printSpeed = 15;
// size of h1 letters in em
let letterWidth = 0.99;
let h1LetterHeight = 2.0;

// at a rate of printSpeed, move cursor to the right by one letter width
function moveCursor(el, count, start, width, noblink, startTop) {
  if (count == 0) {
    return;
  }
  if (count == 0 && noblink === undefined) {
    el.classList.add("blinker");
    return;
  }
  var currLeft = parseFloat(start.slice(0, start.length - 2));
  var newLeft = currLeft + width;
  let formattedLeft = `${newLeft}em`;
  el.style.left = formattedLeft;
  setTimeout(
    () => moveCursor(el, count - 1, formattedLeft, width, undefined, startTop),
    1000 / printSpeed,
    noblink
  );
}

// go down a line and to the start
function cursorReturn(el, startLeft, startTop, height) {
  el.style.left = startLeft;
  var currTop = parseFloat(startTop.slice(0, startTop.length - 2));
  var newTop = currTop + height;
  let formattedTop = `${newTop}em`;
  el.style.top = formattedTop;
  return formattedTop;
}

// at a rate of printSpeed, add letters to the element
function printText(text, el) {
  if (text == "") {
    return;
  }
  el.innerHTML += text.slice(0, 1);
  setTimeout(
    () => printText(text.slice(1, text.length), el),
    1000 / printSpeed
  );
}

function animateLine(text, textEl, cursorEl, startLeft, startTop) {
  printText(text, textEl);
  moveCursor(cursorEl, text.length, startLeft, letterWidth, undefined, startTop);
  return (1000 / printSpeed) * text.length;
}

function lineReturn(container, response) {
  let newLine = document.createElement("p");
  newLine.classList.add("headingType");
  if (response) {
    newLine.innerHTML = "> ";
  }
  container.appendChild(newLine);
  return newLine;
}

function createNewLine(container, cursor, startLeft, startTop, height) {
  let newElement = lineReturn(container, true);
  cursorReturn(cursor, startLeft, startTop, height);
  return newElement;
}

async function requestAnswer(question) {
  const result = await fetch(
    "http://localhost:54321/functions/v1/ai-response",
    // "https://jyyhfyrnykdencwlwcus.functions.supabase.co/ai-response",
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs",
        // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5eWhmeXJueWtkZW5jd2x3Y3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2MjAwODAsImV4cCI6MTk4NDE5NjA4MH0.60YINNo4_tUzfrf7BgzWLMMs_v92vpT4UBJLHQmQ_Tk",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
      method: "POST",
    }
  );
  let data = await result.json();
  return data.choices[0].text;
}

function getAnswer(container, cursor, startLeft, startTop, height) {
  let line = createNewLine(container, cursor, startLeft, startTop, height);
  cursor.classList.add("blinker");
  // add listener that adds text as they type
  var timerId;
  container.addEventListener(
    "keydown",
    (getKeystrokes = async (event) => {
      console.log('keydown');
      if (event.code == "Enter") {
        // destroy listener;
        container.removeEventListener("keydown", getKeystrokes);
        // TODO initiate loading sequence
        // send request to api to get response
        let result = await requestAnswer(line.innerHTML.slice(5));
        console.log(line.innerHTML.slice(5))
        // create a new line
        let newLine = lineReturn(body, false);
        var currTop = parseFloat(startTop.slice(0, startTop.length - 2));
        var newTop = currTop + height;
        let formattedTop = `${newTop}em`;
        newTop = cursorReturn(cursor, "0.5em", formattedTop, height);
        // print response on the line
        let delay = animateLine(
          result,
          newLine,
          cursor,
          "0.5em",
          formattedTop,
        );
        // TODO after printing call getAnswer
        // newTop = parseFloat(newTop.slice(0, newTop.length-2)) + (letterWidth*line.innerHTML.length-6) + "em";
        setTimeout(() => {
          getAnswer(container, cursor, "2.5em", newTop, height);
        }, delay + 500);
        return;
      }
      if (
        event.code == "MetaLeft" ||
        event.code == "MetaRight" ||
        event.code == "AltRight" ||
        event.code == "AltLeft" ||
        event.code == "ControlLeft" ||
        event.code == "Tab" ||
        event.code == "ShiftLeft" ||
        event.code == "ShiftRight" ||
        event.code == "Escape" ||
        event.code == "CapsLock"
      ) {
        return;
      }
      if (event.code == "Backspace") {
        if (line.innerHTML.length <= 5) return;
        var newLeft =
          parseFloat(startLeft.slice(0, startLeft.length - 2)) +
          (letterWidth * line.innerHTML.length - 5);
        moveCursor(cursor, 1, newLeft + "em", -1 * letterWidth, true, startTop);
        line.innerHTML = line.innerHTML.slice(0, line.innerHTML.length - 1);
        return;
      }
      window.typeEvent = event;
      // remove blink from cursor class
      cursor.classList.remove("blinker");
      // add timer that adds it again if typing stops, debounced.
      if (timerId) {
        clearTimeout(timerId);
        cursor.classList.remove("blinker");
      }
      timerId = setTimeout(() => {
        cursor.classList.add("blinker");
      }, 500);
      // TODO wrap cursor when necessary
      // move cursor one space
      // get new startleft value
      var newLeft =
        parseFloat(startLeft.slice(0, startLeft.length - 2)) +
        (letterWidth * line.innerHTML.length - 5);
      moveCursor(cursor, 1, newLeft + "em", letterWidth, true, startTop);
      line.innerHTML += event.key;
    })
  );
}

// _____ EXECUTION ______ //
let body = document.getElementById("body");
let currLine = lineReturn(body);
let cursor = document.getElementById("cursor");

let delay = animateLine("Hi, I'm Jared Lambert.", currLine, cursor, "0.5em", "0em");
setTimeout(() => getAnswer(body, cursor, "2.5em", "1.6em", 3.5), delay + 500);
// _____ EXECUTION ______ //
