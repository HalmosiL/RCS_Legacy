const lampService = require('./Lamp_service')
const events = require('../sse/event')

var id_global = 1
var runingRuns = []

var runService = {
    getRuningRuns: () => {
        return runingRuns
    },
    startRun: (run) => {
        run.id = id_global++
        runingRuns.push(run)
    },
    stopRun: (id) => {
        var index = runingRuns.findIndex(elment => elment.id == id)

        if(index != -1){
            runingRuns.splice(index,1)
        }

        events.publish({RuningRuns:runingRuns})
    }
}

module.exports = runService