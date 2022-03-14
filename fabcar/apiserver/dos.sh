#!/usr/bin/env bash
for i in {0..100}; do
#    echo "$i"
#    echo "$i" &
#    peer
    node peer channel fetch newest -c mychannel --orderer orderer.example.com

done
#
