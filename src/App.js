import React, {useState, useEffect}  from 'react';
import {useDispatch, useSelector, Provider} from 'react-redux';

import './App.css';
import { Switch, Route } from 'react-router-dom';
import Register from './components/Register';
import { ConnectedRouter } from 'connected-react-router';
import { store, history } from './store/store';

const initValues = {
  message: 'Failed',
  error: false,
  page: 1
}

const App = () => {
  return (
    <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={Register}></Route>
      </Switch>
    </ConnectedRouter>
  </Provider>
  )
}
  // const dispatch = useDispatch();

  // const [status, setStatus] = useState(1);
  // const [values, setValues] = useState({...initValues});
  // const userID = useSelector(state => state.user.id);

  // const getProducts = () => {
  //     const page = values.page;

  // }

  // useEffect(() => {

  // }, []);

 
  // useEffect(() => {
  //     getProducts();
  // }, [values.page]);


  // const onClick = () => {
  //   setStatus(status => (-status));
  //   setValues(values => ({
  //     ...values,
  //     message: 'Success',
  //     error: false

  //   }))
  // };


export default App;
