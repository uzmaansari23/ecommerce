<template>
  <center>
    <div>
      <div class="d-flex justify-center mb-6"><h1>Login</h1></div>
      <v-card
        class="m-4 pa-4 d-flex justify-center"
    :loading="loading"
    
  max-width="400"
  >
        <v-sheet width="300" class="mx-auto">
        <v-form fast-fail @submit.prevent="login">
          {{ mess }}
          <v-text-field
        v-model="Email"
        label="Email"
        :rules="EmailRules"
      ></v-text-field>
    
      <v-text-field
      type="password"
        v-model="Password"
        label="Password"
        :rules="PasswordRules"
      ></v-text-field>
     Alreay a user?  <button class="hover-underline-animation" @click="signup"><i>Signup</i></button>
          <v-btn color="blue" type="submit"  block class="mt-2">LOGIN</v-btn>
          
        </v-form>
      </v-sheet>
      </v-card>
      
    </div>
  </center>
    </template>
    
    
    <script>
    import axios from 'axios';
    import { setToken } from '@/services/TokenServices';
    import { authenticate } from '@/services/Authenticatelogn'
    import { useRouter } from 'vue-router';

    




    export default{
        name:"LoginPage",

        setup(){
          const router = useRouter()
          function signup(){
            router.push("/signup")
          }

          function check(){
            location.reload();
          }
          return{
            signup,
            check
          }

        },

        created() {
    this.user=JSON.parse(authenticate())
    const router = useRouter()
    
    if(this.user=== null){
      router.push('/login')
    }
    else{
      if(this.user.role=='admin'){
      router.push('/adminView')
      }
      else{
        router.push('/')
      }
    }
    
  },
        data:()=>({
          
      
      user:null,
      mess:null,
      Email: '',
      EmailRules: [
        value => {
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true

          return 'Enter a valid Email.'
        },
      ],
      router:null,
 

      Password: '',
      PasswordRules: [
        value => {
          if (value!='') return true

          return 'Password can not be empty'
        },
      ],
    }),
        
        methods:{
          login(){
              if(this.Email.trim()==''|| this.Password.trim()==''){
                this.mess = "Please Fill the neccessary fields."
              }else{

            

              const url="http://localhost:5000/user/login"
              const data={
                Email:this.Email,
                Password:this.Password
              }
              axios.post(url, data)
  .then(response => {
    console.log(response);
    if(response.data.user===0){
     this.mess= "User Doesn't Exist"
    }
    else if(response.data.user===1){
      this.mess ="Password Incorrect"
    }
    else{
    setToken(JSON.stringify(response.data.user))
    console.log("redirecting")
    
    this.check()
    }

   
  })
  .catch(error => {
    console.error(error);
  });}}

   
           
        },
     


    }
    
    
    
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