import { PlusOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Form, Input, Select, Table, Modal,Space,Popconfirm,Card,Row, Col,Upload   } from 'antd';
import React from 'react';
import type { AdItem } from './data.d';
import { adList, addAd, adDelete } from './service';
import { FormInstance } from 'antd/lib/form';
const { Option } = Select;

class productInfoComponent extends React.Component{

    state = {
        formValues:{
          id:0,
          name:'',
          type:'',
          position:'',
          content:'',
          content1:'',
          content2:'',
          sort:'',
          status:'',
        },
        params:{
            position:'',
            status:'',
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

    formRef  = React.createRef<FormInstance>()    
    fileList:any[] = []

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    public componentDidMount() {
        this.getList()
    }

    handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
        this.state.params.pageNo = pagination.current        
        this.getList()
      };

    search = (values:any)=>{
        this.state.params = Object.assign(this.state.params,values)
        this.state.params.pageNo = 1
        this.getList()
    }

    private async getList(){
        this.setState({ loading: true });
        const { params } = this.state;
        let res = await adList(params)
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
        this.fileList = []
        this.setState({
            formValues: {},
            isModalVisible:true
        })

        // this.formRef.current.resetFields();
    }

    public edit(item:any){
        console.log(item)
        let content = JSON.parse(item.content||'[]')
        item.content1 = content.content1;
        item.content2 = content.content2;

        this.fileList = []
        if(item.content1){
            this.fileList = [{
                uid: this.fileList.length+1,
                name: "banner",
                status: 'done',
                url: item.content1
            }]
        }

        this.setState({
            formValues: Object.assign({}, item),
            isModalVisible:true
        })
    }

    save = async(values:any)=>{
      const hide = message.loading('正在提交');
        console.log(values, this.fileList)
        let form = Object.assign({},values)
        form.id = this.state.formValues.id
        if(this.fileList.length>0){
            let [img] = this.fileList
            form.content1 = img.url
        }
        let content = {
            content1:form.content1,
            content2:form.content2,
        }
        form.content = JSON.stringify(content); 
        try {
            const res = await addAd(form)
            if(res.status===0){
                this.setState({isModalVisible:false})
                message.success('保存成功')
                this.getList()
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

    handleOk = async (event:React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault()
        try {
          const values = await this.formRef.current?.validateFields();
          this.save(values);
        } catch (errorInfo) {
          console.log('Failed:', errorInfo);
          message.warn('提交校验失败')
        }
    }

    delete = async(item:AdItem)=>{
        try { 
            await adDelete(item.id||0);
            message.success('操作成功')
            this.getList()
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            message.warn('操作失败')
        }
    }
    
    public handleCancel(){
        this.setState({isModalVisible:false})
    }

    upload = (e:any)=>{
        if(e.file.status==='done'){
            let url = e.file.response.data.url
            this.fileList = [{
                uid: this.fileList.length+1,
                name: e.file.name,
                status: 'done',
                url
            }]  
            let formValues = Object.assign({},this.state.formValues,{content1:url})
            this.setState({formValues},()=>{
                this.formRef.current?.setFieldsValue({content1:url})
            })
        }
    }

    removeUpload = (e:any) => {
        this.fileList = []
        let formValues = Object.assign({},this.state.formValues,{content1:'',content:''})
        this.state.formValues = formValues
        this.setState((prevState,props)=>{
            return formValues
        },()=>{
            console.log(formValues)
            this.formRef.current?.setFieldsValue({content1:''})
        })
    }

    public render() {

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
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
                render:(_:any,{type}:any)=>(
                    <span>{type==0?'纯文字':type==1?'图文':type==2?'图文':type==3?'自定义':type==4?'首页弹窗':'未知'}</span>
                )
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
                render: (_:any, record:any)=>(
                    record.status==0?'使用中':'禁用'
                )
            },
            {
                title: '操作',
                dataIndex: 'productState',
                key: 'productState',
                render: (_:any, record:any)=> (
                    <Space size="middle">
                        <a onClick={this.edit.bind(this,record)}>编辑</a>
                        <Popconfirm title="确定删除本条数据吗？" onConfirm={this.delete.bind(this,record)} okText="是" cancelText="否">
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                )
            },
        ];

        const { formValues, data, pagination, loading, isModalVisible } = this.state; 

        return <div>            
            <Card size="small" style={{ width: '100%',marginBottom:16 }}>
                <Form layout="inline"
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    onFinish={this.search}
                    >
                    <Form.Item name="position" label="位置">
                        <Select showSearch allowClear style={{ width: 200 }}>
                            <Option value="头部banner">头部banner</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="状态">
                        <Select showSearch allowClear style={{ width: 200 }}>
                            <Option value="1">禁用</Option>
                            <Option value="0">启用</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                    <Form.Item style={{flex:1,textAlign:'right'}}>
                        <Button type="primary" onClick={this.add}  loading={loading} style={{marginLeft:'3px'}}>
                            <PlusOutlined />
                            新增
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
             
            <Table 
                size="small"
                dataSource={data} 
                columns={columns} 
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
                    >
                    <Form.Item
                        label="广告位置"
                        name="position"
                        rules={[{ required: true, message: '请输入广告位置!' }]}
                    >
                        <Select showSearch allowClear>
                            <Option value="头部banner">头部banner</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="广告名称"
                        name="name"
                        rules={[{ required: true, message: '请输入广告名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="图片"
                        name="content1"
                        rules={[{ required: true, message: '请上传广告图片!' }]}
                    >
                        <Upload name="filename" 
                        fileList={this.fileList}
                        action="/v1/upload/file" listType="picture" data={{is_image:1}} onChange={this.upload} onRemove={this.removeUpload}>
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>
                        (宽640px/高260px)
                    </Form.Item>
                    <Form.Item
                        label="链接"
                        name="content2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: '请输入类型!' }]}
                    >
                        <Select showSearch allowClear>
                            <Option value={1}>图文</Option>
                        </Select>
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
                        <Select showSearch allowClear>
                            <Option value={1}>禁用</Option>
                            <Option value={0}>启用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>}
        </div>;
    }



}


export default productInfoComponent