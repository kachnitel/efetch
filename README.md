### Dropped the Z from EZ fetch to save you time!

No really it's just a simple wrapper for fetch.

Adds a simple interface to set headers and do basic REST requests.
All request methods return **Promise** that resolves with JSON decoded data or `true` if the response status is *204 No content* and the body is empty.

# Usage
```
import { Connection } from '@kachnitel/efetch'

let connection = new Connection('https://my.url')

let user = await connection.get('users', { id: 3 })
console.log(user) // { id: 3, name: "Joseph", email: "jo@se.ph" }

// Set a default header for all requests
connection.addHeaders({ 'Authorization': 'Bearer ' + token.access_token })

// Post JSON data
connection.post('users', {
  name: 'Joe'
  email: 'j@o.e'
})

// Upload a file
import * as ImagePicker from 'expo-image-picker'

let imageObject = await ImagePicker.launchImageLibraryAsync()
connection.postFile(`api/users/${id}/picture`, 'picture', imageObject)
```
