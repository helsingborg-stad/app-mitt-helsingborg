props=$(echo $SENTRY_PROPERTIES | base64 -d)
echo "$props" >android/sentry.properties
echo "$props" >ios/sentry.properties
echo "sentry.properties created"
