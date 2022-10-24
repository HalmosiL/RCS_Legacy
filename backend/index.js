require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./config/passport_config.js')
const session = require('express-session')

const port = process.env.PORT || 3000

//routers
const auth_router = require('./routers/auth_router.js')
const runs_router = require('./routers/runs_router.js')
//passport
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}))
//cors
const corsConfig = {
    credentials: true,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors(corsConfig))

if(process.env.MODE === 'production') {
    app.use(express.static(__dirname + '/public/'))
    app.get('/:path', (req, res) => {
        if(req.params.path == 'runs/Monitor'){
            res.redirect('/runs/Monitor')
        } else {
            res.sendFile(__dirname + '/public/index.html')
        }
    })
}

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', auth_router)
app.use('/runs', runs_router)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))