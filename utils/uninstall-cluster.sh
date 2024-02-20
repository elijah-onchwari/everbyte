
#!/bin/bash
colima delete local  
brew uninstall --ignore-dependencies colima docker docker-compose qemu
brew autoremove
brew cleanup
sudo rm -rf /opt/colima
rm -rf ~/.docker ~/.lima~/ .colima
echo "Uninstallation complete"