import React, { useState, useEffect, useRef } from 'react';
import { Input, Row, Col, Layout, Steps, Button, message, Dropdown, Menu} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';
import { UserApi } from '../api';
import { RequestHelper } from '../utils';

const { Header, Content, Footer } = Layout;
const { Step } = Steps;

var initUser = {
    userType:'parent',
    firstName:"",
    lastName:"",
    phone:"",
    email:"",
    
    userAddresses: [
      {
        addressType: "Home",
        addressLine1: "",
        addressLine2:"",
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phone: "",
        email: ""
      }
    ],
    userInGroups: [
      {
        groupAdmin: true,
        userGroup: {
          groupName: ""
        }
      }
    ],
    // plan: '',
}
var initAddress = {
  postalCode: "",
  addressLine1: "",
  addressType: "Home",
  country: "",
  city: "",
  state: "",
  phone: "",
  email: ""
}

var initService = {
  serviceCategory: "",
  serviceName: "",
  serviceDesc:""
}

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];




function Register (props) {

  useEffect(() => {
    // getUser();
    return () => {
      unmounted.current = true;
      requestHelper.abortAll();
    };
  }, []);

  const unmounted  = useRef(false);
  const requestHelper = new RequestHelper();

  const [user, setUser] = useState({...initUser});
  const [address, setAddress] = useState({...initAddress});
  const [password, setPass] = useState('');
  const [confirmPassword, setRePass] = useState('');
  const [groupName, setGroupName] = useState('');
  const [plan, selectedPlan] =  useState('Select your Service Plan');
  const [current, setState] = useState(0);
  const [serviceViews, setServiceViews] = useState([initService]);
  

  function getUser() {
    return requestHelper
      .registerRequest(UserApi.profile(6))
      .then(res => {
        setUser(user => ({
          ...user,
          ...res.data
        }));
        setAddress(address => ({
          ...address,
          ...res.data.userAddresses[0]
        }));
        setGroupName(groupName => res.data.userInGroups[0].userGroup.groupName);
        console.log('==>', res.data);
      })
  }

  const next = () => {
    if(current === 0) {
      console.log('=======>', password, confirmPassword);
      if(!password || !confirmPassword) {
        message.error('Password is required');
      } else  if(password !== confirmPassword) {
        message.error('Password not match!');
      } else if(password.length < 8) {
        message.error('Password must be more than 8 characters!');
      } else {
        setState(current => ++current);
      }
    } else {
      setState(current => ++current);
    }
  }

  const prev =() => {
    setState(current => --current);
  }

  const newService = () => {
    if(!serviceViews[0].serviceCategory || !serviceViews[0].serviceDesc || !serviceViews[0].serviceName) {
      message.error('All service fields are required!');
      return;
    } else {
      let newService = {
        wisorsService: {}
      };
      newService.wisorsService = serviceViews[serviceViews.length - 1];
      return requestHelper
      .registerRequest(UserApi.createService(newService))
      .then(res => {
          console.log('==>', res, res.data);
          message.success('Service successfully created!');
          setServiceViews(serviceViews => [...serviceViews, initService]);
      })
      .catch(err => {
        if(err.errorMessage.indexOf('Service Name') > -1) {
          message.error(`ServiceName "${serviceViews[serviceViews.length - 1].serviceName}" already exist!`)
        } else {
          message.error('Service creation failed!');
        }
    });
    }
  }

  const selectPlan = (value) => {
    selectedPlan(plan => value);
  }

  const onSubmit = () => {
    address.email = user.email;
    address.phone = user.phone;
    user.userAddresses[0] = address;
    user.userInGroups[0].userGroup.groupName = groupName;
    // user.plan = plan;
    console.log('Create user ====>', user);
    return requestHelper
      .registerRequest(UserApi.createUser(user))
      .then(res => {
        console.log('==>', res.data);
        message.success('Successfully created!')
      })
      .catch(err => {
        console.log('==========>', err.errors[0].arguments[0].code);
        if(err.errors[0].arguments[0].code === 'phone') {
          message.error(`Invalid PhoneNumber!`);
        } else if(err.errors[0].arguments[0].code === 'email'){
          message.error('Invalid Email!');
        } else {
          message.error('Register failed!');
        }
    });
  }

  const changePass = (param, value) => {
    switch(param) {
      case 'password':
        setPass(password => value);
        break;
      case 'rePassword':
        setRePass(confirmPassword => value);
        break;
    }
  }

  const changeProfile = (param, value) => {
    switch(param) {
      case 'firstName':
        setUser(user => ({
          ...user,
          firstName: value
        }));
        break;
      case 'lastName':
        setUser(user => ({
          ...user,
          lastName: value
        }));
        break;
      case 'email':
        setUser(user => ({
          ...user,
          email: value
        }));
        break;
      case 'phone':
        setUser(user => ({
          ...user,
          phone: value
        }));
        break;
      // case 'password':
      //   setUser(user => ({
      //     ...user,
      //     password: value
      //   }));
      //   break;
      //   case 'rePassword':
      //   setUser(user => ({
      //     ...user,
      //     confirmPassword: value
      //   }));
      //   break;
    }
  }

  const changeAddress = (param, value) => {
    switch(param) {
      case 'postalCode':
        setAddress(address => ({
          ...address,
          postalCode: value
        }));
        break;
      case 'line1':
        setAddress(address => ({
          ...address,
          addressLine1: value
        }));
        break;
      case 'line2':
        setAddress(address => ({
          ...address,
          addressLine2: value
        }));
        break;
      case 'streetName':
        setAddress(address => ({
          ...address,
          streetName: value
        }));
        break;
      case 'streetNumber':
        setAddress(address => ({
          ...address,
          streetNumber: value
        }));
        break;
      case 'city':
        setAddress(address => ({
          ...address,
          city: value
        }));
        break;
      case 'state':
        setAddress(address => ({
          ...address,
          state: value
        }));
        break;
      case 'country':
        setAddress(address => ({
          ...address,
          country: value
        }));
        break;
    }
  }

  const changeService = (index, param, value) => {
    switch(param) {
      case 'content':
        serviceViews[index].serviceCategory = value;
        break;
      case 'name':
        serviceViews[index].serviceName = value;
        break;
      case 'desc':
        serviceViews[index].serviceDesc = value;
      break;
    }
  }
  const changeGroupName = (value) => {
    setGroupName(groupName => value);
  }

  

  const menu = (
    <Menu>
      <Menu.Item onClick={() => selectPlan('Wisors Basic')}>
        <a target="_blank" rel="noopener noreferrer">
          Wisors Basic
        </a>
      </Menu.Item>
      <Menu.Item onClick={() => selectPlan('Wisors Plus')}>
        <a target="_blank" rel="noopener noreferrer" >
          Wisors Plus
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Content className="container" style={{ padding: '150px 150px 0 150px' }}>
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title}>
            </Step>
          ))}
        </Steps>
        <div className="steps-content" style={{padding: '120px 0 0 0', height: 'calc(90vh - 200px)'}}>
          {current == 0  && (
            <>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>First  Name</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="First Name" value={user.firstName} onChange={(e) => changeProfile('firstName', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Last Name</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Last Name" value={user.lastName} onChange={(e) => changeProfile('lastName', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Email</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Email" value={user.email} onChange={(e) => changeProfile('email', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Phone</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Phone" value={user.phone} onChange={(e) => changeProfile('phone', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}} >Password</p>
              </Col>
              <Col span={7}>
                 <Input.Password placeholder="Password" value={password} onChange={(e) => changePass('password', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}} >Confirm Password</p>
              </Col>
              <Col span={7}>
                 <Input.Password placeholder="Confirm Password" value={confirmPassword} onChange={(e) => changePass('rePassword', e.target.value)}/>
              </Col>
            </Row>
            </>
          )}

        {current == 1  && (
            <>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Street Number</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Street Number"  value={address.streetNumber} onChange={(e) => changeAddress('streetNumber', e.target.value)}/>
              </Col>
              <Col span={3} offset={2}>
                <p style={{padding: '5px 0'}}>Zip Code</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="" value={address.postalCode} onChange={(e) => changeAddress('postalCode', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Street Name</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Street Name" value={address.streetName} onChange={(e) => changeAddress('streetName', e.target.value)}/>
              </Col>
              <Col span={3} offset={2}>
                <p style={{padding: '5px 0'}}>Address line1</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="" value={address.addressLine1} onChange={(e) => changeAddress('line1', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>City</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="City" value={address.city} onChange={(e) => changeAddress('city', e.target.value)}/>
              </Col>
              <Col span={3} offset={2}>
                <p style={{padding: '5px 0'}}>Address line2</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Address line2" value={address.addressLine2} onChange={(e) => changeAddress('line2', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px 0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>State</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="State" value={address.state} onChange={(e) => changeAddress('state', e.target.value)}/>
              </Col>
            </Row>
            <Row style={{padding: '10px  0'}}>
              <Col span={3} offset={1}>
                <p style={{padding: '5px 0'}}>Country</p>
              </Col>
              <Col span={7}>
                 <Input placeholder="Country" value={address.country} onChange={(e) => changeAddress('country', e.target.value)}/>
              </Col>
              <Col span={6}>
                 {/* <Input placeholder="Country" /> */}
              </Col>
            </Row>
            </>
          )}

          {current == 2 && (
            <>
            <Row >
               <Col span={12}>
                {serviceViews.map((view, index) => 
                  <Row key={index}>
                      <Row style={{padding: '10px 0', width: '100%'}}>
                        <Col span={6} offset={2}>
                        <p style={{padding: '5px 0'}}>Service Name</p>
                        </Col>
                        <Col span={14}>
                          <Input placeholder="Service Name" onChange={(e) => changeService(index,'name', e.target.value)}/>
                        </Col>
                      </Row>
                      <Row style={{padding: '10px 0', width: '100%'}}>
                        <Col span={6} offset={2}>
                        <p style={{padding: '5px 0'}}>Service Description</p>
                        </Col>
                        <Col span={14}>
                          <Input placeholder="Service Description" onChange={(e) => changeService(index, 'desc', e.target.value)}/>
                        </Col>
                      </Row>
                      <Row style={{padding: '10px 0', width: '100%'}}>
                        <Col span={6} offset={2}>
                        <p style={{padding: '5px 0'}}>Service Content</p>
                        </Col>
                        <Col span={14}>
                          <Input placeholder="Service Content" onChange={(e) => changeService(index, 'content', e.target.value)}/>
                        </Col>
                      </Row>
                      <Row justify="space-around" style={{width: '100%'}}>
                        <Col span={18}>
                          <hr></hr>
                        </Col>
                      </Row>
                      <Row justify="space-around" style={{width: '100%'}}>
                        <Col span={4} style={{padding: '10px 0'}}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => newService()}>
                          Add Services
                        </Button>
                        </Col>
                      </Row>
                    </Row>
                )}
              </Col>
              <Col span={12}>
                <Row>
                <Col span={6} offset={2}>
                <p style={{padding: '5px 0'}}>Plan</p>
                </Col>
                <Col span={14}>
                <Dropdown overlay={menu} placement="bottomCenter">
                  <Button block>{plan}</Button>
                </Dropdown>
                </Col>
                </Row>
                <Row style={{padding: '10px 0'}}>
                  <Col span={6} offset={2}>
                  <p style={{padding: '5px 0'}}>Group</p>
                  </Col>
                  <Col span={14}>
                    <Input placeholder="Group Name" value={groupName} onChange={(e) => changeGroupName(e.target.value)}/>
                  </Col>
                </Row>
              </Col>
            </Row>
            </>
          )}
        </div>
        <div className="steps-action">

          <Row justify="end">
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button  type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => onSubmit()}>
              Submit
            </Button>
          )}
          </Row>
        </div>
      </div>
    </Content>
  );
}


export default Register;