import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Select, Table, Modal,Space, Card, DatePicker  } from 'antd';
import React from 'react';
import type {  UserTypes,UserParams } from './data.d';
import { userForm, userAdd, userDelete, userItem, userList, userUpdateStatus } from './service';
import { rabcRoleList } from '../rabc_role/service';
import { FormInstance } from 'antd/lib/form';
import { RabcRouteParams } from '../rabc_route/data';
import { RabcRoleTypes } from '../rabc_role/data';
import { storeList } from '../store/service';
import { StoreParams } from '../store/data';
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

class userComponent extends React.Component{

    state = {
        formValues:{},
        data: [],        
        pagination: {
            total:0,
            current: 1,
            pageSize: 10,
        },
        storeList: [],
        rabcRoleList:[],
        selectedRowKeys: [],
        loading: false,
        isModalVisible: false,
        isUpdateStatus: false,        
    };

    
    params:UserParams = {
        page:1,
        page_size:10,
    }

    formRef  = React.createRef<FormInstance>()   
    formRefUpdateStatus  = React.createRef<FormInstance>()   

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        this.getList()
        this.getRabcRoleList()
        this.geStoreList()
    }

    private async geStoreList(){
        let res = await storeList({page_size:10000} as StoreParams)
        this.setState({storeList: (res.data.data||[]) })
    }

    private async getRabcRoleList(){
        let res = await rabcRoleList({page_size:10000} as RabcRouteParams)
        this.setState({rabcRoleList: (res.data.data||[]) })
    }

    handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
        this.params.page = pagination.current  
        this.params.page_size = pagination.pageSize      
        this.getList()
      };

    private formatTree(data:any[],pid:number){
        let arr:any[] = []
        data.forEach((v:any)=>{
            if(v.pid===pid){
                v.key = v.id+''
                v.title = v.name
                v.children = this.formatTree(data,v.id)
                arr.push(v)
            }
        })
        return arr
    }

    private async getList(){
        this.setState({ loading: true });
        let res = await userList(this.params)
        this.setState({
            loading: false,
            data: (res.data.data||[]),
            pagination: {
                total: res.data.pagenation.total,
                current: res.data.pagenation.page,
                pageSize: res.data.pagenation.page_size
            }
        })
    }

    private add(){
        this.setState({
          formValues: {},
          isModalVisible:true
        })
    }

    private edit(item:UserTypes){        
        this.setState({
          formValues: Object.assign({}, item),
          isModalVisible:true
        })
    }

    private async save(values:UserTypes){
        console.log(values)
        let form = Object.assign({}, this.state.formValues, values)
        try {
            const res = await userAdd(form)
            if(res.status===0){
                this.setState({isModalVisible:false})
                message.success('保存成功')
                this.getList()
            }else{
                message.error(res.message)
            }
            console.log(res)
        } catch (error) {
            console.log(error)            
        }        
    }

    private async delete(values:UserTypes){
      console.log(values)
      try {
        const res = await userDelete(values.id||0)
        if(res.status===0){
            message.success('操作成功')
            this.getList()
        }else{
            message.error(res.message)
        }
        console.log(res)
      } catch (error) {
        console.log(error)            
      } 
    }

    private async handleSubmit(event:React.MouseEvent<HTMLElement, MouseEvent>){
      event.preventDefault()
      try {
        const values = await this.formRef.current?.validateFields();
        this.save(values);
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        message.warn('提交校验失败')
      }
    }

    
    onSelect = (e:any)=>{
        console.log(e)
    }

    onCheck = (e:any)=>{
        console.log(e.checked)
        this.formRef.current?.setFieldsValue({route_ids: e.checked.join(',')})
    }

    changeTableRow = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        this.setState({selectedRowKeys})
        console.log(`---------------------selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }

    updateStatus = async()=> {
        console.log(this.state.selectedRowKeys)
        try {
            const values = await this.formRefUpdateStatus.current?.validateFields();
            this.updateStatusSubmit(values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    updateStatusSubmit = async(values:any)=>{
        console.log(values)
        try {
            await userUpdateStatus(this.state.selectedRowKeys.join(',') ,values.status)
            message.success('操作成功')
            this.setState({isUpdateStatus:false})
            this.getList()
        } catch (error) {
            message.error('操作失败'+error.message)
        }
    }

    search = (values:any)=>{
        this.params = Object.assign({},this.params,values,{page:1})
        this.getList()
    }

    changeDate = (e:any,date:string[])=>{
		this.params.start_time = date[0];
		this.params.end_time = date[1];
	}


    public render() {
          
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '所属门店',
                dataIndex: 'store_name',
                key: 'store_name',
            },
            {
                title: '管理门店',
                dataIndex: 'manage_store_name',
                key: 'manage_store_name',
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '角色',
                dataIndex: 'role_name',
                key: 'role_name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(_:any, record:any)=>( record.create_time.replace(/[TZ]|\+08:00/g,' ') )
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render:(_:any, record:any)=>(record.status===0?'在职':'离职')
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

        const { formValues, data, pagination, loading, isModalVisible, isUpdateStatus } = this.state; 

        return <Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
                    <Form layout="inline"
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    style={{marginBottom:15}}
                    onFinish={this.search}
                    >
                    <Form.Item name="store_id" label="门店">
                        <Select showSearch allowClear style={{width:180}}>
                            {this.state.storeList.map((v:any)=>(<Option value={v.id} key={v.id}>{v.name}</Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="q" label="姓名">
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="手机号">
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="角色">
                        <Select showSearch allowClear style={{width:180}}>
                            {this.state.rabcRoleList.map((v:RabcRoleTypes)=>(
                                <Option value={v.id+''} key={v.id}>{v.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="状态">
                        <Select showSearch allowClear style={{width:180}}>
                            <Option value={1}>离职</Option>
                            <Option value={0}>在职</Option>
                        </Select>
                    </Form.Item>
                    {/* <Form.Item label="创建日期">
                        <RangePicker format={'YYYY-MM-DD'} onChange={this.changeDate} />
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                    <Form.Item style={{width:300,flex:1,textAlign:'right'}}>
                        <Button type="primary" onClick={this.add}  loading={loading} style={{marginLeft:'3px'}}>
                            <PlusOutlined />
                            新增
                        </Button>
                    </Form.Item>
                </Form>
             
            <Table 
                size="small"
                bordered
                dataSource={data} 
                columns={columns} 
                rowSelection={{ onChange: this.changeTableRow }}
                rowKey="id"
                loading={loading} 
                pagination={pagination}  
                onChange={this.handleTableChange}              
            />
            <div style={{ width:200, marginTop: -40}}>
                <Button type="primary" onClick={()=>{ this.setState({isUpdateStatus:true}) }} disabled={this.state.selectedRowKeys.length==0} loading={loading}>
                    状态设置
                </Button>
            </div>

            {isModalVisible && <Modal title="编辑" visible={isModalVisible} onOk={this.handleSubmit} onCancel={()=>{this.setState({isModalVisible:false})}}>
                <Form
                    labelCol= {{ span: 4 }}
                    wrapperCol= {{ span: 20 }}
                    name="form"
                    ref={this.formRef}  
                    initialValues={formValues}
                    onFinish={this.save}
                    >
                    <Form.Item
                        label="门店"
                        name="store_id"
                        rules={[{ required: true, message: '请输入门店!' }]}
                    >
                        <Select showSearch allowClear>
                            {this.state.storeList.map((v:any)=>(<Option value={v.id} key={v.id}>{v.name}</Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[{ required: true, message: '请选择角色!' }]}
                    >
                        <Select showSearch allowClear>
                            {this.state.rabcRoleList.map((v:RabcRoleTypes)=>(
                                <Option value={v.id} key={v.id}>{v.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="电话"
                        name="phone"
                        rules={[{ required: true, message: '请输入电话!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="年龄"
                        name="age"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="sex"
                    >
                        <Select showSearch allowClear>
                            <Option value={1}>男</Option>
                            <Option value={2}>女</Option>
                            <Option value={0}>未知</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="工龄"
                        name="gong_ling"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="地址"
                        name="address"
                    >
                        <Input />
                    </Form.Item>                    
                </Form>
            </Modal> }


            {isUpdateStatus && <Modal title="编辑" visible={isUpdateStatus} onOk={this.updateStatus} onCancel={()=>{this.setState({isUpdateStatus:false})}}>
                <Form
                    labelCol= {{ span: 4 }}
                    wrapperCol= {{ span: 20 }}
                    name="form"
                    ref={this.formRefUpdateStatus}
                    onFinish={this.updateStatus}
                    >                   
                    <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态!' }]}>
                        <Select showSearch allowClear>
                            <Option value={1}>离职</Option>
                            <Option value={0}>在职</Option>
                        </Select>
                    </Form.Item>                   
                </Form>
            </Modal> }

        </Card>;
    }

}

export default userComponent