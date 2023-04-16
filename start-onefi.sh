#!/bin/bash
#cd client-daemon && ./start-client.sh
#cd ../provider-daemon && ./start-provider.sh
cd provider-daemon && ./start-provider.sh
cd ../app && npm start
