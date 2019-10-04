const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Comments service
class CommentService{
    constructor(){
        this.comments = [];
    }

    async find(){
        return this.comments;
    }

    async create(data){
        const comment = {
            id: this.comments.length,
            text: data.text,
            tag: data.tag,
            viewer: data.viewer
        }

        comment.time = moment().format('h:mm:ss a');

        this.comments.push(comment);
    }
}

const app = express(feathers());

app.use(express.json()); // Parse JSON
app.configure(socketio()); // Config Socket.io real-time APIs
app.configure(express.rest()); // Enable REST services
app.use('/comments', new CommentService()); //Register services


// new connections connect to stream channel
app.on('connection',connection => app.channel('stream').join(connection));
// publish events to stream
app.publish(data => app.channel('stream'));
// listen on a port
const PORT = process.env.PORT || 3030;
app.listen(PORT).on('listening', () => {
    console.log(`listening on port ${PORT}`);
});


app.service('comments').create({
    text: 'eat a hot dog',
    tags: 'food',
    viewer: 'jim beam',
    time: moment().format('h:mm:ss a')
})