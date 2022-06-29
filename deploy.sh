#!/usr/bin/env bash
#
#[[ -n "$INPUT_STORE" ]]             && export SHOP_STORE="$INPUT_STORE"
#[[ -n "$INPUT_PASSWORD" ]]          && export SHOP_PASSWORD="$INPUT_PASSWORD"
#[[ -n "$INPUT_PRODUCT_HANDLE" ]]    && export SHOP_PRODUCT_HANDLE="$INPUT_PRODUCT_HANDLE"
#[[ -n "$INPUT_COLLECTION_HANDLE" ]] && export SHOP_COLLECTION_HANDLE="$INPUT_COLLECTION_HANDLE"
#[[ -n "$INPUT_THEME_ROOT" ]]        && export THEME_ROOT="$INPUT_THEME_ROOT"

# Add global node bin to PATH (from the Dockerfile)
export PATH="$PATH:$npm_config_prefix/bin"

# Authentication creds
export SHOP_ACCESS_TOKEN="$INPUT_ACCESS_TOKEN"

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
else
  export SHOPIFY_PASSWORD="$SHOP_APP_PASSWORD"
fi

shopify login

host="https://${SHOP_STORE#*(https://|http://)}"
theme_root="${THEME_ROOT:-.}"

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

echo ::set-output name=theme_url::$host$query_string
