Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
      <div class="product" >
        <div class="product-image">
          <img v-bind:src="image" alt="green vue socks" />
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <span v-if="onSale">{{ onSaleMsg }}</span>
          <p v-if="inStock">In Stock</p>
          <p v-else :class="{linethrough: !inStock}">
            Out of Stock
          </p>
          <p>Shipping: {{shipping}}</p>
          <p>{{ description }}</p>
          <ul>
            <li v-for="size in sizes">{{size}}</li>
          </ul>
          <product-info :details='details'></product-info>
          <div
            v-for="(variant, idx) in variants"
            :key="variant.id"
            class="color-box"
            :style="{backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(idx)"
          ></div>

          <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{disabledButton: !inStock}"
          >
            Add to Cart
          </button>
          <button
            @click="removeFromCart"
          >
            Remove From Cart
          </button>
        </div>

        <div>
          <h2>Reviews</h2>
          <p v-if='!reviews.length'>There are no reviews yet.</p>
          <ul>
            <li v-for='review in reviews'>
              <p>{{ review.name }}</p> 
              <p>Rating: {{ review.rating }}</p> 
              <p>{{ review.review }}</p> 
            </li>
          </ul>
        </div>

        <product-review @add-product-review="updateReviews"></product-review>
      </div>
  `,
  data() {
    return {
      brand: 'MU',
      product: 'Socks',
      details: ['80% cotton', '20% polyester', 'Gender neutral'],
      sizes: ['small', 'medium', 'large'],
      variants: [
        {
          variantColor: 'green',
          id: 123432,
          variantImage: './assets/socks-green.jpg',
          inventory: 10,
          onSale: true,
        },
        {
          variantColor: 'blue',
          id: 2103498,
          variantImage: './assets/socks-blue.jpg',
          inventory: 5,
          onSale: false,
        },
      ],
      description: 'some info about these amazing socks',
      selectedVariant: 0,
      homepage: 'https://hello.joshmu.com',
      reviews: [],
    }
  },
  methods: {
    addToCart() {
      this.variants[this.selectedVariant].inventory--
      this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
    },
    updateProduct(idx) {
      this.selectedVariant = idx
    },
    updateReviews(review) {
      console.log('update reviews!', review)
      this.reviews.push(review)
    },
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].inventory
    },
    onSale() {
      return this.variants[this.selectedVariant].onSale
    },
    onSaleMsg() {
      return `${this.brand}'s ${this.product} on sale for a limited time only!`
    },
    shipping() {
      if (this.premium) {
        return 'free'
      }
      return '$2.99'
    },
  },
})

Vue.component('product-info', {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <ul>
      <li v-for="detail in details">{{detail}}</li>
    </ul>
  `,
})

Vue.component('product-review', {
  template: `
  <form class='review-form' @submit.prevent='onSubmit'>

  <p v-if='errors.length'>
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for='error in errors'>{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for='name'>Name:</label>
    <input id='name' v-model='name'>
  </p>

  <p>
    <label for='review'>Review:</label>
    <textarea id='review' v-model='review'></textarea>
  </p>

  <p>
    <label for='rating'>Rating:</label>
    <select id='rating' v-model.number='rating'>
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    Would you recommend this product?
    <br/>
    <label for='yes'>Yes</label>
    <input type='radio' id='recommend' v-model='recommend' value='yes' name='yes'>
    <label for='no'>No</label>
    <input type='radio' id='recommend' v-model='recommend' value='no' name='no'>
  </p>

  <p>
    <input type='submit' value='Submit'>
  </p>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        const productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommended,
        }
        this.$emit('add-product-review', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
        this.errors = []
      } else {
        this.errors = []
        if (!this.name) this.errors.push('Name required.')
        if (!this.review) this.errors.push('Review required.')
        if (!this.rating) this.errors.push('Rating required.')
        if (!this.recommend) this.errors.push('Recommendation required.')
      }
    },
  },
  computed: {
    recommended() {
      return this.recommend === 'yes'
    },
  },
})

Vue.config.devtools = true

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeFromCart(id) {
      this.cart = this.cart.filter((product) => product !== id)
    },
    clearCart() {
      this.cart = []
    },
  },
})
