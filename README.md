## UGIDotNET
# Join The Expert - Web Day
### 18 Novembre 2016

Demo sessione Real world Visual Studio Code

##Supported tags
* [> *1.0.0*](https://github.com/robymes/JoinTheExpert-WebDay/blob/v1.0.1/publish/web/Dockerfile), [> *latest*](https://github.com/robymes/JoinTheExpert-WebDay/blob/v1.0.1/publish/web/Dockerfile), [(Dockerfile)](https://github.com/robymes/JoinTheExpert-WebDay/blob/v1.0.1/publish/web/Dockerfile)

## Creazione immagine Docker ottimizzata
* **Build ASP.NET Core**: `docker-compose -f ./docker-compose-build.yml up`
* **Build Docker image**: `docker build publish/web -t local/webapp:optimized`
* **Run Docker image**: `docker run -it --rm -p 8080:80 local/webapp:optimized`

