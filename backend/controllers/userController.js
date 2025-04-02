

//get all users
const getUsers = (req, res) => {
    res.send('all the users')
}


//get a single user
const getUser = (req, res) => {
    res.send('user')
}

//add a new user
const createUser = (req, res) => {
    res.send('user added successfully')
}

//delete a user
const deleteUser = (req, res) => {
    res.send('user deleted successfully')
}

//update a user
const updateUser = (req, res) => {
    res.send('user updated successfully')
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
 };
