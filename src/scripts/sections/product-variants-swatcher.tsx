import { h, render } from "preact";
import { register } from "@shopify/theme-sections";

import Product from "../Components/Product/index";

register("product-variants-swatcher", {
  onLoad: function () {
    let product;

    try {
      product = JSON.parse(document.getElementById("product-json").innerHTML);
    } catch (error) {
      console.warn(error);
    }

    console.log("This container", this.container);

    render(<Product product={product} />, this.container);
  },
});
