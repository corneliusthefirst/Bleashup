
import stores from "../stores";
import { observable, action } from "mobx";
//import { observer } from "mobx-react";

const loginStore = stores.LoginStore
const temploginStore = stores.TempLoginStore

class InitialRouteName {
    constructor(){
        
    }
  
@observable routeName = ""
  
  
 async initialRoute(){
              
      loginStore.getUser().then( user => {
        if(user.password == ""){
          console.warn('signIn page')
          this.routeName = "SignIn"
    
        }else{
          console.warn('Home page')
          this.routeName = "Home"
        }
    
    
      }).catch(error=>{
        
        temploginStore.getUser().then(user=>{
        //if(user != null){
            
            console.warn('EmailVerification page')
            this.routeName = "EmailVerification"
  
          //}
    
         }).catch( error =>{
            this.routeName = "Login"     
            console.warn('Login page')
            
            
            
         }) 
    
      })  
      
     }
  
  
  }
  

  const initialRoute = new InitialRouteName()
  export default initialRoute