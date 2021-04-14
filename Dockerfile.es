FROM elasticsearch:7.12.0

USER root

COPY ./elasticsearch.yml /usr/share/elasticsearch/config/

RUN sh -c '/bin/echo -e "y" | /usr/share/elasticsearch/bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.0/elasticsearch-analysis-ik-7.12.0.zip'

RUN kill $(ps -ef | grep elastic)

RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch

USER elasticsearch

EXPOSE 9200 9300

CMD ["/usr/share/elasticsearch/bin/elasticsearch"]
