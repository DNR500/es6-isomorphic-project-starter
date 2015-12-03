import express from 'express';
import * as bodyParser from 'body-parser';
import { install } from 'source-map-support';

if(process.argv[2] === 'debug'){
    install();
}

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/'));
app.listen(4788, function () {});