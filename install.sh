sudo apt-get update
sudo apt-get -y dist-upgrade
sudo apt-get autoremove
sudo apt-get autoclean

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb-server
sudo service mongodb start

cd && wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.49.tar.gz
#cd && wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.68.tar.gz
tar -zxf bcm2835-1.49.tar.gz
cd bcm2835-1.49
./configure
make -j4
sudo make check
sudo make install
sudo modprobe spi_bcm2835
cd && sudo rm -r bcm2835-1.49 bcm2835-1.49.tar.gz

cd ~/pi_smartlock

npm i
