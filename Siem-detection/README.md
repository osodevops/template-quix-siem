# Running Go from Python within Quix

Navigate to Quix Applications, and click on the Detector app.

### Update requirements.txt
Update your Application's requirements.txt file and add the necessary files, such as Pandas as the base image is changed to Ubuntu.
The reason for this is the original docker image already has that library and others.

For example:
pandas==1.5.3  (Has to be lower than v2 for Quix)

### Dockerfile update
Then update your dockerfile under build to this:

```shell
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND="noninteractive"
ENV PYTHONUNBUFFERED=1
ENV PYTHONIOENCODING=UTF-8

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=git /project .
RUN find | grep requirements.txt | xargs -I '{}' python3 -m pip install -i http://pip-cache.pip-cache.svc.cluster.local/simple --trusted-host pip-cache.pip-cache.svc.cluster.local -r '{}' --extra-index-url https://pypi.org/simple --extra-index-url https://pkgs.dev.azure.com/quix-analytics/53f7fe95-59fe-4307-b479-2473b96de6d1/_packaging/public/pypi/simple/
ENTRYPOINT ["python3", "main.py"]
```


### Rule Checker (Go code)
The dectector.so is compiled Go code. It has been written to improve performance in the rule checking against the incoming data.
The wrapper code also written in go is here: 
https://github.com/osodevops/quix-siem (Initial POC code + the Go Siem Detector - look at readme to compile and copy to detector.so here in this project)
https://github.com/osodevops/sigma-go (Brought this into oso because it needed a fix)


### Deploy
Deploy the project from the portal, check the logs
