class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

class UI {
    addBookToList(book){
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

    showAlert(msg, className){
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

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearInput(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }
}

// Local Storage class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(book => {
            const ui = new UI;
            ui.addBookToList(book)
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded',Store.displayBooks())

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

        // add to local storage
        Store.addBook(book)
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

    // Remove from localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show msg
    ui.showAlert('Book removed', 'success')

    e.preventDefault();
})