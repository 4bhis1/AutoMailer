const EventEmitter = require('events');
const { log, error } = require('./consoller');

class MyEventClass extends EventEmitter {
    constructor() {
        super(); // Call the parent class constructor (EventEmitter)
        this.eventTriggered = false; // Keep track of whether the event has been triggered
    }

    triggerEvent(eventName, data) {
        if (!this.eventTriggered) { // Ensure the event is triggered only once
            log(`Triggering event: ${eventName}`);
            this.emit(eventName, data); // Trigger the event
            this.eventTriggered = true; // Set the flag to true after triggering
        } else {
            error(`Event: ${eventName} has already been triggered.`);
        }
    }

    listenToEventOnce(eventName, callback) {
        this.once(eventName, callback); // Listen to the event only once
    }
}

module.exports = MyEventClass;
