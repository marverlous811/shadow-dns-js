#!/bin/ash
if [[ -n $TYPE && $TYPE == "agent" ]]; then
    node agent.js
else
    node server.js
fi