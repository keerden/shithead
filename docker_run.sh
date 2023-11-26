NAME=shithead-$(whoami)
API_PORT=8080
SOCKET_PORT=3000
ENV_FILE=.env

docker build -t $NAME .

docker run -it --name $NAME -p $API_PORT:8080 -p $SOCKET_PORT:3000 --env-file $ENV_FILE $NAME

docker stop $NAME
docker rm $NAME