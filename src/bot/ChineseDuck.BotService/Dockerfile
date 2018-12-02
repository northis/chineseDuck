FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["src/bot/ChineseDuck.BotService/ChineseDuck.BotService.csproj", "src/bot/ChineseDuck.BotService/"]
RUN dotnet restore "src/bot/ChineseDuck.BotService/ChineseDuck.BotService.csproj"
COPY . .
WORKDIR "/src/src/bot/ChineseDuck.BotService"
RUN dotnet build "ChineseDuck.BotService.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "ChineseDuck.BotService.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ChineseDuck.BotService.dll"]