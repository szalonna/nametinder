import "./styles.css";
import { fitText } from "./fittext";
import { addUser, createSubtinder, userExists } from "./db";
import cuid from "cuid";

// var database = firebase.database();

let id = window.location.hash.replace("#", "");
const LS_UID_KEY = "uid";

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

async function swiper(gender) {
  if (id.length === 0) {
    id = cuid();
    window.location.hash = `#${id}`;
    await createSubtinder(id, gender);
  }
  let userId = localStorage.getItem(LS_UID_KEY);
  console.log({ userId });
  if (!!userId) {
    userId = cuid();
    localStorage.setItem(LS_UID_KEY, userId);
  }
  const exists = await userExists(id, userId);
  console.log(exists);
  if (!exists) {
    await addUser(id, userId);
  }

  const names = require("./ffi.txt");
  const namesArray = names.split("\n");

  document.getElementById("app").innerHTML = `
  ${gender}
  `;
}

select();

// swiper("male");
