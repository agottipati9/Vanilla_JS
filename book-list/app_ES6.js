// Represents a Book
class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// Database for storing books
class Store{
  // Gets books from database
  static getBooks(){
    let books;

    if(localStorage.getItem('books') === null){
      books = [];
    }
    else{
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  // Displays books in the ui
  static displayBooks(){
    let books = Store.getBooks();
    const ui = new UI();

    // Add all books to list
    books.forEach(function(book){
      ui.addBookToLib(book);
    });
  }

  // Adds a book to database
  static addBook(book){
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Removes a book from database
  static removeBook(isbn){
    let books = Store.getBooks();

    // Add all books to list
    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Interacts with the UI
class UI {
  // Add a book to the library
  addBookToLib(book){
    const lib = document.getElementById('book-list');

    // create tr element
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X<a></td>
    `;

    lib.appendChild(row);
  }

  // Clears input fields
  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  // Displays alert at the top of UI
  showAlert(msg, className){
    // Create div
    const div = document.createElement('div');

    // Add classes
    div.className = `alert ${className}`;
    
    // Add text
    div.appendChild(document.createTextNode(msg));

    // Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    // Insert alert
    container.insertBefore(div, form);
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  // Removes a book from UI
  deleteBook(target){
    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
  }
}

// DOM Load Event Listener
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Submit Event Listener
document.getElementById('book-form').addEventListener('submit', function(e){
  // Instantiate UI
  const ui = new UI();

  // Grab information 
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // Do not accept blank fields
  if (title === '' || author === '' || isbn === ''){
    ui.showAlert('Please enter in the required information.', 'error')
    return;
  }

  // Add book to libary
  const book = new Book(title, author, isbn);
  ui.addBookToLib(book);

  // Add to local storage
  Store.addBook(book);

  // Show success
  ui.showAlert('Book has been added to library.', 'success');

  // Clear fields
  ui.clearFields();
  e.preventDefault();
});

// Remove Book Event Listener
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();

  // delete book from UI
  ui.deleteBook(e.target);

  // remove book from DB
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show success
  ui.showAlert('Book has been removed from library.', 'success');
  e.preventDefault();
});