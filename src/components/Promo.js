import React, { useState, useEffect, useRef } from 'react';
import { Input, Row, Col, Layout, Steps, Button, message, Dropdown, Menu, DatePicker, Select} from 'antd';
import { PromoApi } from '../api';
import { RequestHelper } from '../utils';

const { Header, Content, Footer } = Layout;


const promo = {
    serviceName: String,
    servicePromotions: {
        promoDescription: String,
        promoStartDate: Date,
        promoEndDate: Date,
        promoCode: String,
        discountAmount: Number,
        promoMultiplier: Number
    }
}

function Promo(props) {

    useEffect(() => {
        return () => {
          unmounted.current = true;
          requestHelper.abortAll();
        };
    }, []);

    const unmounted  = useRef(false);
    const requestHelper = new RequestHelper();

    const inputChange =(param, value) => {
        switch(param) {
            case 'title':
                promo.servicePromotions.promoCode = value;
                break;  
            case 'desc':
                promo.servicePromotions.promoDescription = value;
                break;
            case 'discount':
                promo.servicePromotions.discountAmount = Number(value);
                break;
            case 'multi':
                promo.servicePromotions.promoMultiplier = Number(value);
                break;
        }
    }

    const pickStartDate = (date, dateString) => {
        promo.servicePromotions.promoStartDate = dateString;
    }
    
    const pickEndDate = (date, dateString) => {
        promo.servicePromotions.promoEndDate = dateString;
    }

    const selectService = (value) => {
        promo.serviceName = value;
    }

    const createPromo  =() => {
        let data = promo;
        return requestHelper
        .registerRequest(PromoApi.createPromo(data))
        .then(res => {
          console.log('api response ==>', res.data);
          message.success('Promo successfully created.');
        })
        .catch(err => {
            if(err.errorMessage.indexOf('Promo Code') > -1) {
                message.error(`Promo Code "${promo.servicePromotions.promoCode}" already exist!`);
            } else {
                message.error('Content create failed.');
            }
        });
    }

    return (
    <Content className="container" style={{ padding: '150px 150px 0 150px' }}>
        <Col span={12} offset={6}>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Promo Code</p>
                </Col>
                <Col span={12}>
                    <Input placeholder="" onChange={(e) => inputChange('title', e.target.value)}/>
                </Col>
            </Row>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Promo Description</p>
                </Col>
                <Col span={12}>
                    <Input.TextArea placeholder="" onChange={(e) => inputChange('desc', e.target.value)}/>
                </Col>
            </Row>
            <Row style={{padding: '15px 0 0 0'}} justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Promo Start Date</p>
                </Col>
                <Col span={12}>
                    <DatePicker onChange={pickStartDate}/>
                </Col>
            </Row>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Promo End Date</p>
                </Col>
                <Col span={12}>
                    <DatePicker onChange={pickEndDate}/>
                </Col>
            </Row>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Discount Amount($)</p>
                </Col>
                <Col span={12}>
                    <Input placeholder="" type="number" onChange={(e) => inputChange('discount', e.target.value)}/>
                </Col>
            </Row>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Discount Percent(%)</p>
                </Col>
                <Col span={12}>
                    <Input placeholder="" type="number" onChange={(e) => inputChange('multi', e.target.value)}/>
                </Col>
            </Row>
            <Row justify="space-around">
                <Col span={5} offset={1}>
                    <p style={{padding: '5px 0'}}>Wisors Services</p>
                </Col>
                <Col span={12}>
                    <Select style={{width: '100%'}} onChange={selectService}> 
                        <Select.Option value="health care">Health Care</Select.Option>
                        <Select.Option value="education">Education</Select.Option>
                    </Select>
                </Col>
            </Row>
            <Row justify="space-around" style={{padding: '20px 0 0'}}>
                <Col span={21}>
                    <Row justify="end">
                         <Button type="primary" onClick={() => createPromo()}>Submit</Button>
                    </Row>
                </Col>
            </Row>
        </Col>
    </Content>
    )
}

export default Promo;