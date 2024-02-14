// DOM Elemente für JS
const btnAll = document.getElementById("all");
const btnOpen = document.getElementById("open");
const btnDone = document.getElementById("done");
const btnRemove = document.getElementById("remove-button");
const btnAdd = document.getElementById("add-button");
const fieldAdd = document.getElementById("add-field");
const ulElement = document.getElementById("list");

let state = {
  todos: [
    //Standard todos
    {
      id: "1",
      description: "Learn HAHA",
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
  filter: "all", // Standard ist all daneben noch /Open /Done
};

// Fetch
function refresh() {
  fetch("http://localhost:4730/todos")
    .then((response) => {
      if (!response.ok) {
        // wenn die API Antwort nicht .ok ist, wirf einen Error
        throw new Error("Fetch didn`t work");
      }
      return response.json(); // wenn die API Antwort .ok ist, lies auch den body und nicht nur den Status
    })
    .then((todo) => {
      // .then vom body (die einzelnen todos) werden zu todo
      state.todos = todo;
      render();
    });
}
refresh();

function render() {
  // "Tisch abräumen" = löscht eventuelle Elemente aus HTML
  ulElement.innerHTML = "";

  // Mit .filter() muss ich immer eine Boolean true/false returnen
  const filteredTodos = state.todos.filter((filterElement) => {
    if (state.filter === "open") {
      return !filterElement.done; // Offene toDos werden angezeigt - Wir geben true zurück für Todos, bei denen filterElement.done false ist (also nicht erledigt).
    } else if (state.filter === "done") {
      return filterElement.done; // Done toDos werden angeteigt - wir geben true zurück für Todos, bei denen filterElement.done true ist.
    } else if (state.filter === "all") {
      return true; // All toDos werden angezeigt - wir geben einfach true zurück, was bedeutet, dass alle Todos akzeptiert werden.
    }
  });

  // Dadurch sind auch die RadioButton im UI aktiv, welche im state ausgewählt sind
  if (state.filter === "open") {
    btnOpen.checked = true;
  }
  if (state.filter === "done") {
    btnDone.checked = true;
  }
  if (state.filter === "all") {
    btnAll.checked = true;
  }

  // nur die gefilterten sollen verwendet werden. Daher filteredTodos.forEach
  filteredTodos.forEach((task) => {
    // neues Listen Element erstellen
    const liElement = document.createElement("li");

    // checkboy erstellen und sobald done .checked ist, wird auf true gesetzt
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done === true;

    // erstellt ein Text Element welches der description im Object zugeordnet wird
    const textElement = document.createTextNode(task.description);

    // Ordnet die neuen Elemente ihrem Platz im DOM zu
    liElement.append(checkbox);
    liElement.append(textElement);
    ulElement.append(liElement);

    // Ändern des Status einer Checkbox (markieren/entmarkieren eines Todos)
    checkbox.addEventListener("change", (event) => {
      const checkboxChecked = event.target.checked;
      let id = task.id;

      fetch(`http://localhost:4730/todos/${id}`, {
        method: "PATCH", // PATCH anstatt PUT es ansonsten auch die description überschreibt, wenn ich diese nicht mit schicke
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ done: checkboxChecked }), // schickt mit, dass die gecheckte Checkbox den Status done: true bedeutet
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fetch didn't work!");
          }
          return response.json();
        })
        .then((changeTodoItem) => {
          refresh();
        });
      render(); // synchronisiert sofort den Status mit der UI. Das render() aus dem refresh() folgt erst nach dem .then request
    });
  });
}
render(); // Initial-Rendern der Todos

// filter Event für Filter All
btnAll.addEventListener("change", function () {
  state.filter = "all";
  render(); // render weil state verändert
});

// filter Event für Filter Open
btnOpen.addEventListener("change", function () {
  state.filter = "open";
  render(); // render weil state verändert
});

// filter Event für Filter Done
btnDone.addEventListener("change", function () {
  state.filter = "done";
  render(); // render weil state verändert
});

// add Event
fieldAdd.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputField = document.getElementById("add-field-input");
  const inputValue = inputField.value; // Den Value des input fields ansprechen
  const inputTrimmed = inputValue.trim(); // Leerzeichen am Ende der Eingabe entfernen

  // duplikate entfernen innerhalb vom add Event
  if (
    state.todos.some(
      (todo) => todo.description.toUpperCase() === inputTrimmed.toUpperCase() //to.UpperCase damit beides gleich ist = klein und groß schreibung wird ignoriert
    )
  ) {
    //wird überprüft, ob es bereits ein Todo mit der gleichen Beschreibung (description) wie die eingegebene Beschreibung (inputTrimmed) gibt.
    alert("it's duplicated");
    return; // Eingabe wird nicht übernommen
  }

  if (inputTrimmed.length >= 5) {
    // Überprüfung ob Eingabe min. 5 Chars hat
    const todoItem = {
      description: inputTrimmed, // Eingabe Text zuordnen
      done: false, // Standardmäßig ist das neue Todo nicht erledigt
    };

    fetch("http://localhost:4730/todos", {
      // neuen Response hinzufügen
      method: "POST", // Infos die ich im body mitschicke
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(todoItem), // todoItem wird lokal ins backEnd geschickt
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetch didn't work!");
        }
        return response.json();
      })
      .then((newTodoItem) => {
        // neues todo ikln. id
        refresh();
      });

    inputField.value = ""; // Eingabe im Input filed löschen
  } else {
    alert("Only todos with 5 or more characters");
  }
});

// remove Event
btnRemove.addEventListener("click", function () {
  state.todos.forEach((task) => {
    if (task.done === true) {
      fetch(`http://localhost:4730/todos/${task.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fetch didn't work!");
          }
          return response.json();
        })
        .then((changeTodoItem) => {
          refresh();
        })
        .catch((error) => {
          console.error("Fehler beim Entfernen der Aufgabe:", error);
        });
    }
  });
});

render(); // Neu rendern der Liste, um das hinzugefügte Todo anzuzeigen
