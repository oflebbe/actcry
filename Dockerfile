FROM openjdk:8-jre
COPY target/actcry-0.0.1-SNAPSHOT.jar /
EXPOSE 8080
ENV key=""
CMD java -jar /actcry-0.0.1-SNAPSHOT.jar $key
