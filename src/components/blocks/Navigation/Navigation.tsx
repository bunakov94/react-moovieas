import React from 'react';
import { Tabs } from 'antd';
import Search from '../Search';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

const Navigation = ({ onChangeInput, searchValue }: any) => (
  <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Search" key="1">
      <Search onChangeInput={onChangeInput} searchValue={searchValue} />
    </TabPane>
    <TabPane tab="Rated" key="2" />
  </Tabs>
);

export default Navigation;
