#!/bin/sh

echo "
  window.ENV='$NODE_ENV';
  window.MAINTENANCE='$MAINTENANCE';
" > 'assets/js/config.js'
