# Production facility challenge


## Examples
```
node index.js < ./example.txt
```

## Building and running in Docker
```
docker build . -t bloomon
cat ./example.txt | docker run -i bloomon
```

## Testing
```
jest
```