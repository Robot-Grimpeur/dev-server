#! /usr/bin/env node

import * as chalk from 'chalk';
import { ChildProcess, fork } from 'child_process';
import ms = require('ms');
import * as net from 'net';
import * as os from 'os';
import * as repl from 'repl';
import * as updateNotifier from 'update-notifier';
import * as WebSocket from 'ws';

import * as pkg from '../package.json';

setInterval(() => updateNotifier({ pkg }).notify(), ms('3h'));

console.log(
  chalk`{bold.blue ${os.userInfo().username}}{yellow @}{bold.green ${
    os.hostname
  }}`
);

let child: ChildProcess;

const wss = new WebSocket.Server({
  port: 1001,
});

wss.on('connection', (ws) => {
  ws.on('message', (rawData) => {
    const data = JSON.parse(rawData.toString());

    switch (data.event) {
      case 'reload': {
        child?.kill();

        child = fork('/rg-dev');
        child.on('message', console.log);
        child.on('error', console.error);

        ws.send(JSON.stringify({ event: 'reloaded' }));
        break;
      }
    }
  });
});

net
  .createServer((socket) =>
    repl.start({
      prompt: '>> ',
      ignoreUndefined: true,
      breakEvalOnSigint: true,
      input: socket,
      output: socket,
    })
  )
  .listen(5001);
