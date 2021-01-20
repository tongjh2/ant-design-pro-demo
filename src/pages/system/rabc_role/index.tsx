import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Tree, Table, Modal,Space, Card  } from 'antd';
import React from 'react';
import type {  RabcRoleTypes } from './data.d';
import { rabcRoleForm, rabcRoleAdd, rabcRoleDelete, rabcRoleItem, rabcRoleList, rabcRoleEffective } from './service';
import { rabcRouteList } from '../rabc_route/service';
import { FormInstance } from 'antd/lib/form';
import { RabcRouteParams } from '../rabc_route/data';

class rabcRoleComponent extends React.Component{

    state = {
        formValues:{},
        params:{
            pageNo:1,
            pageSize:100,
        },
        data: [],
        treeData:[],
        defaultCheckedKeys: ([]) as string[],
        loading: false,
        isModalVisible: false
    };

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
        this.getRabcRouteList()
    }

    private async getRabcRouteList(){
        let res = await rabcRouteList({page_size:10000} as RabcRouteParams)
        let treeData =  this.formatTree(res.data.data||[], 0)
        this.setState({treeData})
    }

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
        const { params } = this.state;
        let res = await rabcRoleList(params)
        this.setState({
            loading: false,
            data: (res.data.data||[])
        })
    }

    private add(){
        this.setState({
            defaultCheckedKeys:[],
          formValues: {},
          isModalVisible:true
        })
    }

    private async effective(){        
        try {
            const res = await rabcRoleEffective()
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

    private edit(item:RabcRoleTypes){
        console.log(item) 
        let defaultCheckedKeys = item.route_ids.split(",")
        
        this.setState({
          defaultCheckedKeys,
          formValues: Object.assign({}, item),
          isModalVisible:true
        })
    }

    private async save(values:RabcRoleTypes){
        console.log(values)
        let form = Object.assign({}, this.state.formValues, values)
        try {
            const res = await rabcRoleAdd(form)
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

    private async delete(values:RabcRoleTypes){
      console.log(values)
      try {
        const res = await rabcRoleDelete(values.id||0)
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
                title: '角色名',
                dataIndex: 'name',
                key: 'name',
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

        const { formValues, data, loading, isModalVisible } = this.state; 

        return <Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
            <div style={{ marginBottom: 16,textAlign:'right' }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增角色
                </Button>
                <Button type="primary" onClick={this.effective}  loading={loading} style={{marginLeft:'3px'}}>
                    权限生效
                </Button>
            </div>
             
            <Table 
                size="small"
                bordered
                dataSource={data} 
                columns={columns} 
                rowKey="id"
                loading={loading} 
                pagination={false}                
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
                        label="角色名"
                        name="name"
                        rules={[{ required: true, message: '请输入名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="权限"
                        name="route_ids"
                    >
                        <Tree
                            checkable
                            checkStrictly
                            defaultCheckedKeys={this.state.defaultCheckedKeys}
                            onSelect={this.onSelect}
                            onCheck={this.onCheck}
                            treeData={this.state.treeData}
                            />
                    </Form.Item>
                </Form>
            </Modal> }
        </Card>;
    }

}

export default rabcRoleComponent