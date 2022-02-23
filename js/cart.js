import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// const apiUrl = 'https://vue3-course-api.hexschool.io/v2'; 
// const apiPath = 'beanhuang';
 

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'beanhuang',
      cartData: {},
      products: [],
      productsId: '',
      isLoadingItem: '',
    };
  },

  methods: {
    checkAdmin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common.Authorization = token;
      
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html';
        })
    },

    getProducts() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/products/all`)
        .then(res => {
          console.log(res);
          this.products = res.data.products;
        });
    },
    openProductModal(id) {
      this.productsId = id;
      this.$refs.productModal.openModal();
    },
    //取得購物車
    getCart() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
        .then(res => {
          console.log(res);
          this.cartData = res.data.data;
        });
    },
    //加入購物車 / 參數預設值 qty = 1
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`, { data }).then(res => {
          console.log(res);
          this.getCart();
          this.$refs.productModal.closeModal();
          this.isLoadingItem = '';
        });
    },

    //刪除特定
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${id}`)
        .then(() => {
          this.getCart();
          this.isLoadingItem = '';
        });
    },

    //刪除全部
    deleteAllCarts() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
        .then((response) => {
          alert(response.data.message);
          this.getCart();
      }).catch((err) => {
          alert(err.data.message);
      });
    },

    //更新數量
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };

      this.isLoadingItem = item.id;
      axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`, { data })
        .then(res => {
          console.log(res);
          this.getCart(); //重新取得
          this.isLoadingItem = '';
        });
    },
  },
  mounted() {
    this.checkAdmin();
    this.getProducts();
    this.getCart();
  },
});

//註冊元件 $refs
app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    //id有變動就觸發
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${this.id}`)
        .then(res => {
          // console.log(res);
          this.product = res.data.product;
        });
    },
    addToCart() {
      // console.log(this.qty);
      this.$emit('add-cart', this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.mount('#app');
