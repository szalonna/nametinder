import "./styles.css";
import { fitText } from "./fittext";
import firebase from "./firebase";
import cuid from "cuid";

var database = firebase.database();

let id = window.location.hash;
const LS_UID_KEY = "ntd-uid";

function select() {
  if (id.length > 0) {
    return swiper("male");
  }

  document.getElementById("app").innerHTML = `
  <div id="title">Select gender</div>
  <div id="select-male" class="button">Male</div>
  <div id="select-female" class="button">Female</div>
  `;

  const title = document.getElementById("title");
  fitText(title);

  const male = document.getElementById("select-male");
  // const female = document.getElementById("select-female");

  male.addEventListener("click", () => {
    swiper("male");
  });
}

function swiper(gender) {
  if (id.length === 0) {
    id = cuid();
    window.location.hash = `#${id}`;
  }
  let userId = localStorage.getItem(LS_UID_KEY);
  if (!!userId) {
    userId = cuid();
    localStorage.setItem(LS_UID_KEY);
  }

  const names = require("./ffi.txt");
  const namesArray = names.split("\n");

  document.getElementById("app").innerHTML = `
  ${gender}
  `;
}

select();

// swiper("male");
