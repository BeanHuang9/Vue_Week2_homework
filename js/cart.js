import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//解構宣告規則
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n; // 多國語系

//定義
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// Activate the locale
// loadLocaleFromURL('../zh_TW.json'); 使用根目錄，但驗證會呈現英文
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// 設定
configure({
  generateMessage: localize('zh_TW'), //切換中文版
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});


const app = Vue.createApp({
  data() {
    return {
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'beanhuang',
      cartData: {},
      products: [],
      productsId: '',
      isLoadingItem: '',

      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },

    };
  },

  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  
  methods: {
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
    
    createOrder() {
      const url = `${this.apiUrl}/api/${this.apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },

  },
  mounted() {
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
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'beanhuang',
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
      this.$emit('add-cart', this.product.id, parseInt(this.qty));
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.mount('#app');
