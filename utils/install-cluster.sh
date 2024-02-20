#!/bin/bash

# Install dependencies
brew install colima
brew install docker
brew install kubectl
brew install kubectx
brew install docker-compose

# Write to a file
touch $HOME/.colima/_lima/_config/override.yaml
echo "mountType: 9p
mounts:
  - location: \"/Users/ely\"
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap
  - location: \"~\"
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap
  - location: /tmp/colima
    writable: true
    9p:
      securityModel: mapped-xattr
      cache: mmap" > $HOME/.colima/_lima/_config/override.yaml

# Start Colima with custom configuration
colima start  --profile local --arch aarch64 --vm-type=qemu --vz-rosetta --cpu 4 --memory 4 --disk 10 --mount-type 9p --kubernetes --network-address --dns 8.8.8.8 --dns 1.1.1.1


