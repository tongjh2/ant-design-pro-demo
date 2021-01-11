import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Drawer, Table, Modal,Space  } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { ProductInfoItem } from './data.d';
import { adList, updateRule, addAd, removeRule } from './service';

class productInfoComponent extends React.Component{

    state = {
        formValues:{
          id:0,
          name:'',
          type:'',
          position:'',
          sort:'',
          status:'',
        },
        params:{
            pageNo:1,
            pageSize:10,
        },
        data: [],
        pagination: {
            total:0,
            current: 1,
            pageSize: 10,
        },
        loading: false,
        isModalVisible: false
    };


    formRef = React.createRef();
    

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    public componentDidMount() {
        this.getAdList()
    }

    handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
        this.state.params.pageNo = pagination.current        
        this.getAdList()
      };

    private async getAdList(){
        this.setState({ loading: true });
        const { params } = this.state;
        let res = await adList(params)
        console.log(res)
        this.setState({
            loading: false,
            data: res.data.data||[],
            pagination: {
                total: res.data.pagenation.total,
                current: res.data.pagenation.page,
                pageSize: res.data.pagenation.page_size
            }
        })
    }

    public add(){
        this.setState({
            formValues: {},
            isModalVisible:true
        })

        // this.formRef.current.resetFields();
    }

    public edit(item:any){
        console.log(item)
        this.setState({
            formValues: Object.assign({}, item),
            isModalVisible:true
        })
    }

    save = async(values:any)=>{
      const hide = message.loading('正在提交');
        console.log(values)
        let form = Object.assign({},values)
        form.id = this.state.formValues.id

        console.log(values)
        try {
            const res = await addAd(form)
            if(res.status===0){
                this.setState({isModalVisible:false})
                message.success('保存成功')
                this.getAdList()
            }else{
                message.error(res.message)
            }
            hide()
            console.log(res)
        } catch (error) {
            console.log(error)
            hide()            
        }
        
    }

    

    public handleOk(values: any){
        // this.setState({isModalVisible:false})
        console.log(values)
        // this.formRef.current.resetFields();

        this.formRef.current.validateFields((err, values) => {
            if (err) return;//检查Form表单填写的数据是否满足rules的要求
            this.props.onOk(values);//调用父组件给的onOk方法并传入Form的参数。
        })
    }
    public handleCancel(){
        this.setState({isModalVisible:false})
    }

    public render() {
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
          };

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const onFinish = (values: any) => {
            console.log('Success:', values);
          };
        
        const onFinishFailed = (errorInfo: any) => {
          console.log('Failed:', errorInfo);
        };
          
        const columns = [
            {
                title: '广告名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '广告位置',
                dataIndex: 'position',
                key: 'position',
            },
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: '操作',
                dataIndex: 'productState',
                key: 'productState',
                render: (_:any, record:any)=> (
                    <Space size="middle">
                        <a onClick={this.edit.bind(this,record)}>编辑</a>
                    </Space>
                )
            },
        ];

        const { formValues, data, pagination, loading, isModalVisible } = this.state; 
        console.log(formValues)



        return <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增
                </Button>
                <span style={{ marginLeft: 8 }}>               
                </span>
            </div>
             
            <Table 
                dataSource={data} 
                columns={columns} 
                // rowKey="id"
                rowKey={record => record.id}
                loading={loading} 
                pagination={pagination}
                onChange={this.handleTableChange}
            />

            {isModalVisible && <Modal title="新增" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form
                    {...layout}
                    ref={this.formRef} 
                    name="control-ref"
                    initialValues={formValues}
                    onFinish={this.save}
                    onFinishFailed={onFinishFailed}
                    >
                    <Form.Item
                        label="广告名称"
                        name="name"
                        rules={[{ required: true, message: '请输入广告名称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: '请输入类型!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="广告位置"
                        name="position"
                        rules={[{ required: true, message: '请输入广告位置!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        name="sort"
                        rules={[{ required: true, message: '请输入排序!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请输入状态!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>}
        </div>;
    }



}


export default productInfoComponent