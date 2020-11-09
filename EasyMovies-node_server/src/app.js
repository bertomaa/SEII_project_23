const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/users/register', (req, res) => {
  const user = req.body;
  var isPresent = false;
  
  //TODO:controlla se il nome è già presente
  //try/catch
  if(isPresent){
    res.status(409);
    res.send();
  }
  else{
    users.push(user);
    res.status(201);
    res.send("{sessionID:'fvhusighfrvg'}");
  }

  //finally
  res.status(500);
  res.send();
});


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));