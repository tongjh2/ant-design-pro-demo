import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Popconfirm, Table, Modal,Space, Card  } from 'antd';
import React from 'react';
import type {  RabcRouteTypes } from './data.d';
import { rabcRouteForm, rabcRouteAdd, rabcRouteDelete, rabcRouteList } from './service';
import { FormInstance } from 'antd/lib/form';

class rabcRouteComponent extends React.Component{

    state = {
        formValues:{},
        params:{
            pageNo:1,
            pageSize:100,
        },
        data: [],
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
    }
    private async getList(){
        this.setState({ loading: true });
        const { params } = this.state;
        let res = await rabcRouteList(params)
        let treeData = this.formatTree((res.data.data||[]), 0)
        this.setState({
            loading: false,
            data: treeData
        })
    }

    private formatTree(data:any[],pid:number){
        let arr:any[] = []
        data.forEach((v:any)=>{
            if(v.pid===pid){
                v.key = v.id
                v.children = this.formatTree(data,v.id)
                arr.push(v)
            }
        })
        return arr
    }

    private add(){
        this.setState({
          formValues: {},
          isModalVisible:true
        })
    }

    private addChildren(item: RabcRouteTypes){
      console.log(item) 
      let formValues = Object.assign({}, rabcRouteForm)  
      formValues.id = undefined
      formValues.pid = item.id||0      
      this.setState({
        formValues,
        isModalVisible:true
      })
    }

    private edit(item:RabcRouteTypes){
        console.log(item)        
        this.setState({
          formValues: Object.assign({}, item),
          isModalVisible:true
        })
    }

    private async save(values:RabcRouteTypes){
        console.log(values)
        let form = Object.assign({}, this.state.formValues, values)
        try {
            const res = await rabcRouteAdd(form)
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

    private async delete(values:RabcRouteTypes){
      console.log(values)
      try {
        const res = await rabcRouteDelete(values.id||0)
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

    public render() {
          
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '路由',
                dataIndex: 'content1',
                key: 'content1',
            },
            {
                title: '菜单',
                dataIndex: 'content2',
                key: 'content2',
            },
            {
                title: '数据',
                dataIndex: 'content3',
                key: 'content3',
            },
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title: '操作',
                dataIndex: 'productState',
                key: 'productState',
                render: (_:any, record:any)=> (
                    <Space size="middle">
                      <a onClick={this.edit.bind(this,record)}>编辑</a>
                      <a onClick={this.addChildren.bind(this,record)}>添加子集</a>
                      <Popconfirm title="确定删除本条数据吗？" onConfirm={this.delete.bind(this,record)} okText="是" cancelText="否">
                          <a>删除</a>
                      </Popconfirm>
                    </Space>
                )
            },
        ];

        const { formValues, data, loading, isModalVisible } = this.state; 

        return <Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
            <div style={{ marginBottom: 16,textAlign:'right' }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增
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
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: '请输入名称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="路由"
                        name="content1"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="菜单"
                        name="content2"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="数据"
                        name="content3"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        name="sort"
                        rules={[{ required: true, message: '请输入排序数字，越小越靠前!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal> }
        </Card>;
    }

}

export default rabcRouteComponent