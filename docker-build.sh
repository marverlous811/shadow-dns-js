DOCKER_TAG=$DOCKER_REPO:$VERSION
docker build --platform=linux/amd64 -t $DOCKER_TAG -f Dockerfile .
if [[ -n $DOCKER_PUSH && $DOCKER_PUSH == "true" ]]; then 
docker push $DOCKER_TAG
fi