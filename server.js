const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const app = express();
const http = require('http').createServer(app);

require('./utils/firebase-services');

// const {connect} = require('./utils/socketio-services');
// const io = connect(http);

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));

/* Custom middleware */
// const {authTokenMiddleware, userTokenMiddleware} = require("./utils/middleware/authorize");

/* Setup routes */
// authTokenMiddleware
const auth = require('./routes/auth');
const user = require('./routes/user');
const transportation = require('./routes/transportation');
const accommodation = require('./routes/accommodation');

/* Setup routes */
// authTokenMiddleware
app.use('/auth', auth);
app.use('/user', user);
app.use('/transportation', transportation);
app.use('/accommodation', accommodation);

// mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
    .connect(
        `mongodb://localhost:27017/MCP`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

app.use('/static', express.static('static'));

// app.get('*', function(req, res){
//     res.status(404).send("Unauthorized route")
// });

app.get('/', (req, res) => res.send('Home'));

/* SocketIO */
// io.on('connection', function(socket){
//     console.log('a user connected');
// });

const port = process.env.PORT || 3000;

http.listen(port, () => console.log(`Server up and running on port ${port} !`));
