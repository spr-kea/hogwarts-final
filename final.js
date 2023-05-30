"use strict";

window.addEventListener("DOMContentLoaded", begin);


let alltheStudents = [];


let theExpelledOnes = [];


let interval;

const settings = {
  filter: "all",
  sortBy: "house",
  dirSort: "asc",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  image: "",
  house: "",
  stars: false,
  winner: false,
  expelled: false,
};

// ---------------------------------SEARCH------------------------------
function srchStudents(student) {
  const searchInput = document.querySelector("#searchInput");
  const searchQuery = searchInput.value.toLowerCase();

  console.log(searchQuery);

  const matchingStudents = alltheStudents.filter(function (student) {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery);
  });

  // Display the matching students
  showList(matchingStudents);
}


function hackTheSystem() {
  let hacked = true;
  console.log(hacked);
  const studentExists = alltheStudents.some(
    (student) =>
      student.firstName === "Sebastian" && student.lastName === "Pedersen"
  );

  if (studentExists === true) {
    console.log("You have already been added to the student list.");
  } else {
    document.querySelector("body").style.backgroundColor = "var(--highlight)";

    const moi = {
      firstName: "Sebastian",
      lastName: "Robles",
      middleName: "Pedersen",
      nickName: "",
      gender: "Boy",
      image: "images.png",
      house: "Slytherin",
      bloodStatus: "Pure Blood",
      stars: false,
      winner: false,
      expelled: false,
    };
    alltheStudents.push(moi);

    console.log(
      "You have been added to the student list and the system has been hacked!"
    );
  }

  rdmBloodStatus();

  srtAllOccur();

  createList();
}

function rdmBloodStatus() {
  alltheStudents.forEach(function (student) {
    if (student.bloodStatus === "Pure Blood") {
      const bloodStatuses = ["Pure Blood", "Half Blood", "Muggle Blood"];
      const rdmBloodStatus =
        bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
      student.bloodStatus = rdmBloodStatus;
    } else {
      student.bloodStatus = "Pure Blood";
    }
  });
}

function registerBtn() {
  document.querySelectorAll("[data-action='filter']").forEach((each) => {
    each.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((each) => {
    each.addEventListener("click", selectSort);
  });

  const searchButton = document.querySelector("#searchButton");
  searchButton.addEventListener("click", srchStudents);

  document
    .querySelector(".hackButton")
    .addEventListener("click", hackTheSystem);
}

function srtAllOccur() {
  interval = setInterval(removeInq, 2000);
}

function removeInq() {
  alltheStudents.forEach(function (student) {
    if (student.stars === true) {
      student.stars = false;
      createList();
    }
  });
}

function begin() {
  registerBtn();
  loadJSON();
}


async function loadJSON() {
  let [studentData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((response) =>
      response.json()
    ),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((response) =>
      response.json()
    ),
  ]);
  prepareObjects(studentData, bloodData);
}


function prepareObjects(studentData, bloodData) {
  studentData.forEach((jsonObject) => {
    const student = Object.create(Student);

    student.house = jsonObject.house.trim().toLowerCase();
    student.house =
      student.house[0].toUpperCase() + student.house.slice(1).toLowerCase();




    student.gender = jsonObject.gender.trim().toLowerCase();
    student.gender =
      student.gender[0].toUpperCase() + student.gender.slice(1).toLowerCase();


    const text = jsonObject.fullname.trim().split(" ");

    student.firstName = text[0].trim().toLowerCase();
    student.firstName =
      student.firstName[0].toUpperCase() +
      student.firstName.slice(1).toLowerCase();

    student.lastName = text[text.length - 1].trim().toLowerCase();

    const lastNameParts = student.lastName.split("-");

    for (let i = 0; i < lastNameParts.length; i++) {
      lastNameParts[i] =
        lastNameParts[i][0].toUpperCase() +
        lastNameParts[i].slice(1).toLowerCase();
    }

    student.lastName = lastNameParts.join("-");


    if (text.length === 3) {
      if (text[1].startsWith('"')) {
        student.nickName = text[1].slice(1, -1);
      } else {
        student.middleName = text[1].trim().toLowerCase();
        student.middleName =
          student.middleName[0].toUpperCase() +
          student.middleName.slice(1).toLowerCase();
      }
    }


    if (student.lastName.includes("-")) {
      student.image = `images/${student.lastName
        .slice(student.lastName.indexOf("-") + 1)
        .toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    } else if (student.firstName === "Parvati") {
      student.image = "images/patil_parvati.png";
    } else if (student.firstName === "Padma") {
      student.image = "images/patil_padma.png";
    } else if (student.firstName === "Leanne") {
      student.image = "images/default.png";
    } else {
      student.image = `images/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    }


    let halfBlood = bloodData.half;
    let pureBlood = bloodData.pure;

    if (halfBlood.includes(student.lastName)) {
      student.bloodStatus = "Half Blood";
    } else if (pureBlood.includes(student.lastName)) {
      student.bloodStatus = "Pure Blood";
    } else {
      student.bloodStatus = "Muggle Blood";
    }


    alltheStudents.push(student);
  });

  showList(alltheStudents);
}
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  createList();
}

