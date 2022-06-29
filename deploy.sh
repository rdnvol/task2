#!/usr/bin/env bash

# Portable code below
set -eou pipefail

step() {
  cat <<-EOF 1>&2
	==============================
	$1
	EOF
}

is_installed() {
  # This works with scripts and programs. For more info, check
  # http://goo.gl/B9683D
  type $1 &> /dev/null 2>&1
}

if ! is_installed shopify; then
  step "Installing Shopify CLI"
  log "gem install shopify"
  gem install shopify
fi

step "Configuring shopify CLI"

# Disable analytics
mkdir -p ~/.config/shopify && cat <<-YAML > ~/.config/shopify/config
[analytics]
enabled = false
YAML

# Secret environment variable that turns shopify CLI into CI mode that accepts environment credentials
export CI=1
export SHOPIFY_SHOP="${SHOP_STORE#*(https://|http://)}"

if [[ -n "$SHOP_ACCESS_TOKEN" ]]; then
  export SHOPIFY_PASSWORD="$SHOP_ACCESS_TOKEN"
fi

shopify login

host="https://${SHOP_STORE#*(https://|http://)}"
theme_root="${THEME_ROOT:-.}"

export CI=1
export SHOPIFY_SHOP="${SHOP_STORE#*(https://|http://)}"

if [[ -n "$SHOP_ACCESS_TOKEN" ]]; then
  export SHOPIFY_PASSWORD="$SHOP_ACCESS_TOKEN"
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

echo ::set-output name=theme_id::$preview_id
