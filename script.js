const btnAll = document.getElementById("all");
const btnOpen = document.getElementById("open");
const btnDone = document.getElementById("done");

const btnRemove = document.getElementById("remove-button");

const btnAdd = document.getElementById("add-button");
const fieldAdd = document.getElementById("add-field");

// todos checkboxes
const ulElement = document.getElementById("list");

const savedState = localStorage.getItem("state");
let state = {
  filter: "all",
  todos: [
    {
      id: "1",
      description: "Learn HTML",
      done: false,
    },
    {
      id: "2",
      description: "Learn CSS",
      done: true,
    },
    {
      id: "3",
      description: "Learn Javascript",
      done: true,
    },
  ],
};

if (savedState !== null) {
  state = JSON.parse(savedState);
}

//Render function
function render() {
  localStorage.setItem("savedState", JSON.stringify(state));

  ulElement.innerHTML = "";

  const filteredTodos = state.todos.filter((task) => {
    if (state.filter === "all") {
      return true;
    } else if (state.filter === "open") {
      return !task.done;
    } else if (state.filter === "done") {
      return task.done;
    }
  });

  filteredTodos.forEach((task) => {
    const liElement = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done === true;

    const textElement = document.createTextNode(task.description);

    liElement.append(checkbox);
    liElement.append(textElement);
    ulElement.append(liElement);

    checkbox.addEventListener("change", (event) => {
      task.done = event.target.checked;
      render();

      //remove Event
      btnRemove.addEventListener("click", function () {
        // const stateDone = task.done;
        if (task.done === true) {
          task.done.innerText = "";
          render();
        }
      });
    });
  });
}

render();

// filter Event
btnAll.addEventListener("change", function () {
  state.filter = "all";
  render(); // render weil state verändert
});

btnOpen.addEventListener("change", function () {
  state.filter = "open";
  render(); // render weil state verändert
});

btnDone.addEventListener("change", function () {
  state.filter = "done";
  render(); // render weil state verändert
});

// add Event
fieldAdd.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputField = document.getElementById("add-field-input");
  const inputValue = inputField.value;
  const inputTrimmed = inputValue.trim();

  if (inputTrimmed.length >= 5) {
    const todoId = Date.now().toString();
    const todoItem = {
      id: todoId,
      description: inputTrimmed,
      done: false,
    };
    state.todos.push(todoItem);

    inputField.value = "";
  } else {
    alert("Only todos with 5 or more characters");
  }

  render();
});