function filterList(filteredList) {
  if (settings.filterBy === "Expelled") {
    return theExpelledOnes;
  }

  return filteredList.filter(student => {
    if (settings.filterBy === "Hufflepuff") {
      return student.house === "Hufflepuff";
    } else if (settings.filterBy === "Slytherin") {
      return student.house === "Slytherin";
    } else if (settings.filterBy === "Gryffindor") {
      return student.house === "Gryffindor";
    } else if (settings.filterBy === "Ravenclaw") {
      return student.house === "Ravenclaw";
    } else {
      return true; // 
    }
  });
}


function selectSort(event) {
  const { sort, dirSortection } = event.target.dataset;

  const oldElement = document.querySelector(`[data-sort='${sort}']`);
  oldElement.classList.remove("sortAfter");

  event.target.classList.add("sortAfter");

  event.target.dataset.dirSortection = (dirSortection === "asc") ? "desc" : "asc";

  console.log(sort, dirSortection);

  setSort(sort, dirSortection);
}

function setSort(sortBy, dirSort) {
  settings.sortBy = sortBy;
  settings.dirSort = dirSort;
  createList();
}

function sortList(sortedList) {
  const direction = (settings.dirSort === "desc") ? -1 : 1;

  sortedList = sortedList.sort(genericSort);

  function genericSort(studentA, studentB) {
    return (studentA[settings.sortBy] < studentB[settings.sortBy]) ? -1 * direction : 1 * direction;
  }

  return sortedList;
}


function createPrefect(selectedStudent) {
  const allWinners = alltheStudents.filter((student) => student.winner);

  const samegenderPref = allWinners.filter(
    (student) =>
      student.gender === selectedStudent.gender &&
      student.house === selectedStudent.house
  );

  if (samegenderPref.length >= 1) {
    console.log("Max 1 prefect of each gender in each house");
    removeOther(samegenderPref[0]);
  }
  else {
    const oppositegenderwin = allWinners.filter(
      (student) =>
        student.gender !== selectedStudent.gender &&
        student.house === selectedStudent.house
    );
    if (oppositegenderwin.length >= 2) {
      console.log("Max 1 prefect of each gender in each house");
      removeOther(oppositegenderwin[0], selectedStudent);
    }
    else {
      makeWinner(selectedStudent);
    }
  }

  function removeOther(other) {
    document.querySelector("#remove_other").classList.remove("hidden");

    document
      .querySelector("#remove_other .close_button")
      .addEventListener("click", closeDialog);

    document
      .querySelector("#remove_other .remove_button")
      .addEventListener("click", removeStudent);

    document.querySelector(
      "#remove_aorb [data-field=otherwinner]"
    ).textContent = other.firstName;

    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hidden");
      document
        .querySelector("#remove_other .close_button")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_other .remove_button")
        .removeEventListener("click", removeStudent);
    }
   
    function removeStudent() {
      removeWinner(other);
      makeWinner(selectedStudent);
      createList();
      closeDialog();
    }
  }

  function removeWinner(winnerStudent) {
    winnerStudent.winner = false;
  }

  function makeWinner(loserStudent) {
 {}
    loserStudent.winner = true;
  }
}

function createList() {
  const currentList = filterList(alltheStudents);
  const sortedList = sortList(currentList);

  showList(sortedList);
}

function showList(student) {
  console.log(student);

  const totalStudents = alltheStudents.length;
  const gryffindorStudents = alltheStudents.filter(
    (student) => student.house === "Gryffindor"
  ).length;
  const hufflepuffStudents = alltheStudents.filter(
    (student) => student.house === "Hufflepuff"
  ).length;
  const ravenclawStudents = alltheStudents.filter(
    (student) => student.house === "Ravenclaw"
  ).length;
  const slytherinStudents = alltheStudents.filter(
    (student) => student.house === "Slytherin"
  ).length;
  const expelledStudentsLength = theExpelledOnes.length;

  const totalParagraph = document.querySelector("p.totalStudents");
  totalParagraph.textContent = `Enrolled students is: ${totalStudents}`;

  const gryffindorParagraph = document.querySelector(
    "p.gryfStudents"
  );
  gryffindorParagraph.textContent = `Gryffindor students is: ${gryffindorStudents}`;

  const hufflepuffParagraph = document.querySelector(
    "p.hufflepuffStudents"
  );
  hufflepuffParagraph.textContent = `Hufflepuff students: ${hufflepuffStudents}`;

  const ravenclawParagraph = document.querySelector(
    "p.ravenclawStudents"
  );
  ravenclawParagraph.textContent = `Ravenclaw students: ${ravenclawStudents}`;

  const slytherinParagraph = document.querySelector(
    "p.slythStudents"
  );
  slytherinParagraph.textContent = `Slytherin students: ${slytherinStudents}`;

  const expelledParagraph = document.querySelector(
    "p.expelledStudents"
  );
  expelledParagraph.textContent = `Expelled students is: ${expelledStudentsLength}`;

  const currentLength = student.length;
  const paragraph = document.querySelector("p.numberOfCurrentStudents");
  paragraph.textContent = `Current number of students is: ${currentLength}`;

  document.querySelector("#list tbody").innerHTML = "";

  student.forEach(displayStudent);
}

