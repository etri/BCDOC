
echo "========Register an user========"
curl -s -X POST http://localhost:4000/user \
  -H "content-type: application/json" \
  -d '{
    "orgName":"org1",
    "departmentName":"department1",
    "userID":"ahnhwi1",
    "userName":"Hwi Ahn",
    "password":"test1234"
  }'
echo
echo

echo "========Login the user========"
echo
USER_TOKEN=$(curl -s -X POST \
  http://localhost:4000/user/ahnhwi1 \
  -H "content-type: application/json" \
  -d '{
    "orgName":"org1",
    "departmentName":"department1",
    "password":"test1234"
  }')
echo $USER_TOKEN
