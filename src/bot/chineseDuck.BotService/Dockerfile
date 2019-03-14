FROM microsoft/dotnet:latest
COPY bin/Debug/netcoreapp2.1/publish/ /root/
EXPOSE 8080/tcp
ENTRYPOINT dotnet /root/chineseDuck.BotService.dll