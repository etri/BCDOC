

./node_modules/.bin/dependency-cruise -T dot -x node_modules -v -- src/app.ts  | dot -T png > dependency-graph.png
