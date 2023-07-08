FROM mcr.microsoft.com/mssql/server:2022-latest


ENV MSSQL_PID=Developer
ENV MSSQL_TCP_PORT=1433
ENV MSSQL_AGENT_ENABLED=True
ENV MSSQL_ENABLE_HADR=1
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=<YourStrong@Passw0rd>

WORKDIR ./app

ENV mode=2
# 1: dummy data
# 2: only tables
# 3: nothing


COPY create.sql ./create.sql
COPY 4p2.sql ./4p2.sql
COPY 4p4.sql ./4p4.sql
COPY * ./


RUN if [ $mode = 1 ] ; then \
(/opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started" && /opt/mssql-tools/bin/sqlcmd -S127.0.0.1 -Usa -P\<YourStrong@Passw0rd\> -i create.sql,4p2.sql,4p4.sql,file.sql ; \
elif [ $mode = 2 ] ; then \
(/opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started" && /opt/mssql-tools/bin/sqlcmd -S127.0.0.1 -Usa -P\<YourStrong@Passw0rd\> -i create.sql,4p2.sql,4p4.sql ; \
fi


