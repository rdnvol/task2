class RelatedProducts {
  constructor(elem) {
    this.wrapper = $(elem);
    this.productsContainer = this.wrapper.find('.js-products');
    this.limit = this.wrapper.data('limit');
    this.productId = this.wrapper.data('product-id');
    
    this.initRelatedProducts()
      .then(r => {
        console.log(r);
      })
  }
  
  async initRelatedProducts() {
    const url = `/recommendations/products?section_id=product-recommendations&limit=${this.limit}&product_id=${this.productId}`;
    const response = await fetch(url);
    return await response.json();
  }
  
  productHtml(product) {
    return(
      `<div class="col-sm-6 col-lg-3">
          <div class="product-item text-center">
            <a href="#" class="product-item__img">
              <picture>
                <source data-srcset="{{ 'img-placeholder.png' | asset_img_url:'345x' }}, {{ 'img-placeholder.png' | asset_img_url:'690x' }} 2x" media="(max-width: 767px)" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
                <source data-srcset="{{ 'img-placeholder.png' | asset_img_url:'303x' }}, {{ 'img-placeholder.png' | asset_img_url:'606x' }} 2x" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
                <img data-src="{{ 'img-placeholder.png' | asset_img_url:'303x' }}" class="lazyload" data-sizes="auto" alt="image description" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
              </picture>
            </a>
            <div class="product-item__box">
              <h3 class="product-item__title">
                <a href="#">Your product's name</a>
              </h3>
              <div class="product-item__price">
                <div>$20.00</div>
              </div>
            </div>
          </div>
        </div>`
    )
  }
}

const relatedProductsInit = {
  init(elem) {
    if ($(elem).length > 0) {
      window.product = new RelatedProducts(elem);
    }
  }
};

export default relatedProductsInit;
