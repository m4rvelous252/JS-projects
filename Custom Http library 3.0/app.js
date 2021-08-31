const http = new EasyHTTP;

// get users
// http.get('https://jsonplaceholder.typicode.com/users')
// .then(data => console.log(data))
// .catch(err => console.log(err))

// User data
const data = {
    name: 'Annie',
    username: 'hiannt',
    email: 'hiannt.98@gmail.com'
}

// create a user
// http.post('https://jsonplaceholder.typicode.com/users',data)
// .then(data => console.log(data))
// .catch(err => console.log(err))

// update user
// http.put('https://jsonplaceholder.typicode.com/users/2',data)
// .then(data => console.log(data))
// .catch(err => console.log(err))

//  delete user
http.delete('https://jsonplaceholder.typicode.com/users/2')
.then(data => console.log(data))
.catch(err => console.log(err))