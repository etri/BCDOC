
echo "========Create evaluationch channel========"
curl -s -X POST http://localhost:4000/network/channels/evaluationch/contract \
  -H "content-type: application/json" \
  -d '{"arg":"", "contractVersion":"v1"}'
echo
echo
