import fs from "fs";
import "regenerator-runtime/runtime";
import "./styles.css";
import { fitText } from "./fittext";
import {
  addUser,
  createSubtinder,
  getResults,
  nameNah,
  nameOk,
  onNameListChange,
  subtinderExists,
  userExists
} from "./db";
import cuid from "cuid";

let id = window.location.hash.replace("#", "");
const LS_UID_KEY = "uid";
const appRoot = document.getElementById("app");
let alreadySeen = [];

function select() {
  if (id.length > 0) {
    return swiper("male");
  }

  appRoot.innerHTML = `
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
  function getRandomId(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  function getRandomName(list, blacklist) {
    document.getElementById("progress").style.width = `${
      (100 * blacklist.length) / list.length
    }%`;

    if (list.length === blacklist.length) {
      return false;
    }
    let name = "";
    do {
      name = list[getRandomId(list)];
    } while (blacklist.includes(name));

    return name;
  }

  if (id.length === 0) {
    id = cuid();
    window.location.hash = `#${id}`;
  }

  if (!(await subtinderExists(id))) {
    createSubtinder(id, gender);
  }

  let userId = localStorage.getItem(LS_UID_KEY);
  if (!userId) {
    userId = cuid();
    localStorage.setItem(LS_UID_KEY, userId);
  }
  if (!(await userExists(id, userId))) {
    await addUser(id, userId);
  }

  const names = fs.readFileSync("./src/ffi.txt", "utf8");
  const namesArray = names.split("\r\n");

  appRoot.innerHTML = `
    <div id="progress"></div>
    <div id="results-button">Show results</div>
    <div id="name"></div>
    <div id="ok" class="button">Ok</div>
    <div id="nah" class="button">Nah</div>
  `;

  const ok = document.getElementById("ok");
  const nah = document.getElementById("nah");

  let name = "";

  ok.addEventListener("click", () => {
    nameOk(id, userId, name);
  });

  nah.addEventListener("click", () => {
    nameNah(id, userId, name);
  });

  const nameRoot = document.getElementById("name");
  const displayName = () => {
    name = getRandomName(namesArray, alreadySeen);
    if (name === false) {
      appRoot.innerHTML = "You saw all the names";
      fitText(appRoot);
    } else {
      nameRoot.innerHTML = `${name}`;
      fitText(nameRoot);
    }
  };

  onNameListChange(id, userId, (val) => {
    alreadySeen = [
      ...Object.values(val.ok || {}),
      ...Object.values(val.nah || {})
    ];
    displayName();
  });

  document
    .getElementById("results-button")
    .addEventListener("click", async () => {
      const results = await getResults(id);

      const modal = document.createElement("div");
      modal.id = "results-modal";
      modal.innerHTML = `
    <div>
      <h1>Results</h1>
      <ul id="result-names">
      ${
        Array.isArray(results)
          ? results.map((name) => `<li>${name}</li>`).join("")
          : "No matches"
      }
      </ul>
      <div id="close">Close</div>
    </div>`;
      appRoot.appendChild(modal);

      document.getElementById("close").addEventListener("click", () => {
        appRoot.removeChild(modal);
      });
    });
}

select();
