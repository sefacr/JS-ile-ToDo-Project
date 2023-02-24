//Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");
eventListeners();

function eventListeners(e) {
  //Tüm event listenerlar
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}
function clearAllTodos() {
  if (confirm("Tümünü silmek istediğinizden emin misiniz ? ")) {
    //Arayğzden Todoları temizleme
    //todoList.innerHTML = ""; //Yavaş kalıyor
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    //console.log(todoList.firstElementChild);

    localStorage.removeItem("todos");
  }
}
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase(); //hepsini küçük harf yapmak için aratırken algılasın diye
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      //indexof geçiyorsa 1 geçmiyorsa -1 sonucunu dönüyordu içinde
      //BULAMADI
      listItem.setAttribute("style", "display : none !important"); // css öz ekliyoruz sayfada olacak ama görünmeyecek
    } else {
      //ünlem import css öz. bootstrapten kaynaklı kullanamadığımız öz kullanacağım demek ders:126
      listItem.setAttribute("style", "display : block");
    }
  });
}
function deleteTodo(e) {
  //console.log(e.target); //nereye bastığımızı veriyor
  if (e.target.className === "fa fa-remove") {
    //console.log("silme işlemi");
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "başarıyla silindi...");
  }
}
function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); //Arrayden değeri silme
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}
function addTodoControl() {
  let todos = getTodosFromStorage();
  x = [];
  todos.forEach(function (todo) {
    console.log(todo);
    x.push(todo);
  });
}
function addTodo(e) {
  const newTodo = todoInput.value.trim();
  //trim baş ve sondaki gereksiz boşlukları almaz
  addTodoControl();
  if (newTodo === "") {
    showAlert("danger", "Lütfen bir todo girin");
  } else if (newTodo === x[x.indexOf(newTodo)]) {
    showAlert("warning", "Farklı bir todo girin");
    todoInput.value = "";
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", newTodo + " Başarıyla Eklendi");
  }
  e.preventDefault();
}
function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function showAlert(type, message) {
  //bunların yerine toaster diye bir şey var ekran kaydırmıyor daha iyi
  /*
  <div class="alert alert-danger" role="alert">
    This is a warning alert—check it out!
  </div>
  */
  const alert = document.createElement("div");
  alert.className = "alert alert-" + type; //${type}
  alert.textContent = message;
  firstCardBody.appendChild(alert);
  // setTimeOut
  setTimeout(function () {
    alert.remove();
  }, 1000);
}
function addTodoToUI(newTodo) {
  //aldığı stringi list item olarak UI'ya (arayüze) ekleyecek
  /*Dinamik olarak burada bu yapıyı oluşturacağız
    <!-- <li class="list-group-item d-flex justify-content-between">
    Todo 1
    <a href = "#" class ="delete-item">
        <i class = "fa fa-remove"></i>
    </a>

    </li>
    */
  //list item oluşturma
  const listItem = document.createElement("li");
  // Link oluşturma
  const link = document.createElement("a");
  link.className = "delete-item";
  link.href = "#";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  //Text Node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));

  listItem.appendChild(link);

  listItem.className = "list-group-item d-flex justify-content-between";
  //Todo List'e List Item Ekleme
  todoList.appendChild(listItem);
  // ekleme yaptıktan sonra yazı kalmasın
  todoInput.value = "";
}
