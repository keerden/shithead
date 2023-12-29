NAME=shithead-$(whoami)
API_PORT=8080
SOCKET_PORT=3000
DEBUG_PORT=9229
ENV_FILE=.env

docker build -t $NAME .

docker run -it --name $NAME --expose 9229 -p $DEBUG_PORT:9229 -p $API_PORT:8080 -p $SOCKET_PORT:3000 --env-file $ENV_FILE $NAME npm run debug

docker stop $NAME
docker rm $NAME