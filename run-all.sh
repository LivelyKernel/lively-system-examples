#! /bin/bash

# lsof -i tcp:10501 -s tcp:listen -t | xargs kill -S SIGTERM

pid=$(lsof -i tcp:10501 -s tcp:listen -t)
if [[ -z $pid ]]; then
  http-server . -p 10501 &
fi

open "http://localhost:10501/browser/index.html"
open "http://localhost:10501/browser-bootstrap/index.html"
open "http://localhost:10501/browser-bootstrap-from-source/index.html"

echo -e "-=-=-=-=-=-= nodejs/index.js =-=-=-=-=-=-\n"
node nodejs/index.js

echo -e "-=-=-=-=-=-= nodejs-bootstrap/index.js =-=-=-=-=-=-\n"
node nodejs-bootstrap/index.js
