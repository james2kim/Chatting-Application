import React, {useState} from "react";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import {AuthenticationService} from './Services/AuthenticationService'
import './App.css'
import Home from './Containers/Home/Home'
import Chat from './Containers/Chat/Chat'
import Account from './Containers/Account/Account'

const App = (props) => {
  const currentUser = useState(AuthenticationService.currentUserValue);


  const titleCaseString = str => {
    if (!str) return

    const lowerCase = str.toLowerCase()
    const splitStr = lowerCase.split(' ')
  
    for (let i = 0; i < splitStr.length; i++) {
      let temp = splitStr[i].split('')
      temp[0] = temp[0].toUpperCase()
      splitStr[i] = temp.join('')
    }
    return splitStr.join(' ')
  }


  let routes; 
  if (currentUser[0]) 
    {
      routes = (
        <Switch>
              <Route 
                path="/account" 
                render={(props) => 
                  <Account 
                    {...props} 
                    currentUser={currentUser} 
                    titleCaseString={titleCaseString }/>}/>
              <Route 
                path="/chat" 
                render={(props) => 
                  <Chat {...props} />} /> 
              <Redirect to="/chat" />
        </Switch>
      )
    } 
  else  
    {
       routes = (
        <Switch>
           <Route 
              path="/" 
              exact 
              render={(props) => 
                <Home 
                  {...props} 
                  titleCaseString={titleCaseString}/>}/>  
           <Redirect to="/" />
        </Switch>
       )
    }

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <BrowserRouter>
            {routes}
          </BrowserRouter>
    </SnackbarProvider>
  )
}

export default App;


