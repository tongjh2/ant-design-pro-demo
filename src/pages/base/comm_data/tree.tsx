import { PlusOutlined, UploadOutlined, DownOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, message, Form, Input, Select, Table, Modal,Space,Popconfirm,Card,Row, Col,Upload, Breadcrumb,Tree     } from 'antd';
import React from 'react';
import type { CommDataItem } from './data.d';
import { commDataForm, commDataList, commDatadAdd, commDataDelete } from './service';
import { FormInstance } from 'antd/lib/form';
import { cloneDeep } from 'lodash';
const { Option } = Select;

let commDataForm2:CommDataItem = {
    sign: '',
    pid: 0,
    name: '',
    sort: 0,
    status: 0,
    content1: '',
    content2: '',
    content3: '',
  }

class commDataTreeComponent extends React.Component{

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
            sign: '1112',
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
        isModalVisible: false,
        treeData: []
    };

    formRef  = React.createRef<FormInstance>()    
    fileList:any[] = []
    columnsAll:any[] = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '来源分类',
            dataIndex: 'content1',
            key: 'content1', 
            sign:1112
        },
        {
            title: '类型',
            dataIndex: 'content2',
            key: 'content2',
            sign: 1112,
            render:(_:any,{content2}:any)=>{
                let text = ''                                       
                try {
                    let sourceType = JSON.parse(content2||'{}')
                    let arr = [];
                    if(sourceType.TuanGou==1)arr.push('团购');
                    if(sourceType.LaoDaiXin==1)arr.push('老带新');
                    if(sourceType.JingJia==1)arr.push('竞价');
                    if(sourceType.YuFu==1)arr.push('预付');
                    text = arr.join(',')
                } catch (error) {
                    console.log(content2)
                    console.log(error)
                } 
                return (text)
            }
        },
        { title: '联系人', dataIndex: 'content1', key: 'content1', sign:1116 },
        { title: '联系电话', dataIndex: 'content2', key: 'content2', sign:1116 },
        { title: '注册单位', dataIndex: 'content3', key: 'content3', sign:1116 },
        {
            title: '拼音码',
            dataIndex: 'pym',
            key: 'pym',
        },
        {
            title: '五笔码',
            dataIndex: 'wbm',
            key: 'wbm',
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
                record.status==0?'正常':'禁用'
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
    ]
    columns:any[] = []

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        let sign = (props.route.name.replace('comm_data.list.',''))
        let params = Object.assign({},this.state.params,{sign})
        this.state.params = params
        this.columns = this.columnsAll.filter((v:any)=>{
            return !v.sign || v.sign==sign
        })
        
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
        let res = await commDataList(params)
        this.treeData = this.formatTree((res.data.data||[]), 0)
        this.setState({
            loading: false,
            data: res.data.data||[],
            pagination: {
                total: res.data.pagenation.total,
                current: res.data.pagenation.page,
                pageSize: res.data.pagenation.page_size
            },
            treeData:this.treeData
        })
    }

    public formatTree(data:any[],pid:number){
        let arr:any[] = []
        data.forEach((v:any)=>{
            if(v.pid===pid){
                v.key = v.id
                v.title = (
                    <div>{v.name} 
                        <Button onClick={this.edit.bind(this,v)} size="small" type="link">编辑</Button>
                        <Button onClick={this.addChildren.bind(this,v)} size="small" type="link">新增子集</Button>
                    </div>
                )

                v.children = this.formatTree(data,v.id)
                arr.push(v)
            }
        })
        return arr
    }

    public add(){
        let formValues = cloneDeep(commDataForm)
        formValues.pid = 0
        formValues.sign = this.state.params.sign
        this.setState({
            formValues,
            isModalVisible:true
        })
    }

    
    public addChildren(item: CommDataItem){
        console.log(item)
        let formValues = cloneDeep(commDataForm)
        formValues.pid = item.id||0
        formValues.sign = item.sign
        this.setState({
            formValues,
            isModalVisible:true
        })
    }

    public edit(item: CommDataItem){
        console.log(item)
        let formValues = Object.assign({}, item)

        // this.fileList = []
        // if(item.content1){
        //     this.fileList = [{
        //         uid: this.fileList.length+1,
        //         name: "banner",
        //         status: 'done',
        //         url: item.content1
        //     }]
        // }

        this.setState({
            formValues,
            isModalVisible:true
        })
    }

    save = async(values:any)=>{
      const hide = message.loading('正在提交');
        console.log(values, this.fileList)
        let form = Object.assign({}, this.state.formValues, values)

        // if(this.fileList.length>0){
        //     let [img] = this.fileList
        //     form.content1 = img.url
        // }
        // let content = {
        //     content1:form.content1,
        //     content2:form.content2,
        // }
        // form.content = JSON.stringify(content); 
        try {
            const res = await commDatadAdd(form)
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
          const values = await this.formRef.current.validateFields();
          this.save(values);
        } catch (errorInfo) {
          console.log('Failed:', errorInfo);
          message.warn('提交校验失败')
        }
    }

    delete = async(item:CommDataItem)=>{
        try { 
            await commDataDelete(item.id||0);
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

    onSelect = ()=>{

    }

    treeData:any[] = []

    public render() {

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
          
       

        const { formValues, data, pagination, loading, isModalVisible,treeData } = this.state; 

        return <Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
                {/* <div style={{paddingBottom:"15px"}}>
                    <Breadcrumb>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item><a href="">基础数据</a></Breadcrumb.Item>
                        <Breadcrumb.Item>信息来源</Breadcrumb.Item>
                    </Breadcrumb>
                </div> */}
                <Form layout="inline"
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    style={{ marginBottom:15 }}
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

            <div style={{padding:'15px',background:'#fff'}}>
                <Tree
                showLine
                autoExpandParent
                selectable={false}
                switcherIcon={<DownOutlined />}
                onSelect={this.onSelect}
                treeData={treeData}
                />
            </div>
             
            {/* <Table 
                size="small"
                dataSource={data} 
                columns={this.columns} 
                rowKey={record => record.id}
                loading={loading} 
                pagination={pagination}
                onChange={this.handleTableChange}
            /> */}

            {isModalVisible && <Modal title="编辑" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form
                    {...layout}
                    ref={this.formRef}  
                    name="control-ref"
                    initialValues={formValues}
                    onFinish={this.save}
                    >
                    {/* <Form.Item
                        label="广告位置"
                        name="position"
                        rules={[{ required: true, message: '请输入广告位置!' }]}
                    >
                        <Select showSearch allowClear>
                            <Option value="头部banner">头部banner</Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: '请输入名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Form.Item
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
                    </Form.Item> */}

                    {/* <Form.Item
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
                    </Form.Item> */}
                    {/* <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请输入状态!' }]}
                    >
                        <Select showSearch allowClear>
                            <Option value={1}>禁用</Option>
                            <Option value={0}>启用</Option>
                        </Select>
                    </Form.Item> */}
                </Form>
            </Modal>}
        </Card>;
    }



}


export default commDataTreeComponent