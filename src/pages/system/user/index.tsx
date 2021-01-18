import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Select, Table, Modal,Space, Card  } from 'antd';
import React from 'react';
import type {  UserTypes,UserParams } from './data.d';
import { userForm, userAdd, userDelete, userItem, userList } from './service';
import { rabcRoleList } from '../rabc_role/service';
import { FormInstance } from 'antd/lib/form';
import { RabcRouteParams } from '../rabc_route/data';
import { RabcRoleTypes } from '../rabc_role/data';
const { Option } = Select;

class userComponent extends React.Component{

    state = {
        formValues:{},
        data: [],        
        pagination: {
            total:0,
            current: 1,
            pageSize: 10,
        },
        rabcRoleList:[],
        defaultCheckedKeys: ([]) as string[],
        loading: false,
        isModalVisible: false
    };

    
    params:UserParams = {
        page:1,
        page_size:10,
    }

    formRef  = React.createRef<FormInstance>()   

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
            defaultCheckedKeys:[],
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

        const { formValues, data, pagination, loading, isModalVisible } = this.state; 

        return <Card size="small" style={{ width: '100%',marginBottom:16 }}>
            <div style={{ marginBottom: 16,textAlign:'right' }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增
                </Button>
            </div>
             
            <Table 
                size="small"
                dataSource={data} 
                columns={columns} 
                rowKey="id"
                loading={loading} 
                pagination={pagination}  
                onChange={this.handleTableChange}              
            />
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
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                            <Option value="0">未知</Option>
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
                                <Option value="{v.id}" key={v.id}>{v.name}</Option>
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
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                            <Option value="0">未知</Option>
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
        </Card>;
    }

}

export default userComponent