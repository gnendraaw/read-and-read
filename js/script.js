const books = [];
const RENDER_EVENT = "render-event";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const toReadListElement = document.getElementById("to-read");
  toReadListElement.innerHTML = "";

  const doneReadingListElement = document.getElementById("done-reading");
  doneReadingListElement.innerHTML = "";

  for (book of books) {
    const bookElement = makeBook(book);
    if (book.isCompleted) {
      doneReadingListElement.append(bookElement);
    } else {
      toReadListElement.append(bookElement);
    }
  }
});

function addBook() {
  const titleValue = document.getElementById("title").value;
  const authorValue = document.getElementById("author").value;
  const yearValue = document.getElementById("year").value;
  const isCompleted = false;
  const id = generateId();

  const bookObject = generateBookObject(
    id,
    titleValue,
    authorValue,
    Number(yearValue),
    isCompleted
  );

  books.unshift(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  console.log(books);
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function makeBook(bookObject) {
  const titleElement = document.createElement("h3");
  titleElement.innerText = bookObject.title;
  titleElement.classList.add("title");

  const authorElement = document.createElement("p");
  authorElement.innerText = bookObject.author;
  authorElement.classList.add("author");

  const yearElement = document.createElement("p");
  yearElement.innerText = bookObject.year;
  yearElement.classList.add("year");

  const bookContentElement = document.createElement("div");
  bookContentElement.classList.add("book-content");
  bookContentElement.append(titleElement, authorElement, yearElement);

  const bookActionsElement = document.createElement("div");
  bookActionsElement.classList.add("book-actions");

  const removeButtonElement = makeButton(
    "remove",
    "Remove",
    () => removeBookFromList(bookObject.id)
  );

  if (bookObject.isCompleted) {
    const unreadButtonElement = makeButton("unread", "Mark as unread", () =>
      makeBookUnreadFromList(bookObject.id)
    );

    bookActionsElement.append(unreadButtonElement);
  } else {
    const readButtonElement = makeButton("read", "Mark as read", () =>
      makeBookReadFromList(bookObject.id)
    );

    bookActionsElement.append(readButtonElement);
  }

  bookActionsElement.append(removeButtonElement);

  const bookCardElement = document.createElement("div");
  bookCardElement.classList.add("book-card");
  bookCardElement.setAttribute("id", `book-${bookObject.id}`);

  bookCardElement.append(bookContentElement, bookActionsElement);

  return bookCardElement;
}

function makeBookReadFromList(id) {
  const book = findBookById(id);

  if (book == null) return;

  book.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  console.log(books);
}

function makeBookUnreadFromList(id) {
  const book = findBookById(id);

  if (book == null) return;

  book.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  console.log(books);
}

function removeBookFromList(id) {
  const bookIndex = findBookIndexById(id);

  if (book === -1) return;

  books.splice(bookIndex, 1);
  
  document.dispatchEvent(new Event(RENDER_EVENT));

  console.log(books);
}

function findBookIndexById(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
}

function findBookById(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

function makeButton(type, description, callback) {
  const buttonElement = document.createElement("button");
  buttonElement.innerText = description;
  buttonElement.classList.add("btn", `btn-${type}`);
  buttonElement.addEventListener("click", function () {
    callback();
  });

  return buttonElement;
}
