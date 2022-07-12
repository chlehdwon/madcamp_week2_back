const users = []

const addUser = ({id, name, room, pokemon}) => {
   const numberOfUsersInRoom = users.filter(user => user.room === room).length
   if(numberOfUsersInRoom === 2)
   return { error: 'Room full' }

   const newUser = { id, name, room, pokemon}
   users.push(newUser)
   console.log("User with "+id+" "+name+" "+room+" added "+pokemon.name)
   return { newUser }
}

const removeUser = id => {
   const removeIndex = users.findIndex(user => user.id === id)

   console.log("User with "+id+" removed")
   if(removeIndex!==-1)
       return users.splice(removeIndex, 1)[0]
}

const getUser = id => {

   return users.find(user => user.id === id)
}

const getUsersInRoom = room => {

    return users.filter(user => user.room === room)
}

export { addUser, removeUser, getUser, getUsersInRoom }