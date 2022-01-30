import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//宣告在外面 createApp 裡面要把this. 拿掉
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'; 
const apiPath = 'beanhuang';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      products: [],
      addNewProduct: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods: {
    checkLogin() {
      const url = `${apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html';
        })
    },
    getData() { //取得所有產品列表
      const url = `${apiUrl}/api/${apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    openProduct(item) {
      this.tempProduct = item;
    },

    checkProducts() {//更新產品
      //請求方式寫成變數主要是為了流程判斷
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = 'post';

      if (!this.addNewProduct) { //如果產品就變更
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData(); //重渲染
      }).catch((err) => {
        alert(err.data.message);
      })
    },

    //建立新產品
    openModal(addNewProduct, item) {
      if (addNewProduct === 'new') {//addNewProduct若是新的,this.tempProduct建立
        this.tempProduct = {
          imagesUrl: [],
        };
        this.addNewProduct = true;
        productModal.show();
      } else if (addNewProduct === 'edit') { // 修改已新增過的產品
        this.tempProduct = { ...item };
        this.addNewProduct = false;
        productModal.show();
      } else if (addNewProduct === 'delete') { //刪除已新增過的產品
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },

    delProduct() {//刪除產品
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },


  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    this.checkLogin() //確認登入狀態
  }
}).mount('#app');