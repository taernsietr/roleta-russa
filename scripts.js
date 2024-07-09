const memberData = [
  { name: "André", cases: [] },
  { name: "Dani", cases: [] },
  { name: "Gabriela", cases: [] },
  { name: "Jéssica", cases: [] },
  { name: "João", cases: [] },
  { name: "Max", cases: [] },
  { name: "Paloma", cases: [] },
  { name: "Sandy", cases: [] },
  { name: "Tainá", cases: [] },
  { name: "Tatiana", cases: [] },
  { name: "Thuany", cases: [] }
]

/**
  * Parses a member object into a HTML Member Component, appending it directly.
  */
function create_member_component(member) {
  let component = document.createElement("div");
  component.setAttribute("id", `${member.name}-line`);
  component.setAttribute("class", "member");

  let span = document.createElement("span");
  span.innerHTML = member.name;
  span.setAttribute("id", `${member.name}-name`);
  span.setAttribute("class", "member-name");

  let caseList = document.createElement("div");
  caseList.setAttribute("id", `${member.name}-caselist`);
  caseList.setAttribute("class", "case-list-container");


  let toggleWrapper = document.createElement("div");
  toggleWrapper.setAttribute("class", "toggleWrapper");
  let sliderWrapper = document.createElement("label");
  sliderWrapper.setAttribute("class", "slider-wrapper");
  let inputSlider= document.createElement("span");
  inputSlider.setAttribute("class", "toggle-slider");
  let input = document.createElement("input");
  input.setAttribute("id", `${member.name}-enable`);
  input.setAttribute("type", "checkbox");
  input.setAttribute("checked", true);
  input.setAttribute("class", "member-toggle");
  sliderWrapper.appendChild(input);
  sliderWrapper.appendChild(inputSlider);
  toggleWrapper.appendChild(sliderWrapper);

  component.appendChild(span);
  component.appendChild(caseList);
  component.appendChild(toggleWrapper);
  return component
}

/**
  * Creates an element displaying assigned cases, if any. Changes the style of
  * the span sibling to make room for case numbers.
  */
function add_assigned_cases(member) {
  let target = document.getElementById(`${member.name}-caselist`)
  let name = document.getElementById(`${member.name}-name`);

  if (!cumulativeCases) {
    target.innerHTML = '';
  }

  name.setAttribute("class", `${name.getAttribute("class")} assigned`)
  member.cases.forEach((each) => {
    let line = document.createElement("span");
    line.setAttribute("class", "assigned-case");
    line.innerHTML = each;
    target.appendChild(line);
  });
}

/**
  * shamelessly copied from 
  * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  * Shuffles an array in-place; used to randomize member ordering (hence allowing for distributing cases)
 */
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

/**
  * Loads member data from the static json. This function will create the relevant initial 
  * components.
  */
function load_data(memberData) {
  memberData.forEach(element =>
    document
      .getElementById("members-section")
      .appendChild(create_member_component(element))
  );
}

/** 
  * Parses cases in the textarea and gets current enabled members
  * @returns (members, cases)
  */
function parse_state() {
  let cases;
  let members;

  try {
    cases = document.getElementsByTagName("textarea")[0];
    if (cases.value.length < 8 || cases.value === undefined)
      throw Error("O campo de casos parece estar vazio ou conter um valor inválido.");
    cases = cases
      .value
      .trim()
      .replaceAll(" ", "\n")
      .split("\n");

    // forgive me father for I have sinned
    members = Array
      .from(document.getElementsByClassName("member"))
      .filter((member) => member
        .childNodes[2]
        .childNodes[0]
        .childNodes[0]
        .checked
      )
      .map((div) => {
        return {
          name: div.childNodes[0].innerHTML,
          cases: []
        }
      });
    if (members.length < 2)
      throw Error("Pelo menos dois membros da equipe precisam estar selecionados");

    for (j = 0; j < 3; j++) {
      shuffle(members);
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
  return [members, cases]
}

/**
  * Tries to get the defined members and cases by calling parse_state(), then distributes
  * cases among enabled members.
  * @returns members, as an object array, containing populated 'cases'
  */
function distribute_cases() {
  let [members, cases] = parse_state();
  let i = 0;
  cases.forEach((each) => {
    members[i].cases.push(each);
    i = i < members.length - 1 ? i + 1 : 0;
  });
  members.forEach((each) => {
    add_assigned_cases(each);
  });
  console.log("Results: ", members);
}

function toggle_cumulative_cases() {
  let button = document.getElementById("toggle-cumulative-cases-button");

  if (cumulativeCases) {
    button.InnerHTML = "Acumular Casos";
    button.removeAttribute("class");
  } else {
    button.InnerHTML = "Acumulando Casos";
    button.setAttribute("class", "cumulative-cases-on");
  }
  cumulativeCases = !cumulativeCases;
}

