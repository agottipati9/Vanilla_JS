// Book Constructor
function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.addBooktoLib = function(book){
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

UI.prototype.clearFields = function(){
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

UI.prototype.showAlert = function(msg, className){
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

// Delete Book
UI.prototype.deleteBook = function(target){
  if(target.className === 'delete'){
    target.parentElement.parentElement.remove();
  }
}

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
  }
  else{
    // Add book to libary
    const book = new Book(title, author, isbn);
    ui.addBooktoLib(book);

    // Show success
    ui.showAlert('Book has been added to library.', 'success');

    // Clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

// Remove Book Event Listener
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);

  // show success
  ui.showAlert('Book has been removed from library.', 'success');
  e.preventDefault();
});