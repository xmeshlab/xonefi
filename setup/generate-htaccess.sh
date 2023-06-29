#!/bin/bash

if [ $# -eq 0 ]
then
    echo "No arguments supplied"
    exit 1
fi

USER=$1
FILE=output/.htaccess
mkdir output

if [ ! -f router-htaccess.ref ]
then
    echo "Reference file not found!"
    exit 1
fi

cp router-htaccess.ref $FILE

if [ ! -f $FILE ]
then
    echo "Output file not found!"
    exit 1
fi

sed -i "s/{{USER}}/$USER/g" $FILE
