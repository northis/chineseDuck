FROM microsoft/dotnet:latest
WORKDIR /app
COPY bin/Debug/netcoreapp2.1/publish /app
EXPOSE 8080/tcp
ENTRYPOINT dotnet /app/chineseDuck.BotService.dll