function displayPopup(student) {
  const popUp = document.querySelector("#popup");
  const popUpContent = document.querySelector("#popup");
  popUp.classList.remove("hidden");

  document.querySelector(".closePopUp").addEventListener("click", closePopUp);

  function closePopUp() {
    popUp.classList.add("hidden");
  }
  popUp.querySelector("[data-field=image]").src = student.image;
  popUp.querySelector("[data-field=firstName]").textContent = student.firstName;
  popUp.querySelector("[data-field=middleName]").textContent =
    student.middleName;
  popUp.querySelector("[data-field=nickName]").textContent = student.nickName;
  popUp.querySelector("[data-field=lastName]").textContent = student.lastName;
  popUp.querySelector("[data-field=house]").textContent = student.house;
  popUp.querySelector("[data-field=gender]").textContent = student.gender;
  popUp.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  popUp.querySelector("[data-field=expelled]").textContent = student.expelled;

  popUp.querySelector("[data-field=winner]").textContent = student.winner;

  if (student.winner === true) {
    popUp.querySelector("[data-field=winner]").textContent = "⌛";
  } else {
    popUp.querySelector("[data-field=winner]").textContent = "-";
  }


  popUp.querySelector("[data-field=stars]").textContent = student.stars;

  if (
    ((student.house === "slytherin" && student.bloodStatus !== "Half blood") ||
      student.bloodStatus === "Pure Blood") &&
    student.stars === true
  ) {
    popUp.querySelector("[data-field=stars]").textContent = "⚡";
  } else {
    popUp.querySelector("[data-field=stars]").textContent = "-";
  }

  popUp.querySelector(".expelStudent").addEventListener("click", expelstud);

  function expelstud() {
    if (student.firstName === "Sebastian" && student.lastName === "Robles") {
      console.log("Sebastian can't be expelled!");
    } else {
      let aStud = alltheStudents.splice(alltheStudents.indexOf(student), 1)[0];
      aStud.expelled = true;
      aStud.winner = false;
      aStud.stars = false;
      theExpelledOnes.push(aStud);
    }

    console.log(alltheStudents);
    console.log(theExpelledOnes);
    closePopUp();
    createList();
    popUp
      .querySelector(".expelStudent")
      .removeEventListener("click", expelstud);
  }

  if (student.expelled === true) {
    popUp.querySelector("[data-field=expelled]").textContent = "True";
    popUp
      .querySelector(".expelStudent")
      .removeEventListener("click", expelstud);
  } else {
    popUp.querySelector("[data-field=expelled]").textContent = "False";
  }
}

function displayStudent(student) {
  // CREATE CLONE
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);



  clone
    .querySelector(".student0")
    .addEventListener("click", () => displayPopup(student));
  clone
    .querySelector(".student1")
    .addEventListener("click", () => displayPopup(student));
  clone
    .querySelector(".student2")
    .addEventListener("click", () => displayPopup(student));
  clone
    .querySelector(".student3")
    .addEventListener("click", () => displayPopup(student));

  if (
    ((student.house === "slytherin" && student.bloodStatus !== "Half blood") ||
      student.bloodStatus === "Pure Blood") &&
    student.stars === true
  ) {
    clone.querySelector("[data-field=stars]").textContent = "⚡";
  } else {
    clone.querySelector("[data-field=stars]").textContent = "-";
  }

  clone
    .querySelector("[data-field=stars]")
    .addEventListener("click", toggleStars);

  function toggleStars() {
    if (
      ((student.house === "slytherin" &&
        student.bloodStatus !== "Half blood") ||
        student.bloodStatus === "Pure Blood") &&
      student.stars === true
    ) {
      student.stars = false;
    } else {
      student.stars = true;
    }
    createList();
  }

  if (student.winner === true) {
    clone.querySelector("[data-field=winner]").textContent = "⌛";
  } else {
    clone.querySelector("[data-field=winner]").textContent = "-";
  }

  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", toggleWinner);

  function toggleWinner() {
    if (student.winner === true) {
      student.winner = false;
    } else {
      createPrefect(student);
    }
    createList();
  }

  const imageTd = clone.querySelector('td[data-field="image"]');
  const imageElement = imageTd.querySelector("img");
  imageElement.src = student.image;



  clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  clone.querySelector("[data-field=house]").textContent = student.house;


  document.querySelector("#list tbody").appendChild(clone);
}