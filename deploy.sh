export CI=1
export SHOPIFY_SHOP="${SHOP_STORE#*(https://|http://)}"

if [[ -n "$SHOP_ACCESS_TOKEN" ]]; then
  export SHOPIFY_PASSWORD="$SHOP_ACCESS_TOKEN"
else
  export SHOPIFY_PASSWORD="$SHOP_APP_PASSWORD"
fi

shopify login

host="https://${SHOP_STORE#*(https://|http://)}"
theme_root="${THEME_ROOT:-.}"

step "Creating development theme"
theme_push_log="$(mktemp)"
shopify theme push --development --json $theme_root > "$theme_push_log" && cat "$theme_push_log"
preview_url="$(cat "$theme_push_log" | tail -n 1 | jq -r '.theme.preview_url')"
preview_id="$(cat "$theme_push_log" | tail -n 1 | jq -r '.theme.id')"
 

query_string="?preview_theme_id=${preview_id}&_fd=0"
echo  preview_url
echo  preview_id
echo  query_string
