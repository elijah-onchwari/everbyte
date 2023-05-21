terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.65.2"
    }
  }
}

provider "google" {
  region      = "us-central1"
  project     = "geczra-380202"
  credentials = file("terraform.json")
  zone        = "us-central1-a"
}