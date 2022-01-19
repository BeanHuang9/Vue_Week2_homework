import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; 
const path = 'beanhuang';
  
createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      is_err:0,
    }
  },
  methods: {
    login() {
      const api = `${url}/admin/signin`;
      axios.post(api, this.user).then((res) => {
        //console.log(res); 了解後端回來的結構
        const { token, expired } = res.data;
       
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        window.location = 'products.html';
      }).catch((error) => {
        alert('帳號或密碼錯誤!');
        this.is_err = 1;
      });
    },
  },
}).mount('#app');