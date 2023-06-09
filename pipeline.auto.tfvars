environment        = "everbyte-dev"
gcp_project        = "geczra-380202"
gcp_region         = "us-central1"
gcp_zone           = "us-central1-a"
subnet_cidr        = "10.190.0.0/28"
gce_startup_script = <<EOF
#!/bin/bash
echo "Running: udo curl -LO https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl"
sudo curl -LO "https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl"

echo "Running: sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

echo "Running: kubectl version --client"
kubectl version --client

echo '{  "type": "service_account",  "project_id": "geczra-380202",  "private_key_id": "40d1680cab816a5983e8f45257a03f54b464fb0d",  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdQwP2LcXGy+MZ\nwqNMx0tZd2kXNqTlqzUVGZju/m8fQRNaykF01Chayoa4adPDX6jwkF/iTvDxUgVg\ng9BMPG79jWMP6imjLXybT/r5WWZ/gtq1HULJSw7ZB0s4qz//5+DRFbjSJjdo6R4y\nCYHdFkcSaZxN8a52zPy//hY+0EX5XrNxaT4CLkOvkb9RmXxHIZxafxdiuV/VkvRi\nwpCGn9QlPgI+b0fPuzpBU9TvnO2Jmf6F2jLO6Z7X3RlF21/3DA3z/o+2t6hSbfHa\nZEv8mO3rYGuXXPhSlPcIyFF5/JuSEzPdMkO2Unomkic6FJ5s+6k1bx/MTfKAQ8hM\nJ3BZE3fnAgMBAAECggEAHDnyFRakIAlqaq4/x0EiKh2/tBXvxPVU4sOkaokqgs6Y\nXbxdwU1vLNSbF7CO/MtHtF4Fh8Ypgvb41hjyoyxZs5LUDAA4lvxMGEhjwKumNQ7U\nmJt26FBbiuK/Qp2iMBl7havDb5zCZ0coT0zbjUY5XXmtP2Q4r0QdvYwqi/2wAZEQ\nlonFxrJjP/Vl2lS5+0W3bc016+c7GiPcTgcqzAXx6IDibufua8GfHn5K/teSHFbC\nGmht60EnNWlRNNW0JZEBAls+Nv81tKvDzYv25nZT8+BPoa6+My7MDULfIxzzpK3Z\nLVMN1Pr+HBfPklsmQESeadlJTquROaB4+N9okF7G+QKBgQDaJ5FWnqjS0M4/8mss\nXQGAhGay3p14hEWPSxMX7a9CwjekSx8rciy+ugRbD3ibWbaj1J8yPqktlrVP5J+Z\nCyLNrBmzW4JCqhCzdXZFGf3JtxhwjWG/Fwx8rg6hJpwSF+kh5YhD4R5ZWWqhLdv5\n2+gdN26RnDFQJTEfZkoVYhw4ZQKBgQC4iyWR2W4y8kr6L+ulEuT2heJWx/ECHykr\n25vdxSsGdnxTHfBjqxkHjNnhDT6cqZy+tk+8QX1CpbYl046sXVZhe8sq9acHbQGA\ncEuTtIzbE1kIKY0xDRzEWQ0euwLlPRuk87hLWahzQpcRLQvRvOkBvhGMjoBa8lVZ\nzZco3uj8WwKBgDZeOBV7Ux2/FjfPpbAXucEavjGD04DujhtpHWgQP2aG2rEiW7FL\nMiWSXHWJRIiK8j6gRdCS1zzaW3N+ydutb84MPxd5DdypX6Ip+wC7uokkDX43bg3e\no6kLA/Bbm/fSZ7Kf7rbkCtk/tJhYwoLhsFZfszms0Illy3lE19++ZMQVAoGAKEFy\nOJaNi19/K4Q4ixHMEFq0POnwkN3rRT3qij3wXMCL7jWhspwoIZWAEa+p8NKu9ose\naZp/kIJFcYrsnHzf0vQGJaDghqYopbPZSKch8sgNq9Ikkoaht9MVIZb50re5yAnC\nMe2k6T+lZIHHCkGDMnYbreWH6k7if2xxhODbQfECgYEAvj4OsHNpUSkojCSo2MQx\naYvu8l1vFl3pXnPzxysR7u5jFohc8muj73iZ8Ei7vzVScuWaVj8gBHwXQcKDHmK3\naTA8QVSTiBmb5+JQC4d/NU6ytJwIIJh81L/wKit+qNcurCdY4KPLo0BSQ2uE0F7m\ni2cAdCqFuY+MNrzaBtN48xo=\n-----END PRIVATE KEY-----\n",  "client_email": "terraform@geczra-380202.iam.gserviceaccount.com",  "client_id": "117490317956360660455",  "auth_uri": "https://accounts.google.com/o/oauth2/auth",  "token_uri": "https://oauth2.googleapis.com/token",  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/terraform%40geczra-380202.iam.gserviceaccount.com",  "universe_domain": "googleapis.com"}' > /tmp/gcloud-service-key.json
echo "Running: gcloud auth activate-service-account --key-file=/tmp/gcloud-service-key.json"
gcloud auth login --cred-file=/tmp/gcloud-service-key.json --quiet

echo "Running: gcloud container clusters get-credentials everbyte-dev-cluster --zone us-central1-a --project geczra-380202"
gcloud container clusters get-credentials everbyte-dev-cluster --zone us-central1-a --project geczra-380202

echo "Running: kubectl create namespace argocd"
kubectl create namespace argocd

echo "Running: kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Running: kubectl patch svc argocd-server --namespace=argocd --type='json' -p '[{\"op\":\"replace\",\"path\":\"/spec/type\",\"value\":\"NodePort\"}]'"
kubectl patch svc argocd-server --namespace=argocd --type='json' -p '[{"op":"replace","path":"/spec/type","value":"NodePort"}]'

echo "Running: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d; echo"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
 EOF
