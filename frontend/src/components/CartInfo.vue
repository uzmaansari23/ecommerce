<template>
    <center>
      <div v-if="showCart">
    <h1>This is my cart</h1>
   
    <div v-for="item in cartInfo" :key="item.product_id" >
       
        
       
        &nbsp;&nbsp;
      
        <v-card width="600" class="horizontal-layout">
      <template v-slot:title>
        {{ item.name }}
      </template>

      <template v-slot:subtitle>
        No. of Items:{{ item.quantity }}
      </template>

      <template v-slot:text>
       Amount: {{ item.amount }}
      </template>
      
        &nbsp;&nbsp;&nbsp;&nbsp;
        <v-btn color="error" size="small" icon @click="deleteImage(item.product_id,email)">
    <v-icon>mdi-delete</v-icon>
   
  </v-btn>
  &nbsp;&nbsp;&nbsp;&nbsp;

      </v-card>
       
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
    <v-card width="600" class="horizontal-layout">
      <template v-slot:title>
        Total Amount
      </template>

  

      <template v-slot:text>
       Amount: {{ amount }}
      </template>
      <v-btn v-if="amount>0" color="success" @click="showAddress">
            Checkout
        </v-btn>
        &nbsp;&nbsp;&nbsp;&nbsp;
   
  &nbsp;&nbsp;&nbsp;&nbsp;

      </v-card>

      &nbsp;&nbsp;&nbsp;&nbsp;
   
   &nbsp;&nbsp;&nbsp;&nbsp;
  </div>
   <div v-if="showAddressForm" style="width:500px">
    <h1>Enter your Address</h1>
      <v-form @submit.prevent="submitAddress">{{ mess }}
        <v-text-field

v-model="address"
label="Enter Address"
:rules="AddressRules"



></v-text-field>

<v-btn type='submit' color="blue" >Submit</v-btn>
&nbsp;
        <v-btn color="error" @click="showAddressForm = false , showCart = true">Cancel</v-btn>
      </v-form>
    </div>


<div class="payment-form" style="width:500px;margin-top:20px" v-if="showapayment">

    <h2 class="form-title">Payment Information</h2>
    <form @submit.prevent="submitPayment">
      <div class="form-group">
        <label for="card-number" class="form-label">Card Number:</label>
        <input type="text" id="card-number" class="form-input" v-model="cardNumber" required>
      </div>
      <div class="form-group">
        <label for="expiry" class="form-label">Expiry Date:</label>
        <input type="text" id="expiry" class="form-input" v-model="expiry" required>
      </div>
      <div class="form-group">
        <label for="cvv" class="form-label">CVV:</label>
        <input type="text" id="cvv" class="form-input" v-model="cvv" required>
      </div>
      <div class="form-group">
        <label for="name" class="form-label">Name:</label>
        <input type="text" id="name" class="form-input" v-model="name" required>
      </div>
      <button type="submit" class="form-btn">Pay {{ amount }}</button>
    </form>
  </div>
</center>
</template>

<script>

import { authenticate } from '@/services/Authenticatelogn'
import axios from 'axios';
import { useRouter } from 'vue-router'


export default{
    data(){
      
        return{
          mess:'',
          showCart:true,
          showAddressForm: false,
          showapayment:false,
            cartInfo:[],
            user:null,
            email:'',
            amount:0,
            address:'',
            AddressRules:[
            value => {
          if (value.trim()!='') return true
          return 'Address can not be empty.'
        },
            ]
        }
    },
    setup(){
      const router = useRouter()
      function calculateAmount(products){
        if(products.length==0){
          this.amount =0
        }else{
            for(let i = 0;i<products.length;i++){
              this.amount = this.amount+products[i].amount;
            }
          }

      }

      function redirect(){
             router.push('/purchasedHistory')
      }
      
      return{
        calculateAmount,
        redirect
      }
    },

    mounted(){
        this.user=JSON.parse(authenticate())
        
        const router = useRouter()
        if(this.user){

       this.getCartInfo(this.user.email); 
       this.email=this.user.email
       
        }else{
            router.push('/')
        }
      },




    methods:{
      showAddress(){
        this.showAddressForm= true
        this.showCart=false
      },
      submitAddress() {
   
      console.log(this.address);
      if(this.address.trim()==''){
        this.mess = "Please fill the address."
      }else{
  
      this.showAddressForm = false;
      this.showapayment = true;
      }
    },
        getCartInfo(email){
            console.log(email)
            const data ={
                email:email
            }
            axios.post('http://localhost:5000/product/cartinfo',data)
  .then(response => {

    this.cartInfo=response.data
    this.calculateAmount(this.cartInfo)
  })
  .catch(error => {
    console.error(error);
  });
        },

 submitPayment(){
    

    const url="http://localhost:5000/product/checkout"
              const data={
              cartInfo:this.cartInfo,
              address:this.address
              }
              axios.post(url, data)
  .then(response => {

   console.log(response)

   this.redirect()
   
  })
  .catch(error => {
    console.error(error);
  });
 },
 deleteImage(id,email){
  const data={
    product_id:id,
    email:email
  }
  axios.post('http://localhost:5000/product/deleteCart',data)
  .then(response=>{
    console.log(response)
    this.calculateAmount(this.cartInfo.filter((cart)=>cart.product_id!=id))
    this.cartInfo= this.cartInfo.filter((cart)=>cart.product_id!=id)
    
    
  })
  .catch(error=>{
    console.log(error)
  })
 }
    }
}
</script>

<style>
.horizontal-layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}



.payment-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-title {
  margin-top: 0;
}

.form-group {
  margin-bottom: 10px;
}

.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-input {
  display: block;
  width: 100%;
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #008CBA;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-btn:hover {
  background-color: #005F6B;
}

</style>