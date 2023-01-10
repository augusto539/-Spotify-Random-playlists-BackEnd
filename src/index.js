// REQUIRES
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
//const favicon = require('serve-favicon');
const cors = require('cors');
// VARIABLES
const app = express();
// SETINGS
app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');
// MIDDLEWARES
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.37:3000');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
//app.use(favicon('src/public/img/utn_logo.png'));
// app.use(cors({origin: '*'}));
app.use(cookieParser());
dotenv.config({path: 'src/.env'});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./routes/index'));
app.use(express.static(path.join(__dirname, 'public')))
// LISTENING THE SERVER


const os = require('os')
app.set('hostname', os.networkInterfaces()['Ethernet 2'][1]['address']); //get the ipv4 of the sistem
app.listen(app.get('port'),app.get('hostname') , () => console.log(`Server runing at http://${app.get('hostname')}:${app.get('port')}/`));


// app.listen(app.get('port') , () => console.log(`Server runing on port: ${app.get('port')}`));