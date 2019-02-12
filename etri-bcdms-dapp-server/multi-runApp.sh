

function removeOld() {
	rm -rf ./fabric-client-kvs_org*
}

function copyIndex() {
	if [ ! -f ./node_modules/$1 ]; then
		cp src/types/$1 ./node_modules/$1
	fi
}

removeOld

copyIndex fabric-client/index.d.ts
copyIndex fabric-ca-client/index.d.ts

PORT=4000 NETWORK_MODE=multi ./node_modules/.bin/ts-node ./src/app.ts
