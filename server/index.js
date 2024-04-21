const express = require('express')
const app = express()

const cors = require('cors');
app.use(cors());

const http = require('http')
const server = http.createServer(app)

//const multer  = require('multer')


/*
const fs = require('fs')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});


const upload = multer({storage: storage, preservePath: true})
*/

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
      methods: ["GET", "POST"],
    },
  });

const port = 5000

io.on("connection", (socket) => {
  console.log(socket.id)

  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id)
  })
})

/*
app.post('/tofile', upload.single('file'), function (req, res, next){  
  const filename = req.body.data[0].split(".")[0]
  const extension = req.body.data[0].split(".")[1]
  let filestream = req.body.data[1] //array of unicode in one string
  const mode = req.body.data[2]

  const destinationFilePath = 'uploads/' + mode + "/" + filename + "-" + mode + "." + extension
  
  let processedFilestream = filestream.split(",") //array of unicode
  
  if(mode === "decrypt"){
    for(let i = 0; i < processedFilestream.length; i++){
      processedFilestream[i] = String.fromCharCode(processedFilestream[i]) //stringified array of unicode
    }

    fs.writeFile(destinationFilePath, processedFilestream.join(""), 'binary', err => {
      if (err) {
        console.error(err)
        return
      }
    })
  }else if(mode === "encrypt"){
    fs.writeFile(destinationFilePath, processedFilestream.join(","), 'binary', err => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
})

app.post('/upload', upload.single('file') ,function (req, res, next) {
  const filePath = 'uploads/' + req.file.originalname; 

  fs.readFile(filePath, 'binary', (err, data) => { 
    if (err) { 
      console.error('Error reading file:', err); 
      return; 
    } 
    const content = data; 
    res.send(content)
  }) 
})
*/

app.listen(port, () => {
    console.log("Server menyala")
})

