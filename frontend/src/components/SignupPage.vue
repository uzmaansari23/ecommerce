
<template>
  <center>
  <div class="d-flex justify-center mb-6"><h1>Signup</h1></div>
  <v-card
        class="m-4 pa-4 d-flex justify-center"
    :loading="loading"
    
  max-width="400"
  >
  
  <v-sheet width="300" class="mx-auto">
   <div v-html="mess"> </div>
    <v-form fast-fail @submit.prevent="signup">
      <v-text-field
        v-model="FirstName"
        label="First name"
        :rules="firstNameRules"
      ></v-text-field>

      <v-text-field
        v-model="LastName"
        label="Last name"
        :rules="lastNameRules"
      ></v-text-field>

      <v-text-field
        v-model="Email"
        label="Email"
        :rules="EmailRules"
      ></v-text-field>
      <v-text-field
        v-model="Mobile"
        label="Mobile Number"
        :rules="MobileRules"
      ></v-text-field>
      <v-text-field
      type="password"
        v-model="Password"
        label="Password"
        :rules="PasswordRules"
      ></v-text-field>

      <v-btn type="submit" block class="mt-2">SIGNUP</v-btn>
    </v-form>
  </v-sheet>
  </v-card>
</center>
</template>

<script>

import axios from 'axios'
import { authenticate } from '@/services/Authenticatelogn'
import { useRouter } from 'vue-router'
import { setToken } from '@/services/TokenServices'




export default ({
    name:"SignupPage",
    setup(){
        const router = useRouter()  
          function login(){
            router.push('/login')
          }

          function check(){
            location.reload()
          }
          return{
           
            check,
            login
          }

        },
    created() {
    this.user=authenticate()
    const router = useRouter()
    console.log("hi this is signup")
    if(this.user=== null){
      router.push('/signup')
    }
    else{
      router.push('/')
    }
    
  },
    data:()=>({
      user:null,
      mess:'',
      FirstName: '',
      firstNameRules: [
        value => {
          if (value.trim()!='') return true

          return 'First name can not be empty.'
        },
      ],
      LastName: '',
      lastNameRules: [
        value => {
          if (value.trim()!='') return true

          return 'Last name can not be empty.'
        },
      ],

      Email: '',
      EmailRules: [
        value => {
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true

          return 'Email a valid email.'
        },
      ],

      Mobile: '',
      MobileRules: [
      value => {
          if (/^\d{10}$/.test(value)) return true

          return 'Invalid Mobile Number.'
        },
      ],

      Password: '',
      PasswordRules: [
        value => {
          if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(value)) return true

          return 'Password is weak.'
        },
      ],
    }),
    methods:{
        signup(){
          if(this.FirstName.trim()=='' || this.LastName.trim()==''||this.Email.trim()==''|| this.Password.trim()==''){
            this.mess="Please Fill all the necessary details."
          }else{

            const url="http://localhost:5000/user/signup"
            const data = { 
                FirstName:this.FirstName,
                LastName:this.LastName,
                Email:this.Email,
                Mobile:this.Mobile,
                Password:this.Password

            }
            axios.post(url, data)
                .then(response => {
                 console.log(response.data);
                 if(response.data.user===0){
                  this.mess=`<p>Email Already Exists. Try <i> <a  href="/">Login</a></i></p>`
             
                 }else{
                 setToken(JSON.stringify(response.data.user))
    console.log("redirecting")
    this.check()}
                })
                 .catch(error => {
                   console.error(error);
                    });

        }}

    },
   
})
</script>

<style scoped>

.hover-underline-animation {
  display: inline-block;
  position: relative;
  color: blue;
}

.hover-underline-animation:after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: blue;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

</style>