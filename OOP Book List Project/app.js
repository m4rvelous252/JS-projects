// Book constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI constructor
function UI(){}

UI.prototype.addBookToList = function(book){
    const list = document.getElementById('book-list');
    // create tr element
    const row = document.createElement('tr');
    // insert cols
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class='delete'>X</a></td>
    `;
    list.appendChild(row)
}

// Show Alert
UI.prototype.showAlert = function(msg, className){
    //create div
    const div = document.createElement('div');
    // add class
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(msg));
    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);
    // Timeout after 3 seconds
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000)
}
// Delete Book
UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}

// Clear Input
UI.prototype.clearInput = function(){
    document.getElementById('title').value='';
    document.getElementById('author').value='';
    document.getElementById('isbn').value='';
}

// Event Listeners
document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //make a book
    const book = new Book(title, author, isbn);

    // UI object
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === ''){
        // Error Alert
        ui.showAlert('Please fill in all fields','error')
    }else {
        // Add book to list
        ui.addBookToList(book);

        // show success
        ui.showAlert('Book Added', 'success')

        // clear input
        ui.clearInput()
    }

    e.preventDefault();
})

// Delete listener
document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI;
    ui.deleteBook(e.target);

    // show msg
    ui.showAlert('Book removed', 'success')

    e.preventDefault();
})