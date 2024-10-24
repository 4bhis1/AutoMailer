const EventEmitter = require('events');
const { log, error } = require('./consoller');

class MyEventClass extends EventEmitter {
    constructor(repeat = false) {
        super(); // Call the parent class constructor (EventEmitter)
        this.eventTriggered = false; // Keep track of whether the event has been triggered
        this.inProcess = false; // Flag to indicate if an event is being processed
        this.repeat = repeat; // If true, allow the event to be triggered multiple times
    }

    triggerEvent(eventName, data) {
        if (this.inProcess) {
            error(`Event: ${eventName} is already being processed.`);
            return;
        }

        if (!this.eventTriggered || this.repeat) { // If repeat is true, allow multiple triggers
            log(`Triggering event: ${eventName}`);
            this.inProcess = true; // Mark event as in process
            this.emit(eventName, data); // Trigger the event

            // Simulate some asynchronous process finishing
            setTimeout(() => {
                this.inProcess = false; // Mark event as finished
                this.eventTriggered = true; // Set the flag to true
                if (!this.repeat) {
                    log(`Event: ${eventName} will not trigger again as repeat is false.`);
                }
            }, 1000); // Simulate delay in event processing
        } else {
            error(`Event: ${eventName} has already been triggered and repeat is false.`);
        }
    }

    listenToEventOnce(eventName, callback) {
        this.once(eventName, callback); // Listen to the event only once
    }

    listenToEvent(eventName, callback) {
        this.on(eventName, callback); // Listen to the event repeatedly
    }
}

module.exports = MyEventClass;
