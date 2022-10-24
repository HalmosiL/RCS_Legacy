const mosca = require('mosca');
const events = require('../sse/event')
const db = require('../models/db')
const bcrypt = require('bcrypt')

var Lamps = []

var LampService = {
    registrateLamp: (name) => {
        var index = Lamps.findIndex(element => element.name == name)

        if(index != -1){
            Lamps[index].available = true  
        } else {
            Lamps.push({
                id: null,
                name:name, 
                status:'enabled', 
                available:true
            })

            Lamps.sort((a,b) => (a.name > b.name) ? 1 : -1)
            for(var i = 0; i < Lamps.length;i++){
                Lamps[i].id = i + 1
            }
        }
    },

    getLamps: () => {
        return Lamps
    },

    switchLampStatus: (name) => {
        var index = Lamps.findIndex(element => element.name == name)
        if(index != -1){
            if(Lamps[index].status == 'disabled'){
                Lamps[index].status = 'enabled'
            } else if(Lamps[index].status == 'enabled'){
                Lamps[index].status = 'disabled'
            }

            events.publish({Lamps:Lamps})
        }
    },

    removeLamp: (name) => {
        var index = Lamps.findIndex(element => element.name == name)

        if(index != -1){
            Lamps.splice(index,1)
            events.publish({Lamps:Lamps})
        }
    },

    turnOffLamp: (name) => {
        var index = Lamps.findIndex(element => element.name == name)

        if(index != -1){
            var packet = {
                topic: name.toString(),
                payload: JSON.stringify("turn off"),
                qos: 1
            }
            
            server.publish(packet)
            Lamps.splice(index,1)
            events.publish({Lamps:Lamps})
        }
    },

    turnOffAllLamps: () => {
        for(var i = 0; i < Lamps.length; i++){
            var packet = {
                topic: Lamps[i].name.toString(),
                payload: JSON.stringify("turn off"),
                qos: 1
            }
            server.publish(packet)
        }

        Lamps = []
        events.publish({Lamps:Lamps})
    },

    flashLamp: (name, rgb) => {
        var packet = {
            topic: name.toString(),
            payload: JSON.stringify(rgb),
            qos: 1
        }

        return server.publish(packet)
    }
}

server = new mosca.Server({
    port:1884
});

server.authenticate = (client, username, password, callback) => {

    if(!username || !password){
        return callback('Invalid user',false)
    }

    db.getLampByName(username).then(async (row) => {
        if(row && row.length) {
            if(await bcrypt.compare(password.toString(), row[0].password)){
                LampService.registrateLamp(username)
                events.publish({Lamps:Lamps})
                return callback(null, true)
            }
        }

        return callback(null, false)
    }).catch((err) => {   
        console.log(err)  
        if ( err ) {
            return callback(err, false)
        }
    })
}

server.on('unsubscribed', function(client){
    var index = Lamps.findIndex((elment) => elment.name == client)

    if(index != -1){
        Lamps[index].available = false
    }

    events.publish({Lamps: Lamps})
    console.log('Lamp unsubscribed')
});

server.on('ready', function(){
    console.log("Mqtt server is runing");
});


module.exports = LampService