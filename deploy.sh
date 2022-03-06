ssh "$USER@lectura.cs.arizona.edu" -N -f -L 8090:tutorqueue-vm.cs.arizona.edu:22
cat build.prod.sh | ssh "$USER@localhost" -p 8090
