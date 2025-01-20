---
layout: post
title: Ways to Expose a service within k8s
tags: k8s, kubernetes
---

So I've started using k8s for work! It is l parts exciting and boggling. Just the sheer amount of options and resources you have to learn and be comfortable configuring is probably why k8s is sucequah a pain for so many. [[1](https://news.ycombinator.com/item?id=42252336)] [[2](https://news.ycombinator.com/item?id=29360204)] [[3](https://news.ycombinator.com/item?id=42246883)] [[4](https://news.ycombinator.com/item?id=42253231)] [[5](https://news.ycombinator.com/item?id=34897312)]

Nonetheless, here we are! And I'm too novice to form opinions at the moment - so I'll leave it at that. 

This post is probably one of the many I'll be writing down as I tread down this path - capturing anecdotes and gotchas along the way.

## Enough ChitChat. What are we talking today?

At its core, k8s is a container orchestrator. Which means it can run your workloads - just that it needs to be containerized.

Assume your workload is a simple stateless service that you want to connect to from outside. What are the different options you have?

### ClusterIP

![ClusterIP]({{site.baseurl}}/assets/images/k8s-service-expose/ClusterIP.png)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  selector:
    app: nginx
```

This is the very basic setup that you get once you expose a service within k8s using `expose` subcommand within `kubectl`. Having a `ClusterIP` will help services within your cluster talk to each other. But that's about it. You cannot talk to services to/from outside the internal k8s network.

Okay, well so much for a system that you can't talk to from outside. That's what you have the proxy for.

### Port-Forwarding

You could setup a k8s proxy by running

```sh
$ kubectl proxy --port=9999
```

And you can connect to the k8s API via this proxy like so

```sh
$ http://localhost:9999/api/v1/proxy/namespaces/<NAMESPACE>/services/<SERVICE-NAME>:<PORT-NAME>/
```

So for the service above, we can connect like so

```sh
$ http://localhost:9999/api/v1/proxy/namespaces/default/services/myapp-service:80/
```

This is mostly used for debugging, temporarily verifying 

### NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30004
  selector:
    app: nginx
```

A simple change to let others reach/talk to your service would be to change the Service Spec from `ClusterIP` to `NodePort`. It is exactly what it's name is - a unique port assigned in every node the service runs at. 

So assume you have a service that runs in 3 pods across 3 different nodes - 1 pod/node (to keep it simple). So the services within the pod take the same set of ports in each of the nodes they are run at. 

This is very similar to the age old setup of having a service run with a single port across a bunch of machines routed to by a LB sitting in front. 

There are 3 port definitions relevant here -

1. `port` - The port exposed by the Kubernetes service internally within the cluster. Other pods or services inside the cluster will use this port to communicate with the service. Pods inside the cluster access the service at `myapp-service:80`.
2. `targetPort` - The port on the actual application (or container) that the service forwards traffic to. The service uses this port to route traffic to the containers running the application. The application inside the container listens on port `8080`. Kubernetes routes the traffic received on `port` (`80`) or `nodePort` (`30004`) to this port on the target pod.
3. `nodePort` - The port opened on all cluster nodes to allow external access to the service. Enables access to the service from outside the cluster through `<NodeIP>:<NodePort>`. In the above example, any client outside the cluster can reach the service by sending a request to `<NodeIP>:30004`.

The caveat here though is, it has a Limited port range (default: 30000–32767). Also, if your node/VM that hosts the pods change, the LB will have to deal with that. Not a good setup for service discovery.

### LoadBalancer

![LoadBalancer]({{site.baseurl}}/assets/images/k8s-service-expose/LB.png)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

This is the typical LB that we discussed with `ClusterIP`. In most cases, this is a network load balancer provided for by your cloud provider. For bespoke or on-prem setups, nginx could be used to setup a LB in front of the nodes.

### Ingress

![Ingress]({{site.baseurl}}/assets/images/k8s-service-expose/Ingress.png)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-service
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /logs
            pathType: Prefix
            backend:
              service:
                name: log-service
                port:
                  number: 80
          - path: /web
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
  tls:
    - hosts:
        - example.com
      secretName: tls-secret
```

Service object operates at Layer 4. This means it canonly forward TCP/UDP communications and does not "look" inside the connections. 

Having `NodePort` means you have multiple open ports in each of the nodes (for every hosted service) and one LB for each of those services, which is very costly. Especially in cloud based envs.

Ingress is used to expose multiple services with a single external endpoint (HTTP/HTTPS). Very simply, it is `nginx` for k8s environments. 

It can process application level information like DNS host names, port specific routing, do advanced routing basis the endpoints (`/logs` -> ServiceA, `/web` -> ServiceB), TLS termination among others.

Most popular Ingress controllers are Traefik, HAProxy, Nginx

## References

1. [Kubernetes NodePort vs LoadBalancer vs Ingress? When should I use what?](https://medium.com/google-cloud/kubernetes-nodeport-vs-loadbalancer-vs-ingress-when-should-i-use-what-922f010849e0)
2. [Kubernetes Services: ClusterIP, Nodeport and LoadBalancer](https://sysdig.com/blog/kubernetes-services-clusterip-nodeport-loadbalancer/)



