
echo "========Create evaluationch channel========"
curl -s -X POST http://localhost:4000/network/channels/evaluationch \
  -H "content-type: application/json" \
  -d '{"arg":""}'
echo
echo

# Upgrade 테스트용.
# echo "========Upgrade evaluationch channel========"
# curl -s -X POST http://localhost:4000/network/channels/evaluationch/contract \
#   -H "content-type: application/json" \
#   -d '{
#       "contractVersion":"v0.2.0",
#       "arg":""
#     }'
# echo
# echo

echo "========Create tokench channel========"
curl -s -X POST http://localhost:4000/network/channels/tokench \
  -H "content-type: application/json" \
  -d '{"arg":""}'
echo
echo
