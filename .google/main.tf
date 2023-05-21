# create VPC
resource "google_compute_network" "vpc" {
  name                    = "everbyte-dev-vpc"
  auto_create_subnetworks = false
}

# create Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "everbyte-us-dev-subnet"
  region        = "us-central1"
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.190.0.0/24"
}

# Create GKE cluster with 2 nodes in our custom VPC/Subnet
resource "google_container_cluster" "primary" {
  name                     = "everbyte-cluster"
  location                 = "us-central1-a"
  network                  = google_compute_network.vpc.name
  subnetwork               = google_compute_subnetwork.subnet.name
  remove_default_node_pool = true ## create the smallest possible default node pool and immediately delete it.
  # networking_mode          = "VPC_NATIVE" 
  initial_node_count = 1

  private_cluster_config {
    enable_private_endpoint = true
    enable_private_nodes    = true
    master_ipv4_cidr_block  = "10.13.0.0/28"
  }
  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.11.0.0/21"
    services_ipv4_cidr_block = "10.12.0.0/21"
  }
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "10.0.0.7/32"
      display_name = "net1"
    }

  }
}

# Create managed node pool
resource "google_container_node_pool" "primary_nodes" {
  name       = google_container_cluster.primary.name
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    labels = {
      env = "dev"
    }

    machine_type = "n1-standard-1"
    preemptible  = true
    disk_size_gb = 10

    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

## Create jump host . We will allow this jump host to access GKE cluster. the ip of this jump host is already authorized to allowin the GKE cluster

resource "google_compute_address" "my_internal_ip_addr" {
  project      = "geczra-380202"
  address_type = "INTERNAL"
  region       = "us-central1"
  subnetwork   = google_compute_subnetwork.subnet.name
  name         = "my-ip"
  address      = "10.190.0.7"
  description  = "An internal IP address for my jump host"
}

resource "google_compute_instance" "evebyte" {
  project      = "geczra-380202"
  zone         = "us-central1-a"
  name         = "everbyte-jump-host"
  machine_type = "e2-medium"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
  network_interface {
    network    = google_compute_network.vpc.name
    subnetwork = google_compute_subnetwork.subnet.name # Replace with a reference or self link to your subnet, in quotes
    network_ip = google_compute_address.my_internal_ip_addr.address
  }

}

## Creare Firewall to access jump hist via iap

resource "google_compute_firewall" "rules" {
  project = "geczra-380202"
  name    = "allow-ssh"
  network = google_compute_network.vpc.name # Replace with a reference or self link to your network, in quotes

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["35.235.240.0/20"]
}


## Create IAP SSH permissions for your test instance

resource "google_project_iam_member" "project" {
  project = "geczra-380202"
  role    = "roles/iap.tunnelResourceAccessor"
  member  = "serviceAccount:terraform-iap-ssh@geczra-380202.iam.gserviceaccount.com"
}

# create cloud router for nat gateway
resource "google_compute_router" "router" {
  project = "geczra-380202"
  name    = "nat-router"
  network = google_compute_network.vpc.name
  region  = "us-central1"
}

## Create Nat Gateway with module

module "cloud-nat" {
  source     = "terraform-google-modules/cloud-nat/google"
  version    = "~> 1.2"
  project_id = "geczra-380202"
  region     = "us-central1"
  router     = google_compute_router.router.name
  name       = "nat-config"

}