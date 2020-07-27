import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import { Input, Row, Col, Layout, Steps, Button, message, Dropdown, Menu} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import {ContentApi } from '../api';
import { RequestHelper } from '../utils';

const { Header, Content, Footer } = Layout;
var initView = ['first',];
var contentItem = {
    title: String,
    contentText: String,
    contentLocation: String,
    contentStartDate: Date,
    contentEndDate: Date,
    wisorsService: {
        serviceCategory: String,
        serviceName: String,
        serviceDesc: String,
        providerServicePlan: [
            {
                currentPrice: 0,
                codeValue: { 
                    codeValue: 'cv2'
                }
            }
        ]
    }
}

function Contents (props) {
    useEffect(() => {
        // getUser();
        return () => {
          unmounted.current = true;
          requestHelper.abortAll();
        };
    }, []);

    const unmounted  = useRef(false);
    const requestHelper = new RequestHelper();
      
    const [contentViews, setcontentViews] = useState([contentItem]);
    const [selectedPlan, setPlan] = useState('Select Service Plan');
    
    const selectPlan = (value) => {
        setPlan(selectedPlan => value);
    }
    
    const newContent = (value) => {
        setTimeout(() => {
            setcontentViews(contentViews => [...contentViews, contentItem]);
        }, 500)
    }

    const inputChange = (index, target, value) => {
        switch(target) {
            case 'description':
                contentViews[index].contentText = value;
                break;
            case 'location':
                contentViews[index].contentLocation = value;
                break;
            case 'serviceName':
                contentViews[index].wisorsService.serviceName = value;
                break;
            case 'serviceCategory':
                contentViews[index].wisorsService.serviceCategory = value;
                break;
            case 'serviceDesc':
                contentViews[index].wisorsService.serviceDesc = value;
                break;
        }
    }

    const createContent = () => {
        let data = contentViews[0];
        data.title = 'Intro To Physics';
        data.contentStartDate = new Date();
        data.contentEndDate = new Date();
        let form = {
            providerContent: {}
        };
        form.providerContent = data;

        return requestHelper
        .registerRequest(ContentApi.createContent(form))
        .then(res => {
          console.log('api response ==>', res.data);
          message.success('Content successfully created.');
        })
        .catch(err => {
            if(err.errorMessage.indexOf('ServiceName') > -1) {
                message.error(`Service Name "${data.wisorsService.serviceName}" already exist!`);
            } else {
                message.error('Content create failed.');
            }
        });
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

    return(

        <Content className="container" style={{ padding: '150px 150px 0 150px' }}>
            {
                contentViews.map((view, index) => <Row key={index}>
                    <Col span={16} offset={4}>
                        {/* <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Title</p>
                            </Col>
                            <Col span={10}>
                            <Input placeholder="" onChange={(e) => inputChange(index, 'title', e.target.value)}/>
                            </Col>
                            
                        </Row> */}
                        <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Description</p>
                            </Col>
                            <Col span={10}>
                            <Input onChange={(e) => inputChange(index, 'description', e.target.value)}/>
                            </Col>
                            <Col span={2} offset={3}>
                                <p style={{padding: '5px 0'}}>Plan</p>
                            </Col>
                            <Col span={6}>
                                <Dropdown overlay={menu} placement="bottomCenter">
                                    <Button block>{selectedPlan}</Button>
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Upload</p>
                            </Col>
                            <Col span={10}>
                            <Input onChange={(e) => inputChange(index, 'location',  e.target.value)}/>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Service Name</p>
                            </Col>
                            <Col span={10}>
                            <Input onChange={(e) => inputChange(index, 'serviceName', e.target.value)}/>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Service Category</p>
                            </Col>
                            <Col span={10}>
                            <Input onChange={(e) => inputChange(index, 'serviceCategory',  e.target.value)}/>
                            </Col>
                        </Row>
                        <Row style={{padding:'10px 0'}}>
                            <Col span={3}>
                                <p style={{padding: '5px 0'}}>Service Description</p>
                            </Col>
                            <Col span={10}>
                            <Input onChange={(e) => inputChange(index, 'serviceDesc', e.target.value)}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={13}>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={13} >
                                <Row justify="space-around">
                                    { ((contentViews.length - 1 == index  && index == 0) || contentViews.length - 1 == index) && (
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => newContent(index)}>
                                            Add Content
                                        </Button>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>)
            }
            <Col span={16} offset={4} style={{padding: '20px 0'}}>
                <Row justify="end">
                    <Button type="primary" onClick={() => createContent()}>
                        Submit
                    </Button>
                </Row>
            </Col>
        </Content>
    )
}

export default Contents;